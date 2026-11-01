// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TrustChainCredentialRegistry
 * @dev High-integrity smart contract for digital credential registration, verification,
 * and revocation on EVM-compatible blockchains.
 *
 * Privacy-First Architecture:
 * - NO Personally Identifiable Information (PII) is stored on-chain.
 * - Stores only opaque unique credential IDs, SHA-256 cryptographic document hashes,
 *   authorized issuer addresses, timestamps, and credential status.
 */
contract TrustChainCredentialRegistry {
    // --- Enums & Structs ---

    enum CredentialStatus {
        Active,
        Revoked,
        Expired
    }

    struct Credential {
        string credentialId;
        bytes32 documentHash;
        address issuer;
        uint256 issueTimestamp;
        uint256 expirationTimestamp; // 0 indicates no expiration
        CredentialStatus status;
        uint256 revocationTimestamp;
        string credentialType; // e.g. "degree_certificate", "marksheet", "internship_certificate"
    }

    // --- State Variables ---

    address public admin;
    uint256 public totalRegisteredCredentials;
    uint256 public totalRevokedCredentials;

    // Authorized issuers registry
    mapping(address => bool) public authorizedIssuers;
    mapping(address => string) public issuerNames;
    mapping(address => string) public issuerOrganizations;

    // Credential records: credentialId => Credential
    mapping(string => Credential) private credentials;
    // Fast lookup: documentHash => credentialId
    mapping(bytes32 => string) private hashToCredentialId;

    // List of credential IDs for enumeration/auditing
    string[] private credentialIdList;

    // --- Events ---

    event IssuerAuthorized(
        address indexed issuerAddress,
        string name,
        string organization,
        address indexed authorizedBy,
        uint256 timestamp
    );

    event IssuerDeactivated(
        address indexed issuerAddress,
        address indexed deactivatedBy,
        uint256 timestamp
    );

    event CredentialRegistered(
        string indexed credentialId,
        bytes32 indexed documentHash,
        address indexed issuerAddress,
        uint256 issueTimestamp,
        uint256 expirationTimestamp,
        string credentialType
    );

    event CredentialRevoked(
        string indexed credentialId,
        bytes32 indexed documentHash,
        address indexed revokedBy,
        uint256 revocationTimestamp,
        string reason
    );

    // --- Custom Errors ---

    error OnlyAdminAllowed();
    error OnlyAuthorizedIssuerOrAdmin();
    error InvalidAddress();
    error EmptyCredentialId();
    error InvalidDocumentHash();
    error CredentialAlreadyExists(string credentialId);
    error DocumentHashAlreadyRegistered(bytes32 documentHash, string existingCredentialId);
    error CredentialNotFound(string credentialId);
    error CredentialAlreadyRevoked(string credentialId);
    error UnauthorizedRevoker();

    // --- Modifiers ---

    modifier onlyAdmin() {
        if (msg.sender != admin) revert OnlyAdminAllowed();
        _;
    }

    modifier onlyAuthorizedIssuer() {
        if (!authorizedIssuers[msg.sender] && msg.sender != admin) {
            revert OnlyAuthorizedIssuerOrAdmin();
        }
        _;
    }

    // --- Constructor ---

    constructor() {
        admin = msg.sender;
        // Administrator is automatically an authorized issuer
        authorizedIssuers[msg.sender] = true;
        issuerNames[msg.sender] = "TrustChain System Administrator";
        issuerOrganizations[msg.sender] = "TrustChain AI Governance Authority";

        emit IssuerAuthorized(
            msg.sender,
            issuerNames[msg.sender],
            issuerOrganizations[msg.sender],
            msg.sender,
            block.timestamp
        );
    }

    // --- Issuer Management Functions ---

    /**
     * @notice Authorizes a new issuer address to register credentials.
     * @param _issuer Wallet address of the issuer.
     * @param _name Descriptive name of the authorized authority or officer.
     * @param _organization Official institution/university name.
     */
    function authorizeIssuer(
        address _issuer,
        string calldata _name,
        string calldata _organization
    ) external onlyAdmin {
        if (_issuer == address(0)) revert InvalidAddress();

        authorizedIssuers[_issuer] = true;
        issuerNames[_issuer] = _name;
        issuerOrganizations[_issuer] = _organization;

        emit IssuerAuthorized(
            _issuer,
            _name,
            _organization,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @notice Deactivates an existing issuer address.
     * @param _issuer Wallet address to deactivate.
     */
    function deactivateIssuer(address _issuer) external onlyAdmin {
        if (_issuer == address(0)) revert InvalidAddress();
        authorizedIssuers[_issuer] = false;

        emit IssuerDeactivated(_issuer, msg.sender, block.timestamp);
    }

    /**
     * @notice Checks whether an address is currently an authorized issuer.
     * @param _issuer Wallet address to check.
     */
    function isIssuerAuthorized(address _issuer) external view returns (bool) {
        return authorizedIssuers[_issuer];
    }

    // --- Credential Registration ---

    /**
     * @notice Registers a new credential with its unique ID and cryptographic SHA-256 hash.
     * @param _credentialId Unique identifier for the credential (e.g. TC-CRED-2026-X8Y9).
     * @param _documentHash SHA-256 hash of the original document bytes.
     * @param _expirationTimestamp Unix timestamp when credential expires (0 if lifetime validity).
     * @param _credentialType Category of credential (e.g. "degree_certificate").
     */
    function registerCredential(
        string calldata _credentialId,
        bytes32 _documentHash,
        uint256 _expirationTimestamp,
        string calldata _credentialType
    ) external onlyAuthorizedIssuer {
        if (bytes(_credentialId).length == 0) revert EmptyCredentialId();
        if (_documentHash == bytes32(0)) revert InvalidDocumentHash();

        // Check if credential ID is already registered
        if (credentials[_credentialId].issueTimestamp > 0) {
            revert CredentialAlreadyExists(_credentialId);
        }

        // Check if hash is already registered under another credential ID
        if (bytes(hashToCredentialId[_documentHash]).length > 0) {
            revert DocumentHashAlreadyRegistered(
                _documentHash,
                hashToCredentialId[_documentHash]
            );
        }

        // Store credential record
        credentials[_credentialId] = Credential({
            credentialId: _credentialId,
            documentHash: _documentHash,
            issuer: msg.sender,
            issueTimestamp: block.timestamp,
            expirationTimestamp: _expirationTimestamp,
            status: CredentialStatus.Active,
            revocationTimestamp: 0,
            credentialType: _credentialType
        });

        hashToCredentialId[_documentHash] = _credentialId;
        credentialIdList.push(_credentialId);
        totalRegisteredCredentials++;

        emit CredentialRegistered(
            _credentialId,
            _documentHash,
            msg.sender,
            block.timestamp,
            _expirationTimestamp,
            _credentialType
        );
    }

    // --- Credential Verification ---

    /**
     * @notice Verifies a credential given its ID and claimed document hash.
     * @param _credentialId Unique identifier of the credential.
     * @param _documentHash Cryptographic hash of the document presented for verification.
     */
    function verifyCredential(
        string calldata _credentialId,
        bytes32 _documentHash
    )
        external
        view
        returns (
            bool exists,
            bool hashMatches,
            bool isActive,
            bool isRevoked,
            bool isExpired,
            address issuer,
            uint256 issueTimestamp,
            uint256 expirationTimestamp,
            string memory credentialType
        )
    {
        Credential memory cred = credentials[_credentialId];
        if (cred.issueTimestamp == 0) {
            return (false, false, false, false, false, address(0), 0, 0, "");
        }

        exists = true;
        hashMatches = (cred.documentHash == _documentHash);
        isRevoked = (cred.status == CredentialStatus.Revoked);
        isExpired = (cred.expirationTimestamp > 0 && block.timestamp >= cred.expirationTimestamp);
        isActive = (cred.status == CredentialStatus.Active && !isExpired);
        issuer = cred.issuer;
        issueTimestamp = cred.issueTimestamp;
        expirationTimestamp = cred.expirationTimestamp;
        credentialType = cred.credentialType;
    }

    /**
     * @notice Verifies a credential directly by the document's SHA-256 hash.
     * @param _documentHash Cryptographic SHA-256 hash of the document bytes.
     */
    function verifyByHash(bytes32 _documentHash)
        external
        view
        returns (
            bool exists,
            string memory credentialId,
            bool isActive,
            bool isRevoked,
            bool isExpired,
            address issuer,
            uint256 issueTimestamp,
            uint256 expirationTimestamp,
            string memory credentialType
        )
    {
        credentialId = hashToCredentialId[_documentHash];
        if (bytes(credentialId).length == 0) {
            return (false, "", false, false, false, address(0), 0, 0, "");
        }

        Credential memory cred = credentials[credentialId];
        exists = true;
        isRevoked = (cred.status == CredentialStatus.Revoked);
        isExpired = (cred.expirationTimestamp > 0 && block.timestamp >= cred.expirationTimestamp);
        isActive = (cred.status == CredentialStatus.Active && !isExpired);
        issuer = cred.issuer;
        issueTimestamp = cred.issueTimestamp;
        expirationTimestamp = cred.expirationTimestamp;
        credentialType = cred.credentialType;
    }

    /**
     * @notice Gets the full stored credential record by ID.
     * @param _credentialId Unique identifier of the credential.
     */
    function getCredential(string calldata _credentialId)
        external
        view
        returns (Credential memory)
    {
        if (credentials[_credentialId].issueTimestamp == 0) {
            revert CredentialNotFound(_credentialId);
        }
        return credentials[_credentialId];
    }

    // --- Credential Revocation ---

    /**
     * @notice Revokes a previously registered credential.
     * @dev Only the issuer who registered it or the admin can revoke.
     * @param _credentialId Unique identifier of the credential.
     * @param _reason Audit reason for revocation (e.g. "Certificate issued in error" or "Misconduct").
     */
    function revokeCredential(
        string calldata _credentialId,
        string calldata _reason
    ) external {
        Credential storage cred = credentials[_credentialId];
        if (cred.issueTimestamp == 0) revert CredentialNotFound(_credentialId);
        if (cred.status == CredentialStatus.Revoked) revert CredentialAlreadyRevoked(_credentialId);

        // Security check: only admin or the original issuer can revoke
        if (msg.sender != admin && msg.sender != cred.issuer) {
            revert UnauthorizedRevoker();
        }

        cred.status = CredentialStatus.Revoked;
        cred.revocationTimestamp = block.timestamp;
        totalRevokedCredentials++;

        emit CredentialRevoked(
            _credentialId,
            cred.documentHash,
            msg.sender,
            block.timestamp,
            _reason
        );
    }

    /**
     * @notice Returns total number of registered credentials.
     */
    function getCredentialCount() external view returns (uint256) {
        return totalRegisteredCredentials;
    }

    /**
     * @notice Returns an array of registered credential IDs with pagination.
     * @param _offset Starting index.
     * @param _limit Maximum items to return.
     */
    function getCredentialIds(uint256 _offset, uint256 _limit)
        external
        view
        returns (string[] memory)
    {
        uint256 total = credentialIdList.length;
        if (_offset >= total) {
            return new string[](0);
        }

        uint256 end = _offset + _limit;
        if (end > total) {
            end = total;
        }

        uint256 count = end - _offset;
        string[] memory result = new string[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = credentialIdList[_offset + i];
        }
        return result;
    }
}
