"""
TraceFund Web3 Bridge
---------------------
Connects FastAPI backend to the TraceFundLedger smart contract.

Usage:
    from blockchain import TraceFundBridge, BLOCKCHAIN_ENABLED

    bridge = TraceFundBridge()
    if BLOCKCHAIN_ENABLED:
        bridge.issue_fund(beneficiary_id=1, fund_type_id=1, amount=500)
        bridge.spend(sender_id=1, vendor_id=2, fund_type_id=1, amount=100)
"""

import json
import logging
from pathlib import Path
from web3 import Web3
from eth_account import Account

from .config import RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS, CHAIN_ID, BLOCKCHAIN_ENABLED

logger = logging.getLogger("tracefund.blockchain")

# ──── ABI Loading ────
ABI_PATH = Path(__file__).parent / "abis" / "TraceFundLedger.json"


def _load_abi() -> list:
    with open(ABI_PATH, "r") as f:
        return json.load(f)


class TraceFundBridge:
    """
    Python wrapper around the TraceFundLedger Solidity contract.

    All amounts are converted from float (backend) to int (on-chain, 18 decimals
    not needed — we use whole token units like the backend's float amounts cast to int).
    """

    def __init__(self):
        self.enabled = BLOCKCHAIN_ENABLED
        self.w3: Web3 | None = None
        self.contract = None
        self.account: Account | None = None

        if not self.enabled:
            logger.info("Blockchain integration DISABLED (BLOCKCHAIN_ENABLED=false)")
            return

        if not PRIVATE_KEY:
            logger.warning("BLOCKCHAIN_PRIVATE_KEY not set — blockchain calls will fail")
            return
        if not CONTRACT_ADDRESS:
            logger.warning("TRACEFUND_CONTRACT_ADDRESS not set — deploy contract first")
            return

        # Connect
        self.w3 = Web3(Web3.HTTPProvider(RPC_URL))
        if not self.w3.is_connected():
            logger.error(f"Cannot connect to blockchain node at {RPC_URL}")
            return

        self.account = Account.from_key(PRIVATE_KEY)
        abi = _load_abi()
        self.contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(CONTRACT_ADDRESS),
            abi=abi,
        )
        logger.info(
            f"Blockchain connected — chain={self.w3.eth.chain_id}, "
            f"contract={CONTRACT_ADDRESS}, account={self.account.address}"
        )

    def _send_tx(self, fn) -> dict:
        """
        Build, sign, send a transaction and wait for receipt.
        Returns the transaction hash and block number.
        """
        if not self.enabled or not self.w3 or not self.contract or not self.account:
            raise RuntimeError("Blockchain not configured")

        tx = fn.build_transaction({
            "from": self.account.address,
            "nonce": self.w3.eth.get_transaction_count(self.account.address),
            "chainId": CHAIN_ID,
            "gas": 500_000,
            "gasPrice": self.w3.eth.gas_price,
        })
        signed = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed.raw_transaction)
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        logger.info(f"TX mined — hash={tx_hash.hex()}, block={receipt['blockNumber']}")
        return {"tx_hash": tx_hash.hex(), "block_number": receipt["blockNumber"]}

    # ──────────────────── Write Operations ────────────────────

    def register_user(self, user_id: int) -> dict | None:
        """Register a user on-chain (called when a user is created)."""
        if not self.enabled or not self.contract:
            return None
        try:
            fn = self.contract.functions.registerUser(user_id)
            return self._send_tx(fn)
        except Exception as e:
            logger.error(f"register_user failed: {e}")
            return None

    def add_fund_type(self, fund_type_id: int, name: str) -> dict | None:
        """Add a fund type on-chain."""
        if not self.enabled or not self.contract:
            return None
        try:
            fn = self.contract.functions.addFundType(fund_type_id, name)
            return self._send_tx(fn)
        except Exception as e:
            logger.error(f"add_fund_type failed: {e}")
            return None

    def register_vendor(self, vendor_id: int, user_id: int, business_name: str, category: str) -> dict | None:
        """Register a vendor on-chain."""
        if not self.enabled or not self.contract:
            return None
        try:
            fn = self.contract.functions.registerVendor(vendor_id, user_id, business_name, category)
            return self._send_tx(fn)
        except Exception as e:
            logger.error(f"register_vendor failed: {e}")
            return None

    def approve_vendor(self, vendor_id: int) -> dict | None:
        """Approve a vendor on-chain."""
        if not self.enabled or not self.contract:
            return None
        try:
            fn = self.contract.functions.approveVendor(vendor_id)
            return self._send_tx(fn)
        except Exception as e:
            logger.error(f"approve_vendor failed: {e}")
            return None

    def issue_fund(self, beneficiary_id: int, fund_type_id: int, amount: float) -> dict | None:
        """
        Issue fund tokens to a beneficiary's on-chain wallet.
        Amount is cast to int (whole token units).
        """
        if not self.enabled or not self.contract:
            return None
        try:
            amount_int = int(amount)
            fn = self.contract.functions.issueFund(beneficiary_id, fund_type_id, amount_int)
            return self._send_tx(fn)
        except Exception as e:
            logger.error(f"issue_fund failed: {e}")
            return None

    def spend(self, sender_id: int, vendor_id: int, fund_type_id: int, amount: float) -> dict | None:
        """
        Execute a spend transaction on-chain.
        The contract enforces category match + vendor approval + balance check.
        Returns tx info if successful, raises if contract reverts.
        """
        if not self.enabled or not self.contract:
            return None
        try:
            amount_int = int(amount)
            fn = self.contract.functions.spend(sender_id, vendor_id, fund_type_id, amount_int)
            return self._send_tx(fn)
        except Exception as e:
            logger.error(f"spend failed: {e}")
            raise  # Re-raise so the API can return an error

    # ──────────────────── Read Operations ────────────────────

    def get_balance(self, user_id: int, fund_type_id: int) -> int | None:
        """Get on-chain balance for a user + fund type."""
        if not self.enabled or not self.contract:
            return None
        try:
            return self.contract.functions.getBalance(user_id, fund_type_id).call()
        except Exception as e:
            logger.error(f"get_balance failed: {e}")
            return None

    def get_transaction(self, tx_id: int) -> dict | None:
        """Get an on-chain transaction record."""
        if not self.enabled or not self.contract:
            return None
        try:
            result = self.contract.functions.getTransaction(tx_id).call()
            return {
                "id": result[0],
                "sender_id": result[1],
                "vendor_id": result[2],
                "fund_type_id": result[3],
                "amount": result[4],
                "status": "Approved" if result[5] == 1 else "Rejected",
                "timestamp": result[6],
            }
        except Exception as e:
            logger.error(f"get_transaction failed: {e}")
            return None

    def is_connected(self) -> bool:
        """Check if the bridge is connected to a live node."""
        if not self.enabled or not self.w3:
            return False
        return self.w3.is_connected()
