// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title EligibilityVerifier
/// @notice Minimal contract to record lightweight verification events (QR / zk-lite checks).
/// - Keeps on-chain audit trail only (no PII).
/// - Verifier apps perform off-chain proof verification and call this to log results.
/// - Uses AccessControl to restrict who can emit verification events.

import "@openzeppelin/contracts/access/AccessControl.sol";

contract EligibilityVerifier is AccessControl {
    bytes32 public constant REGISTRY_ADMIN = keccak256("REGISTRY_ADMIN");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    /// @notice A compact record emitted when a verifier checks a claim.
    /// claimId: unique id for the claim/proof (e.g., sha256(capsuleId|predicate|nonce))
    /// verifier: address that performed the verification (app/service)
    /// subject: subject wallet address (or 0x0 if anonymous)
    /// eligible: boolean result
    /// resultCID: optional off-chain pointer (ipfs://...) to signed proof bundle for audits
    /// timestamp: block timestamp when recorded
    event EligibilityChecked(
        bytes32 indexed claimId,
        address indexed verifier,
        address indexed subject,
        bool eligible,
        string resultCID,
        uint256 timestamp
    );

    constructor(address admin) {
        require(admin != address(0), "admin zero");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(REGISTRY_ADMIN, admin);
        // optionally grant VERIFIER_ROLE to admin initially:
        _grantRole(VERIFIER_ROLE, admin);
    }

    /// @notice Verifier logs the outcome of an off-chain proof verification
    /// @param claimId unique id for this claim/proof
    /// @param subject wallet of the subject (or address(0) if not provided)
    /// @param eligible boolean result of verification
    /// @param resultCID optional ipfs/arweave pointer to full signed proof (audit)
    function recordEligibilityCheck(bytes32 claimId, address subject, bool eligible, string calldata resultCID)
        external
        onlyRole(VERIFIER_ROLE)
    {
        emit EligibilityChecked(claimId, msg.sender, subject, eligible, resultCID, block.timestamp);
    }

    /// @notice Admin can grant verifier role to a new verifier service
    function addVerifier(address verifier) external onlyRole(REGISTRY_ADMIN) {
        _grantRole(VERIFIER_ROLE, verifier);
    }

    /// @notice Admin can revoke verifier role
    function removeVerifier(address verifier) external onlyRole(REGISTRY_ADMIN) {
        _revokeRole(VERIFIER_ROLE, verifier);
    }
}
