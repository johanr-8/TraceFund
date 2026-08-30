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
- [x] Public Transparency Dashboard UI (wired to real backend — `GET /public/stats` on `/public`)
- [ ] Public Transparency Dashboard UI (mock data only — `/public` page)
- [x] Vendor Registration UI (wired to real backend — creates pending vendor profile)
- [x] Vendor Approval UI (admin page — lists pending/approved/rejected vendors, approve + reject buttons)
- [x] Vendor Dashboard UI (shows real vendor profile + transactions from backend)
- [x] Vendor Receive Payment UI (shows real vendor category from backend)
- [x] Beneficiary Pay UI (wired to real backend — lists approved vendors, calls POST /spend)
- [x] Beneficiary History UI (wired to real backend — GET /transactions)
- [x] Login role-based routing (government→/admin, vendor→/vendor, auditor→/auditor, beneficiary→/beneficiary)
- [x] Auditor Dashboard UI (wired to real backend — `GET /transactions` + client-side fraud heuristics: velocity, high-value, outliers)
- [x] Auditor Transaction Trail UI (wired to real backend — `GET /transactions` + `GET /transactions/{id}` for sender names)
- [x] Auditor Investigate modal (wired to real `GET /transactions/{id}` — shows real vendor/beneficiary/category/amount; freeze/dismiss review-status tracked client-side)
- [x] Vendor Settings UI (wired to real backend — real business name/category/approval-status; contact email persisted to localStorage since backend has no vendor-update endpoint)
- [x] Vendor model: user_id FK, business_name, category, approval_status (pending/approved/rejected)
- [x] Seed script creates vendor users + approved vendor profiles

## Next Up (Priority Order)
1. ~~**Wire remaining mock pages to real backend**~~ — Done (`/public`, `/auditor/*`, `/admin/vendors` reject, `/vendor/settings` all wired)
1. **Wire remaining mock pages to real backend** — `/public`, `/auditor/*`
2. ~~**Blockchain integration**~~ — Done (Solidity + Web3.py, feature-flagged)

---

## Reference Files
- **UI_SPEC.md** — UI specification by role (reference only, do not build from without explicit instruction)

## Known Limitations

- **Role provisioning**: Public registration (`POST /register`) is now restricted to **beneficiary** and **vendor** roles only. Government and auditor accounts are created by a government admin via `POST /admin/users` (see "Manage Staff Accounts" on `/admin`). Note: the admin endpoint is not itself authenticated server-side (no JWT/sessions yet) — any caller can call it, though only the government UI surfaces it.
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

### Session 7 (UI Completion — Mock Cleanup)
- **`/public` wired to real backend** — replaced `MOCK_AGGREGATE_DATA` with `GET /public/stats`; shows real totals (issued/spent, tx count, active vendors) + category breakdown
- **`/auditor` wired to real backend** — fetches `GET /transactions` + per-tx `/transactions/{id}`; implements a **client-side fraud heuristic** (high-value outliers vs mean/stddev, velocity/rapid successive transfers, large single transfers) to compute risk scores + flag suspicious tx
- **`/auditor/trail` wired to real backend** — fetches `GET /transactions` and enriches with sender names via `/transactions/{id}`
- **Auditor Investigate modal uses real backend** — `investigateTransaction` server action now calls `GET /transactions/{id}` and computes flags from real data; modal shows real vendor/beneficiary/category/amount; freeze/dismiss review-status tracked client-side (no backend fraud-flag persistence yet)
- **`/vendor/settings` wired to real backend** — fetches real business name/category/approval-status from `GET /vendors?user_id=`; contact email persisted to localStorage (backend has no vendor-update endpoint)
- **Vendor reject added** — `/admin/vendors` pending list now has a **Reject** button calling `POST /vendors/{id}/reject`; added a "Rejected Vendors" section
- All mock-data imports for these pages removed; the DB currently has 0 transactions, so auditor/public empty states are correct until funds are issued/spent

