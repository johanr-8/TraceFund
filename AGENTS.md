# TraceFund — Project Memory File

## Project Identity
- **Name**: TraceFund — Blockchain-based Transparent Fund Disbursement and Fraud Detection System
- **Team**: Group 19 (Abel, Johan, Srilakshmi)
- **Type**: College mini-project

---

## Problem Statement
Public funds (subsidies, disaster relief, welfare) are disbursed as cash or bank transfers. Once money reaches a beneficiary, the government cannot:
- Control how it's spent
- Verify it was used for its intended purpose
- Trace the spending trail

This causes fund leakage, diversion, and corruption.

## Solution
Issue funds as **programmable digital tokens** with spending rules embedded in them. Rules are enforced automatically by **smart contracts** on a blockchain — no manual approval, no discretionary interference.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Smart Contracts | Solidity (Polygon / Ethereum testnet) |
| Backend | Python + FastAPI |
| Blockchain Bridge | Web3.py |
| Frontend | React / Next.js |
| Database (off-chain) | PostgreSQL |
| Fraud Detection | Python (graph-based transaction analysis) |

---

## Features & Module Assignments

### Johan — Backend Modules
1. **Smart Contract & Token Issuance** — Solidity contracts for creating tokens, embedding spending rules
2. **Blockchain Integration Layer** — Web3.py bridge connecting FastAPI to deployed contracts
3. **Rules Engine** — Validates transactions against fund category restrictions and vendor approval
4. **Fraud Detection** — Graph-based analysis for layering, mule accounts, rapid transfers
5. **Database & Backend API** — 7 tables (Users, Wallets, FundTypes, Vendors, Transactions, FraudFlags, AuditLogs) + REST endpoints

### Srilakshmi — Frontend Modules
6. **Wallet Management UI** — Beneficiary dashboard, balance, spend action, history
7. **Government Admin Dashboard UI** — Fund issuance form, disbursement monitoring
8. **Public Transparency Dashboard UI** — Aggregate category-wise utilization (no personal data)

### Abel — Frontend Modules
9. **Vendor Registration UI** — Sign-up form, category selection
10. **Vendor Approval UI** — Admin screen to approve/reject vendors
11. **Auditor Dashboard UI** — Flagged transactions, review-status management

---

## Core Workflow
1. Government issues tokens with spending rules (e.g., "Food only")
2. Beneficiary receives tokens in wallet
3. Beneficiary tries to spend at a vendor
4. Rules Engine + Smart Contract check: Is vendor approved for "Food"?
   - YES → Transaction approved, recorded immutably on blockchain
   - NO → Transaction automatically rejected
5. Fraud Detection continuously analyzes transaction patterns
6. Suspicious patterns flagged for Auditor review
7. Public Dashboard shows aggregate stats

---

## Key Principles
- **Auto-enforcement** — No manual approval, no discretionary interference
- **Immutability** — Every transaction permanently on blockchain
- **Privacy** — Public dashboard shows aggregate data only, never individual details
- **Proactive detection** — Fraud flags in near real-time

---

## Development Status
- [x] Backend project scaffold (FastAPI)
- [x] Database schema / models (User, Wallet, FundType, Vendor, Transaction, AuditLog)
- [x] Solidity smart contract (`TraceFundLedger.sol`) — on-chain fund issuance, spending enforcement, vendor management
- [x] Web3.py integration (`blockchain/web3_bridge.py`) — bridge with feature flag (`BLOCKCHAIN_ENABLED=false` by default)
- [x] Rules Engine — vendor category must match fund type + vendor approval_status check in `/spend`
- [ ] Fraud Detection module (not required for now)
- [x] Audit logging — auto-logs on register, issue-fund, spend, approve, reject
- [x] REST API endpoints — 20+ endpoints (see full list below)
- [x] Frontend project scaffold
- [x] Wallet Management UI (shows real backend data)
- [x] Government Admin Dashboard UI (issue fund form)
- [ ] Public Transparency Dashboard UI (mock data only — `/public` page)
- [x] Vendor Registration UI (wired to real backend — creates pending vendor profile)
- [x] Vendor Approval UI (admin page — lists pending vendors, approve button)
- [x] Vendor Dashboard UI (shows real vendor profile + transactions from backend)
- [x] Vendor Receive Payment UI (shows real vendor category from backend)
- [x] Beneficiary Pay UI (wired to real backend — lists approved vendors, calls POST /spend)
- [x] Beneficiary History UI (wired to real backend — GET /transactions)
- [x] Login role-based routing (government→/admin, vendor→/vendor, auditor→/auditor, beneficiary→/beneficiary)
- [ ] Auditor Dashboard UI (mock data only)
- [x] Vendor model: user_id FK, business_name, category, approval_status (pending/approved/rejected)
- [x] Seed script creates vendor users + approved vendor profiles

