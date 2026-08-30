// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title TraceFundLedger
 * @notice On-chain ledger for transparent fund disbursement and spending enforcement.
 *         Government issues category-locked tokens to beneficiaries.
 *         Beneficiaries spend only at approved vendors in the matching category.
 *         All transactions recorded immutably on-chain.
 */
contract TraceFundLedger {

    // ──────────────────────── Events ────────────────────────
    event FundIssued(uint256 indexed beneficiaryId, uint256 indexed fundTypeId, uint256 amount, uint256 timestamp);
    event SpendingExecuted(uint256 indexed senderId, uint256 indexed vendorId, uint256 indexed fundTypeId, uint256 amount, uint256 timestamp);
    event VendorRegistered(uint256 indexed vendorId, uint256 indexed userId, string businessName, string category);
    event VendorApproved(uint256 indexed vendorId);
    event FundTypeAdded(uint256 indexed fundTypeId, string name);

    // ──────────────────────── Structs ────────────────────────
    struct FundType {
        uint256 id;
        string name;
        bool exists;
    }

    struct VendorInfo {
        uint256 userId;
        string businessName;
        string category;
        VendorStatus status;
    }

    struct TransactionRecord {
        uint256 id;
        uint256 senderId;
        uint256 vendorId;
        uint256 fundTypeId;
        uint256 amount;
        TransactionStatus status;
        uint256 timestamp;
    }

    enum VendorStatus { None, Pending, Approved, Rejected }
    enum TransactionStatus { None, Approved, Rejected }

    // ──────────────────────── State ────────────────────────
    address public owner;

    mapping(uint256 => FundType) public fundTypes;
    uint256 public fundTypeCount;

    // wallets[beneficiaryId][fundTypeId] => balance
    mapping(uint256 => mapping(uint256 => uint256)) public wallets;

    mapping(uint256 => VendorInfo) public vendors;
    uint256 public vendorCount;

    mapping(uint256 => TransactionRecord) public transactions;
    uint256 public transactionCount;

    // user_id => is registered (for quick lookup)
    mapping(uint256 => bool) public registeredUsers;

    // ──────────────────────── Modifiers ────────────────────────
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier userExists(uint256 userId) {
        require(registeredUsers[userId], "User not registered on-chain");
        _;
    }

    // ──────────────────────── Constructor ────────────────────────
    constructor() {
        owner = msg.sender;
    }

    // ──────────────────────── Admin Functions ────────────────────────

    /**
     * @notice Register a user on-chain (called when a user is created in the backend).
     */
    function registerUser(uint256 userId) external onlyOwner {
        registeredUsers[userId] = true;
    }

    /**
     * @notice Add a fund type (e.g., "Food", "Medicine", "Education").
     */
    function addFundType(uint256 id, string memory name) external onlyOwner {
        require(!fundTypes[id].exists, "Fund type already exists");
        fundTypes[id] = FundType(id, name, true);
        fundTypeCount++;
        emit FundTypeAdded(id, name);
    }

    // ──────────────────────── Vendor Functions ────────────────────────

    /**
     * @notice Register a vendor on-chain.
     */
    function registerVendor(uint256 vendorId, uint256 userId, string memory businessName, string memory category)
        external
        onlyOwner
        userExists(userId)
    {
        vendors[vendorId] = VendorInfo(userId, businessName, category, VendorStatus.Pending);
        vendorCount++;
        emit VendorRegistered(vendorId, userId, businessName, category);
    }

    /**
     * @notice Approve a vendor (admin action).
     */
    function approveVendor(uint256 vendorId) external onlyOwner {
        require(vendors[vendorId].status == VendorStatus.Pending, "Vendor not pending");
        vendors[vendorId].status = VendorStatus.Approved;
        emit VendorApproved(vendorId);
    }

    // ──────────────────────── Core Functions ────────────────────────

    /**
     * @notice Issue fund tokens to a beneficiary's on-chain wallet.
     *         Only callable by the owner (government backend).
     * @param beneficiaryId Backend user ID of the beneficiary.
     * @param fundTypeId Backend fund type ID.
     * @param amount Number of tokens to issue.
     */
    function issueFund(uint256 beneficiaryId, uint256 fundTypeId, uint256 amount)
        external
        onlyOwner
        userExists(beneficiaryId)
    {
        require(fundTypes[fundTypeId].exists, "Fund type does not exist");
        require(amount > 0, "Amount must be positive");

        wallets[beneficiaryId][fundTypeId] += amount;
        emit FundIssued(beneficiaryId, fundTypeId, amount, block.timestamp);
    }

    /**
     * @notice Spend tokens at a vendor. Enforces:
     *         1. Vendor must be approved
     *         2. Vendor category must match fund type
     *         3. Beneficiary must have sufficient balance
     * @param senderId Backend user ID of the beneficiary.
     * @param vendorId Backend vendor ID.
     * @param fundTypeId Backend fund type ID.
     * @param amount Number of tokens to spend.
     * @return success Whether the transaction succeeded.
     */
    function spend(uint256 senderId, uint256 vendorId, uint256 fundTypeId, uint256 amount)
        external
        onlyOwner
        userExists(senderId)
        returns (bool success)
    {
        require(fundTypes[fundTypeId].exists, "Fund type does not exist");
        require(vendors[vendorId].status == VendorStatus.Approved, "Vendor not approved");
        require(amount > 0, "Amount must be positive");

        // Category enforcement: vendor category must match fund type name
        bytes32 vendorCat = keccak256(abi.encodePacked(vendors[vendorId].category));
        bytes32 fundName  = keccak256(abi.encodePacked(fundTypes[fundTypeId].name));
        require(vendorCat == fundName, "Vendor category does not match fund type");

        // Balance check
        require(wallets[senderId][fundTypeId] >= amount, "Insufficient balance");

        // Execute transfer
        wallets[senderId][fundTypeId] -= amount;

        // Record transaction
        uint256 txId = transactionCount + 1;
        transactions[txId] = TransactionRecord(
            txId, senderId, vendorId, fundTypeId, amount, TransactionStatus.Approved, block.timestamp
        );
        transactionCount = txId;

        emit SpendingExecuted(senderId, vendorId, fundTypeId, amount, block.timestamp);
        return true;
    }

    // ──────────────────────── View Functions ────────────────────────

    /**
     * @notice Get a beneficiary's on-chain balance for a specific fund type.
     */
    function getBalance(uint256 userId, uint256 fundTypeId) external view returns (uint256) {
        return wallets[userId][fundTypeId];
    }

    /**
     * @notice Get a transaction record by ID.
     */
    function getTransaction(uint256 txId) external view returns (TransactionRecord memory) {
        require(txId > 0 && txId <= transactionCount, "Invalid transaction ID");
        return transactions[txId];
    }

    /**
     * @notice Get vendor info by ID.
     */
    function getVendor(uint256 vendorId) external view returns (VendorInfo memory) {
        return vendors[vendorId];
    }
}