### Session 8 (Role Provisioning — Public Self-Reg vs Admin Staff)
- **Public `/register` restricted** — frontend role dropdown now only offers **Beneficiary** and **Vendor** (government/auditor removed)
- **Backend `/register` enforced** — added `SELF_REGISTER_ROLES = {"beneficiary", "vendor"}`; self-registering as government/auditor now returns 400 `"Self-registration is only available for beneficiaries and vendors"`
- **New staff-provisioning endpoint** — `POST /admin/users` accepts only `government`/`auditor` roles (returns 400 otherwise); creates hashed-passwd user, calls `bridge.register_user`, logs `admin_create_user` audit entry. `STAFF_ROLES = {"government", "auditor"}`
- **Admin dashboard "Manage Staff Accounts"** — `/admin` now has a form (name/email/password/role) to create government or auditor accounts via `POST /admin/users`, plus a table listing existing government + auditor users (fetched via `GET /users?role=government` and `?role=auditor`)
- Tested live: self-reg auditor/gov rejected; self-reg beneficiary OK; admin create auditor/gov OK; admin create beneficiary/vendor rejected

### Session 9 (Login Page UI Redesign)
- **Redesigned Login Page (`/login`)**: Replaced standard login card with a split-screen design matching user reference image.
- **Hero Section**: Added `TraceFund` gradient header, tagline, 3D isometric cube network vector with glowing nodes & central core cube (`@keyframes float`), and `Create Account` link.
- **Glassmorphic Portal Card**: Added dark glass container, top circular node badge, `Access your Portal` header, custom cyan SVG bracket connector line, and interactive `Login As:` dropdown (*Beneficiary*, *Government*, *Vendor*, *Auditor*).
- **Interactive Role Controls**: Portal selection dynamically updates button text (`Login as Beneficiary`, `Login as Government`, etc.) and pre-configures portal context. Added `Alternative Portal Logins` quick-switch pills (`Vendor/Auditor`, `Government`, `Beneficiary`) and a bottom-right glowing sparkle accent.
- **Backend Connectivity**: Fully wired to `POST /login` (`API_URL/login`), persists user context in `localStorage`, and handles automatic role-based navigation (`/admin`, `/vendor`, `/auditor`, `/beneficiary`).

### Session 10 (Register Page UI Redesign)
- **Redesigned Register Page (`/register`)**: Replaced standard card with a split-screen design matching user reference image.
- **Hero Section**: Added `TraceFund` gradient header, tagline, 3D isometric cube network vector (`@keyframes float`), and `Create Your TraceFund Account` / `Join the transparent ecosystem` hero footer.
- **Glassmorphic Registration Card**: Added dark glass panel with electric cyan border glow, top circular badge with "T" logo inside node network, and `Complete Your Registration` header.
- **Form Fields & Validation**: Fields for `Full Name`, `Email Address`, `Account Role` (*Beneficiary* / *Vendor*), `Create Password`, and `Confirm Password`. Added client-side password matching and minimum length validation.
- **Backend Connectivity**: Fully wired to `POST /register` (`API_URL/register`), shows smooth success notification, and automatically redirects user to `/login`.

### Session 11 (System Orchestration Landing Page Redesign)
- **Redesigned Root Landing Page (`/`)**: Replaced basic card list with a System Orchestration layout matching user reference image.
- **Hero Section ("Transparency in Motion")**: Added `TRANSPARENCY IN MOTION` backdrop watermark typography, `TraceFund` gradient title, tagline, 3D isometric translucent cube matrix vector with radiating horizontal cyan energy streams, and `THE SECURE FOUNDATION OF MODERN FUNDING` baseline text.
- **System Orchestration Hub Card**: Added dark glass container with electric cyan border glow, `System Orchestration` header, and central glowing core node badge with "T" logo sending SVG connector lines (`Portal-line`, `Light-line`) to 4 interactive portal cards (*Beneficiary*, *Vendor*, *Auditor*, *Public Transparency*).
- **Integrated Analytics Widgets & Actions**: Added mini progress donut chart (`75%`, `$25,234`), live bar graph (`Data Chart`), primary `Enter Platform` button (links to `/login`), secondary `View Public Records` button (links to `/public`), and a glowing 4-point sparkle star accent.

