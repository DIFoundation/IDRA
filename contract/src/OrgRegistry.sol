// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title OrgRegistry
 * @notice Registry for trusted organizations who can issue attestations.
 *
 * Roles:
 * - SUPER_ADMIN: Can add/remove ORG_ADMIN
 * - ORG_ADMIN: Can register/deregister organizations and assign issuer roles
 */
import "@openzeppelin/contracts/access/AccessControl.sol";

contract OrgRegistry is AccessControl {
    bytes32 public constant ORG_ADMIN = keccak256("ORG_ADMIN");
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    struct Organization {
        string name;
        address issuerSigningKey; // Public key used to verify attestations
        bool active;
    }

    mapping(address => Organization) public orgInfo;
    address[] public allOrgs;

    event OrganizationRegistered(address indexed orgAddress, string name, address issuerSigningKey);

    event OrganizationUpdated(address indexed orgAddress, string name, address issuerSigningKey, bool active);

    event OrganizationRevoked(address indexed orgAddress);

    constructor(address superAdmin) {
        require(superAdmin != address(0), "Invalid admin");
        _grantRole(DEFAULT_ADMIN_ROLE, superAdmin);
        _grantRole(ORG_ADMIN, superAdmin);
    }

    // ======================================================
    // =============== Organization Management ==============
    // ======================================================

    function registerOrganization(address orgAddress, string calldata name, address issuerSigningKey)
        external
        onlyRole(ORG_ADMIN)
    {
        require(orgAddress != address(0), "Invalid address");
        require(!orgInfo[orgAddress].active, "Already registered");

        orgInfo[orgAddress] = Organization({name: name, issuerSigningKey: issuerSigningKey, active: true});

        allOrgs.push(orgAddress);

        // issuer key can sign capsule attestations
        _grantRole(ISSUER_ROLE, orgAddress);

        emit OrganizationRegistered(orgAddress, name, issuerSigningKey);
    }

    function updateOrganization(address orgAddress, string calldata name, address newIssuerSigningKey, bool active)
        external
        onlyRole(ORG_ADMIN)
    {
        require(orgInfo[orgAddress].active, "Not registered");

        orgInfo[orgAddress].name = name;
        orgInfo[orgAddress].issuerSigningKey = newIssuerSigningKey;
        orgInfo[orgAddress].active = active;

        if (!active) {
            _revokeRole(ISSUER_ROLE, orgAddress);
        }

        emit OrganizationUpdated(orgAddress, name, newIssuerSigningKey, active);
    }

    function revokeOrganization(address orgAddress) external onlyRole(ORG_ADMIN) {
        require(orgInfo[orgAddress].active, "Not registered");

        orgInfo[orgAddress].active = false;
        _revokeRole(ISSUER_ROLE, orgAddress);

        emit OrganizationRevoked(orgAddress);
    }

    // ======================================================
    // ==================== View Helpers ====================
    // ======================================================

    function getAllOrganizations() external view returns (address[] memory) {
        return allOrgs;
    }

    function isTrustedIssuer(address orgAddress) external view returns (bool) {
        return hasRole(ISSUER_ROLE, orgAddress) && orgInfo[orgAddress].active;
    }
}
