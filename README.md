# TraceFund — Setup & Run Instructions

> Get the project running on a fresh machine after cloning from Git.

## Prerequisites
- **Python 3.10+**
- **Node.js 18+** (for the Next.js frontend)

---

## Backend (FastAPI)

```sh
# 1. Create and activate a virtual environment (once per machine)
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS / Linux:
# source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create the database + seed fund types, government admin, and demo vendors
python seed.py

# 4. Start the API server (from the backend/ directory)
uvicorn main:app --reload
```
API runs at **http://localhost:8000** (docs at http://localhost:8000/docs).

---

## Frontend (Next.js)

```sh
cd frontend

# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Frontend runs at **http://localhost:3000**.

---

## Running both (recommended order)

| Step | Command | Runs at |
|------|---------|---------|
| 1. Backend | `cd backend && uvicorn main:app --reload` | http://localhost:8000 |
| 2. Frontend | `cd frontend && npm run dev` | http://localhost:3000 |

> The frontend expects the backend on `http://localhost:8000`. CORS is configured for
> `http://localhost:3000` only.

---

## Default seeded login
- **Email:** `gov@tracefund.gov` **Password:** `admin123` (Government Admin)

---

## Notes
- The database file (`backend/tracefund.db`) is git-ignored, so you must run `python seed.py`
  once on every fresh checkout.
- Other user roles (beneficiary, vendor, auditor) are created via the Register page.