### Session 12 (Public Transparency Dashboard UI Redesign)
- **Redesigned Public Transparency Dashboard (`/public`)**: Updated layout to match user reference image.
- **Header Section**: Added electric cyan `TraceFund Public Transparency` title and `Back to Home` pill glass button.
- **Total Network Utilization Main Card**: Added dark glass card container with background isometric grid mesh, `₹50 / ₹150` spend utilization metric, `✔ 33.3% Verified` green badge, dynamic narrative summary, and an interactive SVG Area Line Chart displaying *Total Allocated*, *Verified Spent*, and *Remaining* trends with data point tooltips (`Nov: 521 Verified`, `Dec: 521 Remaining`).
- **Category Breakdown Section**: Added category cards (*Food*, *Medicine*, *Education*) featuring auditor status badges (`✔ Auditor Verified` / `Awaiting Disbursement`), transaction counts, and segmented glowing cyan progress bars with `Food Audit Status: High` indicators.
- **Backend Connectivity**: Connected to `GET /public/stats` (`API_URL/public/stats`) with fallback category merging.

### Session 13 (Beneficiary Dashboard UI Redesign)
- **Redesigned Beneficiary Digital Wallet (`/beneficiary`)**: Updated layout to match user reference image while strictly enforcing constraints (omitted deposit/withdraw buttons and bottom glowing star accent).
- **Sidebar & Top Header (`DashboardLayout.tsx`)**: Added `$ TraceFund` logo, active `Wallet` cyan pill tab, `Notifications`, `Help`, user profile pill (`New Ben (beneficiary) NB`), and `Logout` button.
- **Main Wallet Banner Card**: Added `TraceFund Digital Wallet` header, `Total Available Balance` with `₹145,230.75` / real balance display, green trend circle indicator `↗`, user name label, and node network background mesh.
- **Category Balances Section**: Added 4-column responsive grid featuring category cards (*Fuel*, *Meals*, *Groceries*, *Office Supplies*, *Computing*, *Tuition*, *Retail*, *Services*, *Others*) with custom icons, formatted balances, and `Pay Vendor` action buttons.
- **Backend Connectivity**: Connected to `GET /wallet/{user_id}` (`API_URL/wallet/${user.id}`).

### Session 14 (Strict Backend Wallet Integration)
- **Strict Allocated Categories Display**: Updated `src/app/beneficiary/page.tsx` to render category cards strictly from `wallet.balances` returned by `GET /wallet/{user_id}`.
- **Removed Hardcoded Fallbacks**: Completely removed mock category fallbacks (*Fuel*, *Meals*, *Groceries*, etc.) so only real allocated fund types are shown.
- **Empty Wallet State**: Added clean notification panel for users without allocated funds.
- **Verified Build**: Successfully compiled with Next.js Turbopack (`npm run build`).

### Session 15 (Sparkle Star Accent Removal & Polish)
- **Global Polish**: Removed the glowing 4-point sparkle star SVG accent across the Landing Page (`/`), Login Page (`/login`), Register Page (`/register`), and Beneficiary Dashboard (`/beneficiary`).
- **Verified Build**: Successfully compiled with Next.js Turbopack (`npm run build`).

### Session 16 (Beneficiary Sidebar Navigation Update)
- **Sidebar Cleanup**: Removed `Dashboard` and `Settings` navigation items from the beneficiary sidebar menu in `DashboardLayout.tsx`.
- **Retained Beneficiary Nav Links**: `Wallet` (`/beneficiary`), `Transactions` (`/beneficiary/history`), `Pay Vendors` (`/beneficiary/pay`).
- **Verified Build**: Successfully compiled with Next.js Turbopack (`npm run build`).







