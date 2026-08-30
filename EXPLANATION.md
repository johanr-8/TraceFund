# TraceFund — Beginner Project Explainer (for Reviews / Teammates)

> Read this aloud or use it to prep teammates for the review. Written for people
> who know little about the code, the libraries, or the logic.

---

## 1. What our project does (the 30-second pitch)

TraceFund solves a real government problem. Right now, when the government gives
money to people — like subsidies, disaster relief, or welfare — it's just cash.
Once the cash is in someone's hand, the government has zero control over it. The
money might be spent on the wrong thing, or siphoned off through fake vendors,
and the government can't trace any of it.

Our solution: instead of giving cash, the government gives **digital tokens**
that have **rules built into them**. For example, a token could say *"this money
can ONLY be spent on food"*. When a beneficiary tries to spend it, the system
automatically checks the rule — is this vendor allowed to accept food tokens?
Yes → payment goes through, recorded permanently. No → it's automatically
rejected. No human discretion, no corruption loopholes. And on top of that, we
have a **fraud detection engine** that watches transaction patterns and flags
suspicious activity for an auditor to review.

## 2. The tech stack (what each piece is)

- **Frontend (what users see)** — Next.js + React + TypeScript. Runs in the
  browser at `localhost:3000`.
- **Backend (the brain)** — Python + FastAPI. Runs at `localhost:8000`. Handles
  all the logic and talks to the database.
- **Database** — SQLite (a file called `tracefund.db`). Stores users, wallets,
  fund types, vendors, transactions.
- **Future/planned** — Solidity smart contracts + Web3.py for actual blockchain
  integration (we're simulating the "blockchain" part for now with the database).

## 3. The full user flow (start to finish)

**Step 1 — Landing page.** When you open the site, you see the main page with 5
portals: Beneficiary, Vendor, Government (Admin), Auditor, and Public
Transparency. Each is a card/button.

**Step 2 — Register.** A new user goes to the register page and enters name,
email, password, and picks a role (beneficiary, government, vendor, or auditor).
The backend receives this, and here's the important part: **it never stores the
raw password**. It runs the password through a **hash function** (using the
`passlib` + `bcrypt` libraries). A hash is a one-way scramble — even we can't
turn it back into the original password. So if the database ever gets stolen,
the passwords are useless. Only the hash is saved.

**Step 3 — Login.** The user types their email and password. The backend:
1. Looks up the user by email in the database.
2. Takes the typed password, scrambles it the same way, and compares it to the
   stored hash.
3. Match → login success. No match → "Invalid email or password".

**Step 4 — Redirect.** The frontend checks the user's **role** and sends them to
the right dashboard — government goes to `/admin`, everyone else (currently) to
`/beneficiary`. The user's info (id, name, role) is stored in the browser's
`localStorage` so the app remembers who's logged in across page loads.

**Step 5 — Government issues funds.** On the admin dashboard, the government
admin picks a beneficiary, a fund category (Food / Medicine / Education), and an
amount. The backend checks the beneficiary exists and is actually a "beneficiary"
role, checks the amount is positive, then **credits the beneficiary's wallet**
for that category. Each category is a separate "wallet pocket".

**Step 6 — Beneficiary spends.** The beneficiary goes to Pay Vendor, picks a
category they have money in, picks an approved vendor of that category, enters
an amount, and submits. The backend runs the **rules engine**: is this vendor's
category the same as the fund category? Do they have enough balance? If yes →
money is deducted from the wallet, and a **Transaction** record is written to the
database with status "Approved". If no → rejected.

**Step 7 — Auditor & Public.** The auditor sees flagged/suspicious transactions
(currently mock data) and a full ledger. The public dashboard shows aggregate
statistics — how much was allocated vs spent per category, with no personal data.

## 4. How the database works (the key terms)

We use **SQLAlchemy**, which is an **ORM** — Object Relational Mapper. This is a
big deal to understand: instead of writing raw SQL queries by hand, we define
Python **classes** that map to database **tables**. So `class User` = the
`users` table, `class Wallet` = the `wallets` table, etc. Each instance of the
class is a row in the table.

Our tables: **Users, Wallets, FundTypes, Vendors, Transactions** (we have 7
planned in the spec, plus FraudFlags and AuditLogs).

Every time the backend needs the database, it opens a **session**
(`get_db` in `database.py`). A session is like a temporary connection. The
pattern is:
1. Open session
2. Run query (e.g., `db.query(User).filter(User.email == ...)`)
3. If creating/updating: `db.add(...)` then `db.commit()` (commit = actually
   save it permanently)
4. Close session

A common bug in this space is forgetting `commit()` — if you don't commit, the
change disappears. Every API endpoint in `main.py` follows this pattern. We use
**SQLite** for the database (a single file, no server needed) because it's
perfect for a demo — no installation, just works.

## 5. Key terms they might ask about

- **API** — the interface between the frontend and backend. The frontend sends
  an HTTP **request** to a **URL** like `POST http://localhost:8000/login`, and
  the backend sends back a response.
- **Endpoint** — a specific URL + method combination. `/register`, `/login`,
  `/issue-fund`, `/spend`, `/vendors`, `/wallet/{id}`, `/transactions` are all
  endpoints.
- **HTTP methods** — `GET` = "give me data", `POST` = "create/process
  something". We use both.
- **JSON** — the format both sides use to talk: `{"email": "...", "password":
  "..."}`.
- **CORS** — a browser security rule. By default, a site at `localhost:3000`
  isn't allowed to call an API at `localhost:8000`. We add a **CORS middleware**
  that says "it's okay, allow requests from localhost:3000".
- **Pydantic** — defines the shape of request data (`class LoginPayload`). It
  validates that the incoming JSON has the right fields, like a contract.
- **FastAPI** — the web framework. Each function with `@app.post("/login")` on
  top is an endpoint.
- **Uvicorn** — the server that runs FastAPI (the "uvicorn main:app --reload"
  command). `--reload` = auto-restart when you change code.
- **Hashing** — one-way password scrambling (vs **encryption** which is
  reversible).
- **localStorage** — browser storage for the logged-in user. Note: this is our
  *mock* auth; we don't use JWT/session tokens yet (a known limitation).
- **Blockchain / smart contract** (future) — a distributed ledger where
  transactions are permanent and can't be edited; rules enforced by code. We
  simulate this concept with our database for now.
- **Web3.py** (future) — the Python library that would let our backend talk to
  a real blockchain.

## 6. Important honest caveats (in case they dig deeper)

- **Auth is demo-only.** Anyone can register as "government" or "auditor" — no
  real approval. And "logged in" is just localStorage, not a real server-side
  session.
- **Blockchain is planned, not built.** Right now the "immutable ledger" is a
  database table. The blockchain + Web3.py + fraud-detection engine are the
  next milestones.
- **Some pages use mock data** (Auditor dashboard, Public transparency, Vendor
  pages) — the data isn't from the database yet.
- **`seed.py`** creates the initial database content: 3 fund categories, a gov
  admin login (`gov@tracefund.gov` / `admin123`), and 5 demo vendors. Run it
  once on a fresh machine.
