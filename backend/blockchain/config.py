import os
from dotenv import load_dotenv

load_dotenv()

# ──── Blockchain Network ────
# For local development: use Hardhat / Ganache
# For testnet: use Polygon Mumbai RPC
RPC_URL = os.getenv("BLOCKCHAIN_RPC_URL", "http://127.0.0.1:8545")

# Deployer private key (NEVER commit real keys — use .env)
PRIVATE_KEY = os.getenv("BLOCKCHAIN_PRIVATE_KEY", "")

# Contract address after deployment (set in .env after deploying)
CONTRACT_ADDRESS = os.getenv("TRACEFUND_CONTRACT_ADDRESS", "")

# Chain ID (31337 = Hardhat local, 80001 = Mumbai testnet)
CHAIN_ID = int(os.getenv("BLOCKCHAIN_CHAIN_ID", "31337"))

# ──── Feature Flag ────
# Set to "true" to enable blockchain writes; "false" = SQLite-only (default)
BLOCKCHAIN_ENABLED = os.getenv("BLOCKCHAIN_ENABLED", "false").lower() == "true"