## Next Up (Priority Order)
1. **Wire remaining mock pages to real backend** — `/public`, `/auditor/*`
2. ~~**Blockchain integration**~~ — Done (Solidity + Web3.py, feature-flagged)

---

## Reference Files
- **UI_SPEC.md** — UI specification by role (reference only, do not build from without explicit instruction)

## Known Limitations

- **Role self-selection**: Registration lets anyone pick "government" or "auditor" as their role with no admin approval. In a real system, role assignment would require verification (email domain check, admin approval, etc.). For this demo, we trust users to pick the right role.
- **No JWT / session tokens**: Auth is localStorage-based. Logout = clearing storage. No server-side session enforcement yet.

## Session Log

### Session 1 (Initial)
- Summarized project from 3 uploaded documents (abstract.pdf, Abstract (2).pdf, 19-week1_doc.pdf)
- Created AGENTS.md (renamed from MEMORY.md) to preserve context across sessions

### Session 2 (Project Skeleton)
- Created project skeleton structure:
  - `backend/` with Python venv + FastAPI + uvicorn installed
  - `backend/main.py` — basic FastAPI entry point with health-check route
  - `backend/models/`, `routes/`, `blockchain/`, `fraud_detection/` — each with `__init__.py`
  - `frontend/` — Next.js 16 App Router scaffolded via `create-next-app`
  - `frontend/vendor/`, `auditor/`, `wallet/`, `admin/`, `public-dashboard/` — placeholder module dirs
  - Root `.gitignore` — excludes node_modules, venv, .env, __pycache__, .next
- No logic written yet — just skeleton structure for Git push

### Session 3 (Core Data Flow + Auth)
- Backend models: `User`, `Wallet`, `FundType` with SQLAlchemy + SQLite
- 5 API endpoints: `POST /register`, `POST /login`, `POST /issue-fund`, `GET /wallet/{id}`, `GET /fund-types`
- Frontend pages: `/`, `/register`, `/login`, `/admin` (issue fund form), `/wallet` (balance view)
- Login stores user info in localStorage; `/admin` redirects non-government users; `/wallet` auto-loads logged-in user
- Added passlib bcrypt password hashing
- Added negative-amount validation on `/issue-fund`
- Added `*.db` to `.gitignore`
- No blockchain, fraud detection, or vendor features yet

