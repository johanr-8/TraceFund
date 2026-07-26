# TraceFund — UI Specification by Role

Reference only. Do not build from this until explicitly instructed per screen.

## 1. Government / Admin
**Purpose:** Issue funds, monitor disbursement, review flagged activity

Screens:
- Issue Fund (built) — select beneficiary, select fund type, enter amount, "Issue Fund" button
- Disbursement Overview (not built) — table of all funds issued: date, beneficiary, fund type, amount
- Flagged Transactions (not built, depends on fraud detection) — list with "Mark Reviewed" button

Actions: Issue Fund, View All Disbursements, Review Flag → Clear/Confirm Misuse

## 2. Beneficiary
**Purpose:** Check balance, spend at vendors, view history

Screens:
- Wallet (built) — balance per fund type
- Spend (NOT BUILT — priority gap) — select registered vendor, enter amount, "Send Payment" button
- Transaction History (not built) — date, vendor, category, amount, approved/rejected

Actions: View Balance, Spend at Vendor, View History

## 3. Vendor
**Purpose:** Register business, receive payments

Screens:
- Register (partially built via existing /register, needs category field added for vendor role)
- Incoming Payments (not built) — date, beneficiary, amount received

Actions: Register Business, View Incoming Payments

## 4. Auditor
**Purpose:** Review flagged activity, verify compliance

Screens:
- Flagged Transactions (not built, depends on fraud detection) — reason, status (Pending/Cleared/Confirmed Misuse), update-status control
- Full Transaction Trail (not built) — searchable/filterable list of all transactions

Actions: Review Flag, Update Status, Search Transactions

## 5. Public (no login)
**Purpose:** Transparency, aggregate data only, no personal data ever

Screens:
- Public Dashboard (not built) — total funds disbursed, % by category, simple chart

Actions: none (read-only, no login)

## Priority note
The single most important missing piece right now is Beneficiary → Spend.
The current loop is issue → view balance, but there is no spend → vendor
receives flow yet, which is the core of the project's actual pitch
(restricted spending). Build this before Vendor/Auditor/Public screens.
