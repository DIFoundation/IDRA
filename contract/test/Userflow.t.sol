// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";

import "../src/OrgRegistry.sol";
import "../src/CapsuleRegistry.sol";
import "../src/AccessControlManager.sol";
import "../src/EligibilityVerifier.sol";

contract FullComprehensiveFlowTest is Test {
    OrgRegistry orgRegistry;
    CapsuleRegistry capsuleRegistry;
    AccessControlManager acm;
    EligibilityVerifier verifier;

    // Actors
    address deployer = address(0xA1);
    address admin = address(0xA2);
    address userA = address(0x1000000000000000000000000000000000000001);
    address userB = address(0x1000000000000000000000000000000000000002);
    address nimc = address(0x2000000000000000000000000000000000000001);
    address inec = address(0x2000000000000000000000000000000000000002);
    address immigr = address(0x2000000000000000000000000000000000000003);
    address university = address(0x2000000000000000000000000000000000000004);
    address hospital = address(0x2000000000000000000000000000000000000005);
    address hospitalAgent = address(0x3000000000000000000000000000000000000001);
    address electionOfficer = address(0x3000000000000000000000000000000000000002);
    address airportAgent = address(0x3000000000000000000000000000000000000003);

    // Capsule IDs (client-generated)
    bytes32 constant CAPSULE_NIN = bytes32(0x1000000000000000000000000000000000000000000000000000000000000001);
    bytes32 constant CAPSULE_VOTER = bytes32(0x1000000000000000000000000000000000000000000000000000000000000002);
    bytes32 constant CAPSULE_PASSPORT = bytes32(0x1000000000000000000000000000000000000000000000000000000000000003);
    bytes32 constant CAPSULE_MATRIC = bytes32(0x1000000000000000000000000000000000000000000000000000000000000004);
    bytes32 constant CAPSULE_MEDICAL = bytes32(0x1000000000000000000000000000000000000000000000000000000000000005);

    // Example hashes / CIDs / metadata (fake)
    bytes32 constant HASH_NIN = keccak256(abi.encodePacked("nin-encrypted"));
    bytes32 constant HASH_VOTER = keccak256(abi.encodePacked("voter-encrypted"));
    bytes32 constant HASH_PASSPORT = keccak256(abi.encodePacked("passport-encrypted"));
    bytes32 constant HASH_MATRIC = keccak256(abi.encodePacked("matric-encrypted"));
    bytes32 constant HASH_MEDICAL = keccak256(abi.encodePacked("medical-encrypted"));

    string constant CID_NIN = "ipfs://QmNin";
    string constant CID_VOTER = "ipfs://QmVoter";
    string constant CID_PASS = "ipfs://QmPass";
    string constant CID_MATRIC = "ipfs://QmMatric";
    string constant CID_MED = "ipfs://QmMed";

    string constant SIGCID_NIMC = "ipfs://QmSigNIMC";
    string constant SIGCID_INEC = "ipfs://QmSigINEC";
    string constant SIGCID_IMM = "ipfs://QmSigIMM";
    string constant SIGCID_UNI = "ipfs://QmSigUNI";
    string constant SIGCID_HOSP = "ipfs://QmSigHOSP";

    string constant KEYCID_HOSP_WRAPPED = "ipfs://QmWrappedKeyHospital";
    string constant KEYCID_UNI_WRAPPED = "ipfs://QmWrappedKeyUni";
    string constant KEYCID_AIRPORT_WRAPPED = "ipfs://QmWrappedKeyAirport";

    bytes32 constant CLAIM_ISADULT = keccak256("claim:isAdult:userA");
    bytes32 constant CLAIM_VOTER = keccak256("claim:isVoter:userA");

    function setUp() public {
        // deploy contracts
        orgRegistry = new OrgRegistry(admin);
        capsuleRegistry = new CapsuleRegistry(admin);
        acm = new AccessControlManager(admin, address(capsuleRegistry));
        verifier = new EligibilityVerifier(admin);

        // Grant initial roles where necessary using admin
        vm.startPrank(admin);
        // grant issuer roles on capsuleRegistry & orgRegistry where needed later
        // also allow admin to act as registry admin; constructor already granted DEFAULT_ADMIN_ROLE & REGISTRY_ADMIN to admin
        vm.stopPrank();

        // Register organizations in OrgRegistry (this will be used off-chain to confirm keys)
        vm.startPrank(admin);
        orgRegistry.registerOrganization(nimc, "NIMC", address(nimc));
        orgRegistry.registerOrganization(inec, "INEC", address(inec));
        orgRegistry.registerOrganization(immigr, "Immigration", address(immigr));
        orgRegistry.registerOrganization(university, "Uni", address(university));
        orgRegistry.registerOrganization(hospital, "Hospital", address(hospital));

        vm.stopPrank();

        // Grant ISSUER_ROLE on CapsuleRegistry to these issuer addresses
        vm.startPrank(admin);
        capsuleRegistry.grantRole(capsuleRegistry.ISSUER_ROLE(), nimc);
        capsuleRegistry.grantRole(capsuleRegistry.ISSUER_ROLE(), inec);
        capsuleRegistry.grantRole(capsuleRegistry.ISSUER_ROLE(), immigr);
        capsuleRegistry.grantRole(capsuleRegistry.ISSUER_ROLE(), university);
        capsuleRegistry.grantRole(capsuleRegistry.ISSUER_ROLE(), hospital);

        // Grant VERIFIER_ROLE on EligibilityVerifier to electionOfficer
        verifier.grantRole(verifier.VERIFIER_ROLE(), electionOfficer);

        // (Optional) grant Registry admin on AccessControl & others if needed
        acm.grantRole(acm.REGISTRY_ADMIN(), admin);
        capsuleRegistry.grantRole(capsuleRegistry.REGISTRY_ADMIN(), admin);
        vm.stopPrank();

        // Give some ETH to actors for gas (not necessary for vm calls but nice)
        vm.deal(userA, 1 ether);
        vm.deal(userB, 1 ether);
        vm.deal(hospital, 1 ether);
        vm.deal(university, 1 ether);
    }

    function testFullComprehensiveScenario() public {
        // ----------------------------
        // 1) Users create capsules
        // ----------------------------
        vm.startPrank(userA);
        // NIN
        capsuleRegistry.addCapsule(CAPSULE_NIN, CID_NIN, HASH_NIN, CapsuleRegistry.CapsuleType.ID_NIN);
        // Voter card
        capsuleRegistry.addCapsule(CAPSULE_VOTER, CID_VOTER, HASH_VOTER, CapsuleRegistry.CapsuleType.ID_VOTER_CARD);
        // Passport
        capsuleRegistry.addCapsule(CAPSULE_PASSPORT, CID_PASS, HASH_PASSPORT, CapsuleRegistry.CapsuleType.ID_PASSPORT);
        // Matric ID
        capsuleRegistry.addCapsule(
            CAPSULE_MATRIC, CID_MATRIC, HASH_MATRIC, CapsuleRegistry.CapsuleType.EDUCATION_MATRIC_ID
        );
        // Medical profile
        capsuleRegistry.addCapsule(
            CAPSULE_MEDICAL, CID_MED, HASH_MEDICAL, CapsuleRegistry.CapsuleType.HEALTH_MEDICAL_PROFILE
        );
        vm.stopPrank();

        // Verify ownership and createdAt present for one capsule
        (,, string memory pCID, bytes32 h, address owner,,, bool exists, bool active) =
            capsuleRegistry.getCapsule(CAPSULE_NIN);
        assertTrue(exists);
        assertTrue(active);
        assertEq(owner, userA);
        assertEq(pCID, CID_NIN);
        assertEq(h, HASH_NIN);

        // ----------------------------
        // 2) Issuers attest their capsules
        // ----------------------------
        // NIMC attests NIN
        vm.startPrank(nimc);
        capsuleRegistry.attestCapsule(CAPSULE_NIN, SIGCID_NIMC);
        vm.stopPrank();

        // INEC attests voter card
        vm.startPrank(inec);
        capsuleRegistry.attestCapsule(CAPSULE_VOTER, SIGCID_INEC);
        vm.stopPrank();

        // Immigration attests passport
        vm.startPrank(immigr);
        capsuleRegistry.attestCapsule(CAPSULE_PASSPORT, SIGCID_IMM);
        vm.stopPrank();

        // University attests matric
        vm.startPrank(university);
        capsuleRegistry.attestCapsule(CAPSULE_MATRIC, SIGCID_UNI);
        vm.stopPrank();

        // Hospital attests medical profile
        vm.startPrank(hospital);
        capsuleRegistry.attestCapsule(CAPSULE_MEDICAL, SIGCID_HOSP);
        vm.stopPrank();

        // Confirm attestations present
        assertTrue(capsuleRegistry.hasAttestation(CAPSULE_NIN, nimc));
        assertTrue(capsuleRegistry.hasAttestation(CAPSULE_VOTER, inec));
        assertTrue(capsuleRegistry.hasAttestation(CAPSULE_PASSPORT, immigr));
        assertTrue(capsuleRegistry.hasAttestation(CAPSULE_MATRIC, university));
        assertTrue(capsuleRegistry.hasAttestation(CAPSULE_MEDICAL, hospital));

        // ----------------------------
        // 3) Access flows: Hospital requests access to medical profile
        // ----------------------------
        vm.startPrank(hospitalAgent);
        acm.requestAccess(CAPSULE_MEDICAL, "treatment", 3600);
        vm.stopPrank();
        // Off-chain: hospitalAgent should be notified (XMTP). In test, proceed to grant.

        // userA grants hospitalAgent access for medical capsule
        vm.startPrank(userA);
        acm.grantAccess(hospitalAgent, CAPSULE_MEDICAL, KEYCID_HOSP_WRAPPED, 3600);
        vm.stopPrank();

        // check allowed
        (bool allowedHospital, uint256 expiryHospital) = acm.isAllowed(userA, hospitalAgent, CAPSULE_MEDICAL);
        assertTrue(allowedHospital);
        assertGt(expiryHospital, block.timestamp);

        // hospitalAgent fetches the wrapped key CID
        vm.startPrank(hospitalAgent);
        string memory gotKey = acm.getWrappedKeyCID(userA, hospitalAgent, CAPSULE_MEDICAL);
        vm.stopPrank();
        assertEq(gotKey, KEYCID_HOSP_WRAPPED);

        // ----------------------------
        // 4) University requests matric ID for admin action (e.g., library)
        // ----------------------------
        vm.startPrank(university);
        acm.requestAccess(CAPSULE_MATRIC, "library-access", 7200);
        vm.stopPrank();

        // user grants
        vm.startPrank(userA);
        acm.grantAccess(address(university), CAPSULE_MATRIC, KEYCID_UNI_WRAPPED, 3600);
        vm.stopPrank();

        (bool allowedUni, uint256 expiryUni) = acm.isAllowed(userA, university, CAPSULE_MATRIC);
        assertTrue(allowedUni);

        // ----------------------------
        // 5) Airport agent requests passport + NIN for travel check
        // ----------------------------
        vm.startPrank(airportAgent);
        acm.requestAccess(CAPSULE_PASSPORT, "boarding", 600);
        vm.stopPrank();

        vm.startPrank(userA);
        acm.grantAccess(airportAgent, CAPSULE_PASSPORT, KEYCID_AIRPORT_WRAPPED, 600);
        vm.stopPrank();

        (bool allowedAirport, uint256 expiryAirport) = acm.isAllowed(userA, airportAgent, CAPSULE_PASSPORT);
        assertTrue(allowedAirport);

        // ----------------------------
        // 6) Voting eligibility proof (signed-claim flow) and logging
        // electionOfficer will record verification outcome
        // ----------------------------
        // Off-chain: a signed claim (isAdult=true & isVoter=true) is generated.
        // For test: electionOfficer calls recordEligibilityCheck (has VERIFIER_ROLE).
        vm.startPrank(electionOfficer);
        vm.expectEmit(true, true, true, true);
        emitLoggedEligibility(CLAIM_ISADULT, userA, true, "ipfs://QmClaimAdult");
        verifier.recordEligibilityCheck(CLAIM_ISADULT, userA, true, "ipfs://QmClaimAdult");
        verifier.recordEligibilityCheck(CLAIM_VOTER, userA, true, "ipfs://QmClaimVoter");
        vm.stopPrank();

        // Unauthorized actor (userB) should NOT be able to call recordEligibilityCheck
        vm.startPrank(userB);
        vm.expectRevert(); // onlyRole(VERIFIER_ROLE)
        verifier.recordEligibilityCheck(keccak256("x"), userB, true, "");
        vm.stopPrank();

        // ----------------------------
        // 7) Revocation flows
        // ----------------------------
        // a) User revokes hospital access early
        vm.startPrank(userA);
        acm.revokeAccess(hospitalAgent, CAPSULE_MEDICAL);
        vm.stopPrank();

        // Now check hospital no longer allowed
        (bool allowedAfterRevoke,) = acm.isAllowed(userA, hospitalAgent, CAPSULE_MEDICAL);
        assertFalse(allowedAfterRevoke);

        // b) Simulate expiry by granting a short-lived grant and fast-forwarding
        vm.startPrank(userA);
        acm.grantAccess(hospitalAgent, CAPSULE_MEDICAL, KEYCID_HOSP_WRAPPED, 10); // 10 seconds
        vm.stopPrank();

        (bool allowedShort, uint256 expShort) = acm.isAllowed(userA, hospitalAgent, CAPSULE_MEDICAL);
        assertTrue(allowedShort);

        // fast forward beyond expiry
        vm.warp(block.timestamp + 20);
        (bool allowedAfterWarp, uint256 expAfterWarp) = acm.isAllowed(userA, hospitalAgent, CAPSULE_MEDICAL);
        assertFalse(allowedAfterWarp);
        assertGt(block.timestamp, expAfterWarp); // expiry timestamp is in past relative to new time

        // getWrappedKeyCID should revert due to expiry
        vm.startPrank(hospitalAgent);
        vm.expectRevert(); // "grant missing" or "grant expired"
        acm.getWrappedKeyCID(userA, hospitalAgent, CAPSULE_MEDICAL);
        vm.stopPrank();

        // Reset time to original for remaining checks
        vm.warp(1);

        // c) Issuer revokes attestation (Hospital revokes their own attestation)
        vm.startPrank(hospital);
        capsuleRegistry.revokeAttestation(CAPSULE_MEDICAL);
        vm.stopPrank();

        assertFalse(capsuleRegistry.hasAttestation(CAPSULE_MEDICAL, hospital));

        // d) admin burns a capsule entry (e.g., NIN) — only REGISTRY_ADMIN
        vm.startPrank(admin);
        capsuleRegistry.burnCapsule(CAPSULE_NIN);
        vm.stopPrank();

        // getCapsule should revert now for burned capsule
        vm.expectRevert();
        capsuleRegistry.getCapsule(CAPSULE_NIN);

        // ----------------------------
        // 8) Unauthorized operations checks
        // ----------------------------
        // userB tries to update userA capsule -> should revert
        vm.startPrank(userB);
        vm.expectRevert();
        capsuleRegistry.updateCapsule(CAPSULE_VOTER, "ipfs://new", keccak256("new"));
        vm.stopPrank();

        // userB tries to grant on behalf of userA -> revert
        vm.startPrank(userB);
        vm.expectRevert();
        acm.grantAccess(userB, CAPSULE_VOTER, "ipfs://x", 1000);
        vm.stopPrank();

        // ----------------------------
        // 9) Final state assertions to ensure continuity
        // ----------------------------
        // remaining capsules still exist (except burned NIN)
        (,, string memory pidVoter,, address ownerVoter,,, bool existsV,) = capsuleRegistry.getCapsule(CAPSULE_VOTER);
        assertTrue(existsV);
        assertEq(ownerVoter, userA);
        assertEq(pidVoter, CID_VOTER);

        // Attestation still exists for INEC voterCard
        assertTrue(capsuleRegistry.hasAttestation(CAPSULE_VOTER, inec));

        // Confirm that userB (unauthorized) does not have any grants
        (bool bAllowed,) = acm.isAllowed(userA, userB, CAPSULE_VOTER);
        assertFalse(bAllowed);

        // test complete
    }

    // Helper to allow expectEmit to match our event; we replicate the event signature
    // We use this only for demonstration of event emission expectation for EligibilityChecked
    event EligibilityChecked(
        bytes32 indexed claimId,
        address indexed verifier,
        address indexed subject,
        bool eligible,
        string resultCID,
        uint256 timestamp
    );

    function emitLoggedEligibility(bytes32 claimId, address subject, bool eligible, string memory cid) internal {
        // This function is only used to satisfy vm.expectEmit in the test flow above.
        emit EligibilityChecked(claimId, address(electionOfficer), subject, eligible, cid, block.timestamp);
    }
}
