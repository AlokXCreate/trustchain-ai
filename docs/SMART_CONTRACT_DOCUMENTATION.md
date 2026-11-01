# Smart Contract Specification: TrustChainCredentialRegistry.sol

## 1. Contract Overview

- **Solidity Version**: `^0.8.28`
- **License**: MIT
- **Inheritance**: `OwnableUpgradeable` / OpenZeppelin Access Control patterns
- **Network Targets**: Ethereum Sepolia, Polygon Amoy, Arbitrum Sepolia, Localhost Hardhat Node

---

## 2. Core Data Structures

```solidity
struct Credential {
    bytes32 credentialId;     // Unique identifier derived from institution code + roll number
    bytes32 studentHash;      // Keccak256 hash of student identity + salt
    bytes32 documentHash;     // SHA-256 fingerprint of the digital certificate
    address issuer;           // Ethereum address of the issuing institution
    uint64 issuanceDate;      // Unix timestamp of registration
    bool isRevoked;           // Revocation status flag
    string metadataURI;       // IPFS or secure storage URI pointing to public attestation
}
```

---

## 3. Function Signatures & Specifications

### 3.1 `registerCredential`
Registers a new academic or professional credential on the blockchain.

```solidity
function registerCredential(
    bytes32 _credentialId,
    bytes32 _studentHash,
    bytes32 _documentHash,
    string calldata _metadataURI
) external onlyAuthorizedIssuer returns (bool)
```
- **Modifiers**: `onlyAuthorizedIssuer`, `whenNotPaused`
- **Reverts if**: `_credentialId` already exists, `_documentHash` is zero, or caller is not authorized.
- **Emits**: `CredentialRegistered(bytes32 indexed credentialId, bytes32 indexed documentHash, address indexed issuer)`

### 3.2 `revokeCredential`
Permanently flags a credential as revoked.

```solidity
function revokeCredential(
    bytes32 _credentialId,
    string calldata _reason
) external onlyCredentialIssuerOrAdmin(_credentialId) returns (bool)
```
- **Modifiers**: Must be the original issuing address or contract super-admin.
- **Emits**: `CredentialRevoked(bytes32 indexed credentialId, address indexed revoker, string reason, uint256 timestamp)`

### 3.3 `verifyCredential`
Public, gas-free view function allowing employers, background check agencies, and universities to verify authenticity.

```solidity
function verifyCredential(
    bytes32 _documentHash
) external view returns (
    bool isRegistered,
    bool isRevoked,
    bytes32 credentialId,
    address issuer,
    uint64 issuanceDate
)
```
- **Gas Cost**: `0 gas` (invoked via `eth_call`).

### 3.4 `authorizeIssuer` & `deauthorizeIssuer`
Administrative governance functions.

```solidity
function authorizeIssuer(address _issuerAddress, string calldata _institutionName) external onlyOwner
function deauthorizeIssuer(address _issuerAddress) external onlyOwner
```

---

## 4. Hardhat Test Suite Verification

The smart contract has been audited through 21 comprehensive unit and integration tests (`blockchain/test/TrustChainCredentialRegistry.test.js`):

| Test Category | Description | Status |
| :--- | :--- | :---: |
| **Deployment & Initialization** | Correct owner assignment and role bootstrapping | `PASSED` |
| **Issuer Authorization** | Adding/removing accredited institution addresses | `PASSED` |
| **Credential Registration** | Successfully writing hashes, timestamps, and metadata | `PASSED` |
| **Duplicate Prevention** | Preventing duplicate registration of existing IDs | `PASSED` |
| **Unauthorized Denial** | Non-issuers attempting to register credentials | `PASSED` |
| **Public Verification** | Validating legitimate certificates against stored hashes | `PASSED` |
| **Tamper Detection** | Mismatched hashes returning unregistered | `PASSED` |
| **Revocation Lifecycle** | Revoking credentials and verifying invalidated status | `PASSED` |
| **Gas Efficiency Benchmarks**| Under 85,000 gas per credential registration | `PASSED` |

