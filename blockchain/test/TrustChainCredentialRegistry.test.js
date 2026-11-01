const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TrustChainCredentialRegistry Smart Contract Suite", function () {
  let registry;
  let admin;
  let issuer;
  let unauthorizedAccount;
  let recipient;

  const sampleCredentialId = "TC-CRED-2026-X8Y9";
  const sampleDocHash = ethers.keccak256(ethers.toUtf8Bytes("TrustChain Original Certificate Document Bytes 2026"));
  const differentDocHash = ethers.keccak256(ethers.toUtf8Bytes("Tampered Modified Document Content"));
  const credentialType = "degree_certificate";

  beforeEach(async function () {
    [admin, issuer, unauthorizedAccount, recipient] = await ethers.getSigners();

    const TrustChainCredentialRegistry = await ethers.getContractFactory("TrustChainCredentialRegistry");
    registry = await TrustChainCredentialRegistry.deploy();
    await registry.waitForDeployment();
  });

  describe("1. Deployment & Admin Setup", function () {
    it("1. Successfully deploys with admin set to deployer", async function () {
      expect(await registry.admin()).to.equal(admin.address);
    });

    it("2. Automatically authorizes admin as issuer", async function () {
      expect(await registry.isIssuerAuthorized(admin.address)).to.be.true;
    });

    it("3. Starts with 0 registered and 0 revoked credentials", async function () {
      expect(await registry.totalRegisteredCredentials()).to.equal(0);
      expect(await registry.totalRevokedCredentials()).to.equal(0);
    });
  });

  describe("2. Issuer Authorization & Deactivation", function () {
    it("4. Admin can authorize a new issuer and emit IssuerAuthorized event", async function () {
      await expect(
        registry.connect(admin).authorizeIssuer(
          issuer.address,
          "Prof. John Doe",
          "Massachusetts Institute of Technology"
        )
      )
        .to.emit(registry, "IssuerAuthorized")
        .withArgs(issuer.address, "Prof. John Doe", "Massachusetts Institute of Technology", admin.address, (val) => val > 0);

      expect(await registry.isIssuerAuthorized(issuer.address)).to.be.true;
      expect(await registry.issuerNames(issuer.address)).to.equal("Prof. John Doe");
      expect(await registry.issuerOrganizations(issuer.address)).to.equal("Massachusetts Institute of Technology");
    });

    it("5. Rejects unauthorized accounts attempting to authorize issuers", async function () {
      await expect(
        registry.connect(unauthorizedAccount).authorizeIssuer(
          recipient.address,
          "Imposter",
          "Fake University"
        )
      ).to.be.revertedWithCustomError(registry, "OnlyAdminAllowed");
    });

    it("6. Admin can deactivate an issuer and prevent further registrations", async function () {
      await registry.connect(admin).authorizeIssuer(issuer.address, "Dean Adams", "Harvard University");
      expect(await registry.isIssuerAuthorized(issuer.address)).to.be.true;

      await expect(registry.connect(admin).deactivateIssuer(issuer.address))
        .to.emit(registry, "IssuerDeactivated")
        .withArgs(issuer.address, admin.address, (val) => val > 0);

      expect(await registry.isIssuerAuthorized(issuer.address)).to.be.false;

      // Deactivated issuer cannot register credentials
      await expect(
        registry.connect(issuer).registerCredential(sampleCredentialId, sampleDocHash, 0, credentialType)
      ).to.be.revertedWithCustomError(registry, "OnlyAuthorizedIssuerOrAdmin");
    });
  });

  describe("3. Credential Registration", function () {
    beforeEach(async function () {
      await registry.connect(admin).authorizeIssuer(issuer.address, "Registrar Office", "Stanford University");
    });

    it("7. Authorized issuer can successfully register a credential and emit CredentialRegistered", async function () {
      await expect(
        registry.connect(issuer).registerCredential(sampleCredentialId, sampleDocHash, 0, credentialType)
      )
        .to.emit(registry, "CredentialRegistered")
        .withArgs(sampleCredentialId, sampleDocHash, issuer.address, (val) => val > 0, 0, credentialType);

      expect(await registry.totalRegisteredCredentials()).to.equal(1);
    });

    it("8. Rejects registration from unauthorized accounts", async function () {
      await expect(
        registry.connect(unauthorizedAccount).registerCredential(sampleCredentialId, sampleDocHash, 0, credentialType)
      ).to.be.revertedWithCustomError(registry, "OnlyAuthorizedIssuerOrAdmin");
    });

    it("9. Rejects duplicate credential ID", async function () {
      await registry.connect(issuer).registerCredential(sampleCredentialId, sampleDocHash, 0, credentialType);

      const anotherHash = ethers.keccak256(ethers.toUtf8Bytes("Another Certificate"));
      await expect(
        registry.connect(issuer).registerCredential(sampleCredentialId, anotherHash, 0, credentialType)
      ).to.be.revertedWithCustomError(registry, "CredentialAlreadyExists");
    });

    it("10. Rejects duplicate document hash under a different credential ID", async function () {
      await registry.connect(issuer).registerCredential(sampleCredentialId, sampleDocHash, 0, credentialType);

      await expect(
        registry.connect(issuer).registerCredential("TC-CRED-ANOTHER-99", sampleDocHash, 0, credentialType)
      ).to.be.revertedWithCustomError(registry, "DocumentHashAlreadyRegistered");
    });

    it("11. Rejects registration with empty credential ID or zero hash", async function () {
      await expect(
        registry.connect(issuer).registerCredential("", sampleDocHash, 0, credentialType)
      ).to.be.revertedWithCustomError(registry, "EmptyCredentialId");

      await expect(
        registry.connect(issuer).registerCredential(sampleCredentialId, ethers.ZeroHash, 0, credentialType)
      ).to.be.revertedWithCustomError(registry, "InvalidDocumentHash");
    });
  });

  describe("4. Credential Verification", function () {
    beforeEach(async function () {
      await registry.connect(admin).authorizeIssuer(issuer.address, "Registrar Office", "Stanford University");
      await registry.connect(issuer).registerCredential(sampleCredentialId, sampleDocHash, 0, credentialType);
    });

    it("12. Verifies matching credential ID and matching hash as Active", async function () {
      const res = await registry.verifyCredential(sampleCredentialId, sampleDocHash);
      expect(res.exists).to.be.true;
      expect(res.hashMatches).to.be.true;
      expect(res.isActive).to.be.true;
      expect(res.isRevoked).to.be.false;
      expect(res.isExpired).to.be.false;
      expect(res.issuer).to.equal(issuer.address);
      expect(res.credentialType).to.equal(credentialType);
    });

    it("13. Accurately detects hash mismatch when file has been tampered", async function () {
      const res = await registry.verifyCredential(sampleCredentialId, differentDocHash);
      expect(res.exists).to.be.true;
      expect(res.hashMatches).to.be.false;
      expect(res.isActive).to.be.true;
    });

    it("14. Directly verifies credential by document hash via verifyByHash", async function () {
      const res = await registry.verifyByHash(sampleDocHash);
      expect(res.exists).to.be.true;
      expect(res.credentialId).to.equal(sampleCredentialId);
      expect(res.isActive).to.be.true;
      expect(res.issuer).to.equal(issuer.address);
    });

    it("15. Returns exists=false for unregistered credential ID or hash", async function () {
      const resById = await registry.verifyCredential("NON-EXISTENT-ID", sampleDocHash);
      expect(resById.exists).to.be.false;

      const resByHash = await registry.verifyByHash(differentDocHash);
      expect(resByHash.exists).to.be.false;
    });
  });

  describe("5. Credential Revocation", function () {
    beforeEach(async function () {
      await registry.connect(admin).authorizeIssuer(issuer.address, "Registrar Office", "Stanford University");
      await registry.connect(issuer).registerCredential(sampleCredentialId, sampleDocHash, 0, credentialType);
    });

    it("16. Issuer can revoke their credential and status updates to Revoked", async function () {
      await expect(
        registry.connect(issuer).revokeCredential(sampleCredentialId, "Clerical error in degree classification")
      )
        .to.emit(registry, "CredentialRevoked")
        .withArgs(sampleCredentialId, sampleDocHash, issuer.address, (val) => val > 0, "Clerical error in degree classification");

      const res = await registry.verifyCredential(sampleCredentialId, sampleDocHash);
      expect(res.exists).to.be.true;
      expect(res.isRevoked).to.be.true;
      expect(res.isActive).to.be.false;
      expect(await registry.totalRevokedCredentials()).to.equal(1);
    });

    it("17. Admin can revoke any credential, even if issued by another issuer", async function () {
      await expect(
        registry.connect(admin).revokeCredential(sampleCredentialId, "Regulatory compliance sanctions")
      ).to.emit(registry, "CredentialRevoked");

      const res = await registry.verifyCredential(sampleCredentialId, sampleDocHash);
      expect(res.isRevoked).to.be.true;
    });

    it("18. Rejects revocation from unauthorized third parties", async function () {
      await expect(
        registry.connect(unauthorizedAccount).revokeCredential(sampleCredentialId, "Malicious attempt")
      ).to.be.revertedWithCustomError(registry, "UnauthorizedRevoker");
    });

    it("19. Rejects double revocation of an already revoked credential", async function () {
      await registry.connect(issuer).revokeCredential(sampleCredentialId, "First revocation");

      await expect(
        registry.connect(issuer).revokeCredential(sampleCredentialId, "Second revocation")
      ).to.be.revertedWithCustomError(registry, "CredentialAlreadyRevoked");
    });
  });

  describe("6. Expiration Handling & Pagination", function () {
    it("20. Properly marks expired credentials as not active when block timestamp passes expiration", async function () {
      const expiringId = "TC-EXP-2026-001";
      const expHash = ethers.keccak256(ethers.toUtf8Bytes("Expiring Certificate"));
      const latestBlock = await ethers.provider.getBlock("latest");
      const expirationTimestamp = latestBlock.timestamp + 3600; // expires in 1 hour

      await registry.connect(admin).registerCredential(expiringId, expHash, expirationTimestamp, "internship_certificate");

      // Before expiration
      let res = await registry.verifyCredential(expiringId, expHash);
      expect(res.isActive).to.be.true;
      expect(res.isExpired).to.be.false;

      // Fast forward time by 2 hours
      await ethers.provider.send("evm_increaseTime", [7200]);
      await ethers.provider.send("evm_mine");

      // After expiration
      res = await registry.verifyCredential(expiringId, expHash);
      expect(res.isActive).to.be.false;
      expect(res.isExpired).to.be.true;
    });

    it("21. Correctly paginates credential ID list", async function () {
      for (let i = 1; i <= 5; i++) {
        const id = `TC-BATCH-${i}`;
        const hash = ethers.keccak256(ethers.toUtf8Bytes(`Doc ${i}`));
        await registry.connect(admin).registerCredential(id, hash, 0, "training_certificate");
      }

      expect(await registry.getCredentialCount()).to.equal(5);

      const page1 = await registry.getCredentialIds(0, 3);
      expect(page1.length).to.equal(3);
      expect(page1[0]).to.equal("TC-BATCH-1");
      expect(page1[2]).to.equal("TC-BATCH-3");

      const page2 = await registry.getCredentialIds(3, 3);
      expect(page2.length).to.equal(2);
      expect(page2[0]).to.equal("TC-BATCH-4");
      expect(page2[1]).to.equal("TC-BATCH-5");
    });
  });
});