### Session 4 (UI Overhaul + Auth Improvements)
- Imported polished dark-theme UI from external sample (glassmorphism, sidebar layout, floating cards)
- New pages from sample: `/beneficiary` (wallet), `/beneficiary/pay`, `/beneficiary/history`, `/vendor/*` (4 pages), `/auditor/*` (2 pages), `/public` (transparency dashboard)
- Reusable components: Button, Card, Input, Table, StatusBadge, DashboardLayout
- Kept our custom pages (login, register, admin) restyled to match dark theme
- Login redirects to `/beneficiary` instead of `/wallet`; `/wallet` route removed
- DashboardLayout now reads user from localStorage (not hardcoded)
- Landing page Government card now links to `/admin`
- Fixed: wallet page shows **real backend data** instead of mockData.ts
- Fixed: logout uses button (not Link) so localStorage clears reliably
- Fixed: register validates role + minimum password length (4 chars)
- Fixed: issue-fund rejects if recipient isn't a "beneficiary" role
- Created `src/lib/api.ts` — single API_URL config instead of hardcoded per page
- Added loading states to admin and wallet pages
- Cleaned mock data categories to match backend (Food, Medicine, Education only)
- Removed unused default Next.js SVGs from public/
- Updated favicon from Next.js default to custom emoji icon
- Pushed to GitHub (https://github.com/johanr-8/TraceFund)

### Session 5 (Vendor Registration + Approval + Mock Cleanup)
- **Vendor model reworked**: `user_id` FK → users, `business_name` (was `name`), `approval_status` string (was `approved` bool), removed `address` field
- **Backend endpoints**:
  - `POST /vendors` — creates vendor with `approval_status='pending'`, validates user exists, prevents duplicate profiles
  - `POST /vendors/{id}/approve` — changes pending → approved
  - `GET /vendors` — now accepts `?status=`, `?user_id=`, `?category=` filters; defaults to approved only when no user_id
  - `POST /spend` — added approval_status check before allowing transaction
  - `/transactions` response uses `business_name`
- **Vendor Approval UI** (`/admin/vendors`) — admin page lists pending vendors with Approve button, shows approved list
- **Login routing fixed** — role-based redirects: government→/admin, vendor→/vendor, auditor→/auditor, beneficiary→/beneficiary
- **Vendor Dashboard wired to real backend** — fetches vendor profile via `GET /vendors?user_id=X`, transactions via `GET /transactions?vendor_id=X`, shows real total settled + registration status + payment history
- **Vendor Receive Payment wired to real backend** — fetches real business name + category
- **Seed script updated** — creates vendor user accounts with FK-linked vendor profiles, all pre-approved
- **Removed mock data** from vendor dashboard and receive pages (MOCK_VENDOR_TXS, MOCK_VENDORS no longer imported)
- Old DB deleted and re-seeded with new schema

### Session 6 (Blockchain + Backend Logic Complete)
- **Solidity Smart Contract** (`blockchain/contracts/TraceFundLedger.sol`):
  - On-chain user/vendor registration
  - Fund issuance (government → beneficiary wallet)
  - Spending with auto-enforcement: category match + vendor approval + balance check
  - All transactions immutably logged with timestamps
  - Role-based access (only owner/backend can call write functions)
- **Web3.py Bridge** (`blockchain/web3_bridge.py`):
  - Wraps all contract calls: `register_user`, `add_fund_type`, `register_vendor`, `approve_vendor`, `issue_fund`, `spend`, `get_balance`, `get_transaction`
  - Graceful no-ops when `BLOCKCHAIN_ENABLED=false` (returns `None`)
  - Config via `.env` — RPC URL, private key, contract address, chain ID
- **Blockchain config** (`blockchain/config.py`, `blockchain/.env.example`, `blockchain/abis/TraceFundLedger.json`)
- **AuditLog model** — `user_id`, `action`, `target_type`, `target_id`, `details`, `created_at`
- **Auto audit logging** on: register, issue-fund, spend, register-vendor, approve-vendor, reject-vendor
- **Vendor reject endpoint** — `POST /vendors/{vendor_id}/reject` (pending → rejected)
- **Fund type CRUD** — `POST /fund-types`, `PUT /fund-types/{id}`, `DELETE /fund-types/{id}` (blocked if in use)
- **Dashboard stats** — `GET /stats` (user counts, issued/spent totals, fund type breakdown)
- **Public transparency** — `GET /public/stats` (aggregate category-wise utilization, no personal data)
- **Single transaction detail** — `GET /transactions/{id}` (with sender + vendor names)
- **Vendor settlement** — `GET /vendors/{id}/settlement` (total received, tx count, category breakdown)
- **Blockchain status endpoints** — `GET /blockchain/status`, `/blockchain/balance/{user_id}/{fund_type_id}`, `/blockchain/transaction/{tx_id}`
- **requirements.txt updated** — added `web3==7.12.0`
- **main.py updated** — 343 lines, 20+ endpoints, blockchain bridge integration
