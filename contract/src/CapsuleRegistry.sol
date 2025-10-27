// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title CapsuleRegistry
/// @notice Registry for encrypted data capsules (off-chain payloads) and issuer attestations.
/// @dev Hybrid model: payload stored off-chain (payloadCID), capsule integrity anchored on-chain (capsuleHash).
///      Uses OpenZeppelin AccessControl for roles: REGISTRY_ADMIN and ISSUER_ROLE.
///      Attestations optionally include a signatureCID (off-chain location) so heavy signatures are not stored in state.
import "@openzeppelin/contracts/access/AccessControl.sol";

contract CapsuleRegistry is AccessControl {
    bytes32 public constant REGISTRY_ADMIN = keccak256("REGISTRY_ADMIN");
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    /// Capsule types for MVP
    enum CapsuleType {
        UNKNOWN,
        ID_NIN,
        ID_VOTER_CARD,
        ID_PASSPORT,
        EDUCATION_MATRIC_ID,
        HEALTH_MEDICAL_PROFILE,
        OTHER
    }

    struct Capsule {
        bytes32 capsuleId; // unique id chosen by client (e.g., keccak256(owner, nonce, timestamp))
        CapsuleType capsuleType;
        string payloadCID; // off-chain pointer (ipfs://, ar://, https://)
        bytes32 capsuleHash; // keccak256 of encrypted payload for integrity
        address owner; // wallet that created/owns the capsule
        uint256 createdAt;
        uint256 updatedAt;
        bool exists;
        bool active;
    }

    /// Attestation: stored lightly on-chain; heavy data (sig) stored off-chain via signatureCID
    struct Attestation {
        address issuer; // issuer wallet address
        uint256 timestamp; // unix time
        string signatureCID; // optional off-chain pointer to signature/proof (ipfs://...)
        bool exists;
    }

    /// capsuleId => Capsule
    mapping(bytes32 => Capsule) private _capsules;

    /// capsuleId => issuer => Attestation
    mapping(bytes32 => mapping(address => Attestation)) private _attestations;

    /// For enumeration if needed (keeps modest gas cost; push-only pushing addresses)
    bytes32[] private _capsuleIndex;

    /* Events */
    event CapsuleAdded(
        bytes32 indexed capsuleId,
        address indexed owner,
        CapsuleType capsuleType,
        string payloadCID,
        bytes32 capsuleHash,
        uint256 createdAt
    );
    event CapsuleUpdated(
        bytes32 indexed capsuleId, address indexed owner, string payloadCID, bytes32 capsuleHash, uint256 updatedAt
    );
    event CapsuleRevoked(bytes32 indexed capsuleId, address indexed by);
    event CapsuleActivated(bytes32 indexed capsuleId, address indexed by);

    event CapsuleAttested(bytes32 indexed capsuleId, address indexed issuer, string signatureCID, uint256 timestamp);
    event CapsuleAttestationRevoked(bytes32 indexed capsuleId, address indexed issuer, uint256 timestamp);

    constructor(address admin) {
        require(admin != address(0), "invalid admin");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(REGISTRY_ADMIN, admin);
    }

    // -----------------------
    // Capsule lifecycle
    // -----------------------

    /// @notice Add a capsule metadata record. Caller becomes owner.
    /// @param capsuleId Unique capsule id (client-generated)
    /// @param payloadCID Off-chain pointer to encrypted payload (ipfs://...)
    /// @param capsuleHash keccak256 of encrypted blob for integrity
    /// @param ctype CapsuleType enum value
    function addCapsule(bytes32 capsuleId, string calldata payloadCID, bytes32 capsuleHash, CapsuleType ctype)
        external
    {
        require(capsuleId != bytes32(0), "invalid id");
        require(!_capsules[capsuleId].exists, "capsule exists");

        _capsules[capsuleId] = Capsule({
            capsuleId: capsuleId,
            capsuleType: ctype,
            payloadCID: payloadCID,
            capsuleHash: capsuleHash,
            owner: msg.sender,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            exists: true,
            active: true
        });

        _capsuleIndex.push(capsuleId);

        emit CapsuleAdded(capsuleId, msg.sender, ctype, payloadCID, capsuleHash, block.timestamp);
    }

    /// @notice Owner (or REGISTRY_ADMIN) may update payloadCID or capsuleHash (e.g., re-upload).
    function updateCapsule(bytes32 capsuleId, string calldata newPayloadCID, bytes32 newCapsuleHash) external {
        require(_capsules[capsuleId].exists, "capsule missing");
        Capsule storage c = _capsules[capsuleId];
        require(msg.sender == c.owner || hasRole(REGISTRY_ADMIN, msg.sender), "not authorized");

        c.payloadCID = newPayloadCID;
        c.capsuleHash = newCapsuleHash;
        c.updatedAt = block.timestamp;

        emit CapsuleUpdated(capsuleId, msg.sender, newPayloadCID, newCapsuleHash, block.timestamp);
    }

    /// @notice Owner or admin can revoke (logical revoke) a capsule
    function revokeCapsule(bytes32 capsuleId) external {
        require(_capsules[capsuleId].exists, "capsule missing");
        Capsule storage c = _capsules[capsuleId];
        require(msg.sender == c.owner || hasRole(REGISTRY_ADMIN, msg.sender), "not authorized");

        c.active = false;
        c.updatedAt = block.timestamp;

        emit CapsuleRevoked(capsuleId, msg.sender);
    }

    /// @notice Reactivate a capsule (owner/admin)
    function activateCapsule(bytes32 capsuleId) external {
        require(_capsules[capsuleId].exists, "capsule missing");
        Capsule storage c = _capsules[capsuleId];
        require(msg.sender == c.owner || hasRole(REGISTRY_ADMIN, msg.sender), "not authorized");

        c.active = true;
        c.updatedAt = block.timestamp;

        emit CapsuleActivated(capsuleId, msg.sender);
    }

    // -----------------------
    // Attestations
    // -----------------------

    /// @notice Issuer attests to capsule integrity/contents. Issuer must have ISSUER_ROLE.
    /// @param capsuleId capsule id
    /// @param signatureCID Optional pointer to off-chain signature/proof (ipfs://...)
    function attestCapsule(bytes32 capsuleId, string calldata signatureCID) external onlyRole(ISSUER_ROLE) {
        require(_capsules[capsuleId].exists, "capsule missing");
        require(_capsules[capsuleId].active, "capsule inactive");

        Attestation storage a = _attestations[capsuleId][msg.sender];
        a.issuer = msg.sender;
        a.timestamp = block.timestamp;
        a.signatureCID = signatureCID;
        a.exists = true;

        emit CapsuleAttested(capsuleId, msg.sender, signatureCID, block.timestamp);
    }

    /// @notice Issuer revokes their attestation
    function revokeAttestation(bytes32 capsuleId) external onlyRole(ISSUER_ROLE) {
        require(_attestations[capsuleId][msg.sender].exists, "no attestation");
        delete _attestations[capsuleId][msg.sender];
        emit CapsuleAttestationRevoked(capsuleId, msg.sender, block.timestamp);
    }

    // -----------------------
    // Views & helpers
    // -----------------------

    function getCapsule(bytes32 capsuleId)
        external
        view
        returns (
            bytes32 id,
            CapsuleType ctype,
            string memory payloadCID,
            bytes32 capsuleHash,
            address owner,
            uint256 createdAt,
            uint256 updatedAt,
            bool exists,
            bool active
        )
    {
        Capsule storage c = _capsules[capsuleId];
        require(c.exists, "capsule missing");
        return (
            c.capsuleId,
            c.capsuleType,
            c.payloadCID,
            c.capsuleHash,
            c.owner,
            c.createdAt,
            c.updatedAt,
            c.exists,
            c.active
        );
    }

    /// @notice Check whether an issuer has attested this capsule
    function hasAttestation(bytes32 capsuleId, address issuer) external view returns (bool) {
        return _attestations[capsuleId][issuer].exists;
    }

    /// @notice Get attestation details for a capsule + issuer
    function getAttestation(bytes32 capsuleId, address issuer)
        external
        view
        returns (address attester, uint256 timestamp, string memory signatureCID, bool existsAtt)
    {
        Attestation storage a = _attestations[capsuleId][issuer];
        require(a.exists, "attestation missing");
        return (a.issuer, a.timestamp, a.signatureCID, a.exists);
    }

    /// @notice Simple helper to return list of capsuleIds (useful for off-chain indexing). Returns entire list.
    function listAllCapsules() external view returns (bytes32[] memory) {
        return _capsuleIndex;
    }

    /// @notice Admin-only: burn (delete) capsule entry (careful: does not delete off-chain payloads)
    function burnCapsule(bytes32 capsuleId) external onlyRole(REGISTRY_ADMIN) {
        require(_capsules[capsuleId].exists, "capsule missing");
        delete _capsules[capsuleId];
        emit CapsuleRevoked(capsuleId, msg.sender);
        // note: we do not remove capsuleId from _capsuleIndex to keep gas low
    }
}
