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
- [x] Database schema / models (User, Wallet, FundType)
- [ ] Solidity smart contracts
- [ ] Web3.py integration
- [ ] Rules Engine (basic category-match in issue-fund)
- [ ] Fraud Detection module
- [x] REST API endpoints (register, login, issue-fund, fund-types, users, wallet)
- [x] Frontend project scaffold
- [x] Wallet Management UI (shows real backend data)
- [x] Government Admin Dashboard UI (issue fund form)
- [ ] Public Transparency Dashboard UI (mock data only)
- [x] Vendor Registration UI (mock data only)
- [ ] Vendor Approval UI
- [x] Auditor Dashboard UI (mock data only)

## Next Up (Priority Order)
1. **Beneficiary → Spend flow** — wire `/beneficiary/pay` to a real backend endpoint. This is the core feature of the project's pitch. Needs: new `POST /spend` endpoint, Vendors table model, vendor registration backend.
2. **Vendor registration backend** — `POST /vendors`, `GET /vendors` endpoints to support the spend flow.
3. **Transaction history** — store transactions in DB, serve via API, display on `/beneficiary/history`.
4. **Wire remaining mock pages to real backend** — `/public`, `/vendor/*`, `/auditor/*`
5. **Blockchain integration** — Solidity contracts + Web3.py (future sprint)

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
