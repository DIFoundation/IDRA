// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AccessControlManager
 * @notice Manage access requests, grants, and revocations for capsules (hybrid model).
 * - Stores minimal grant metadata on-chain (wrappedKeyCID pointer to off-chain wrapped key).
 * - Emits events so off-chain services (backend / XMTP) can notify participants and deliver keys.
 * - Integrates with CapsuleRegistry for basic checks.
 *
 * Security notes:
 * - Never store raw keys on-chain. `wrappedKeyCID` is an off-chain pointer (e.g., ipfs://).
 * - Owners must approve grants (by calling grantAccess) from their wallet or via authenticated backend.
 * - Consider gating grant calls with owner-signed messages if using a backend relay.
 *
 * Roles:
 * - DEFAULT_ADMIN_ROLE: admin for governance (multisig recommended)
 * - REGISTRY_ADMIN: administrative maintenance
 *
 * Usage:
 * 1. Caller requests access -> `requestAccess(...)` emits AccessRequested event.
 * 2. Owner grants via `grantAccess(...)` providing wrappedKeyCID and duration.
 * 3. Grantee checks `isAllowed(owner, grantee, capsuleId)` or listens to AccessGranted event.
 * 4. Owner can `revokeAccess(...)` any time.
 */
import "@openzeppelin/contracts/access/AccessControl.sol";

interface ICapsuleRegistry {
    function getCapsule(bytes32 capsuleId)
        external
        view
        returns (
            bytes32 id,
            uint8 ctype, // enum stored as uint8 in ABI
            string memory payloadCID,
            bytes32 capsuleHash,
            address owner,
            uint256 createdAt,
            uint256 updatedAt,
            bool exists,
            bool active
        );
}

contract AccessControlManager is AccessControl {
    bytes32 public constant REGISTRY_ADMIN = keccak256("REGISTRY_ADMIN");

    struct AccessGrant {
        address owner; // capsule owner who granted access
        address grantee; // grantee (wallet or service)
        bytes32 capsuleId; // capsule being granted
        string wrappedKeyCID; // off-chain pointer to wrapped symmetric key (ipfs://...)
        uint256 expiry; // unix timestamp
        bool exists;
    }

    // key = keccak256(abi.encodePacked(owner, grantee, capsuleId))
    mapping(bytes32 => AccessGrant) private _grants;

    // Optional request tracking (helps UX)
    event AccessRequested(
        address indexed requester,
        bytes32 indexed capsuleId,
        string purpose,
        uint256 requestedDuration,
        uint256 timestamp
    );
    event AccessGranted(
        address indexed owner, address indexed grantee, bytes32 indexed capsuleId, string wrappedKeyCID, uint256 expiry
    );
    event AccessRevoked(address indexed owner, address indexed grantee, bytes32 indexed capsuleId);
    event GrantExpired(address indexed owner, address indexed grantee, bytes32 indexed capsuleId);

    ICapsuleRegistry public capsuleRegistry;

    constructor(address admin, address capsuleRegistryAddress) {
        require(admin != address(0), "invalid admin");
        require(capsuleRegistryAddress != address(0), "invalid capsule registry");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(REGISTRY_ADMIN, admin);
        capsuleRegistry = ICapsuleRegistry(capsuleRegistryAddress);
    }

    /// @notice Emit an access request event. Off-chain systems (XMTP/backend) should listen and notify the owner.
    /// @param capsuleId The capsule the requester wants to access
    /// @param purpose Human-friendly purpose of request (e.g., "hospital-consult", "voting")
    /// @param requestedDuration Suggested duration seconds (owner can accept different)
    function requestAccess(bytes32 capsuleId, string calldata purpose, uint256 requestedDuration) external {
        // basic check: capsule exists and active
        (,,,, address owner,,, bool exists, bool active) = capsuleRegistry.getCapsule(capsuleId);
        require(exists && active, "capsule missing/inactive");

        emit AccessRequested(msg.sender, capsuleId, purpose, requestedDuration, block.timestamp);

        // Off-chain: owner receives XMTP + UI prompt to call grantAccess(...)
    }

    /// @notice Grant access to a grantee. Owner (or REGISTRY_ADMIN) must call.
    /// @param grantee Wallet address of grantee (could be service)
    /// @param capsuleId Capsule to grant
    /// @param wrappedKeyCID Off-chain pointer to wrapped key (ipfs://...). MUST be accessible to grantee.
    /// @param durationSeconds Duration from now for which the grant is valid
    function grantAccess(address grantee, bytes32 capsuleId, string calldata wrappedKeyCID, uint256 durationSeconds)
        external
    {
        require(grantee != address(0), "invalid grantee");
        (,,,, address owner,,, bool exists, bool active) = capsuleRegistry.getCapsule(capsuleId);
        require(exists && active, "capsule missing/inactive");

        // Only owner or admin can grant
        require(msg.sender == owner || hasRole(REGISTRY_ADMIN, msg.sender), "not authorized");

        uint256 expiry = block.timestamp + durationSeconds;
        bytes32 k = _key(owner, grantee, capsuleId);
        _grants[k] = AccessGrant({
            owner: owner,
            grantee: grantee,
            capsuleId: capsuleId,
            wrappedKeyCID: wrappedKeyCID,
            expiry: expiry,
            exists: true
        });

        emit AccessGranted(owner, grantee, capsuleId, wrappedKeyCID, expiry);
    }

    /// @notice Revoke an existing grant early. Can be called by owner or admin.
    function revokeAccess(address grantee, bytes32 capsuleId) external {
        (,,,, address owner,,, bool exists,) = capsuleRegistry.getCapsule(capsuleId);
        require(exists, "capsule missing");
        require(msg.sender == owner || hasRole(REGISTRY_ADMIN, msg.sender), "not authorized");

        bytes32 k = _key(owner, grantee, capsuleId);
        require(_grants[k].exists, "no grant");
        delete _grants[k];
        emit AccessRevoked(owner, grantee, capsuleId);
    }

    /// @notice Check whether grantee currently allowed to access capsule
    /// @return allowed true if allowed, expiry timestamp
    function isAllowed(address owner, address grantee, bytes32 capsuleId)
        external
        view
        returns (bool allowed, uint256 expiry)
    {
        bytes32 k = _key(owner, grantee, capsuleId);
        AccessGrant storage g = _grants[k];
        if (!g.exists) return (false, 0);
        if (block.timestamp > g.expiry) return (false, g.expiry);
        return (true, g.expiry);
    }

    /// @notice Fetch wrappedKeyCID pointer (only returns stored pointer; enforcement is off-chain via expiry check)
    function getWrappedKeyCID(address owner, address grantee, bytes32 capsuleId)
        external
        view
        returns (string memory)
    {
        bytes32 k = _key(owner, grantee, capsuleId);
        AccessGrant storage g = _grants[k];
        require(g.exists, "grant missing");
        require(block.timestamp <= g.expiry, "grant expired");
        return g.wrappedKeyCID;
    }

    /// @notice Internal helper key
    function _key(address owner, address grantee, bytes32 capsuleId) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(owner, grantee, capsuleId));
    }

    /// @notice Sweep function to clear expired grants (optional gas-saving helper)
    /// Emits GrantExpired for each removed grant. Admin-only to avoid extra gas by random callers.
    function sweepExpiredGrants(bytes32[] calldata keys) external onlyRole(REGISTRY_ADMIN) {
        for (uint256 i = 0; i < keys.length; i++) {
            bytes32 k = keys[i];
            AccessGrant storage g = _grants[k];
            if (g.exists && block.timestamp > g.expiry) {
                emit GrantExpired(g.owner, g.grantee, g.capsuleId);
                delete _grants[k];
            }
        }
    }
}
