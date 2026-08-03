from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database import engine, get_db, Base
from models import User, FundType, Wallet, Vendor, Transaction

Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI(title="TraceFund API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class RegisterPayload(BaseModel):
    name: str
    email: str
    password: str
    role: str


class LoginPayload(BaseModel):
    email: str
    password: str


class IssueFundPayload(BaseModel):
    beneficiary_id: int
    fund_type_id: int
    amount: float


class SpendPayload(BaseModel):
    sender_id: int
    vendor_id: int
    fund_type_id: int
    amount: float


class VendorPayload(BaseModel):
    name: str
    category: str
    address: str = ""


@app.get("/")
def root():
    return {"message": "TraceFund API is running"}


VALID_ROLES = {"government", "beneficiary", "vendor", "auditor"}

@app.post("/register")
def register(payload: RegisterPayload, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    if payload.role not in VALID_ROLES:
        raise HTTPException(status_code=400, detail="Invalid role")
    if len(payload.password) < 4:
        raise HTTPException(status_code=400, detail="Password must be at least 4 characters")

    user = User(
        name=payload.name,
        email=payload.email,
        hashed_password=pwd_context.hash(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role}


@app.post("/login")
def login(payload: LoginPayload, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not pwd_context.verify(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role}


@app.post("/issue-fund")
def issue_fund(payload: IssueFundPayload, db: Session = Depends(get_db)):
    beneficiary = db.query(User).filter(User.id == payload.beneficiary_id).first()
    if not beneficiary:
        raise HTTPException(status_code=404, detail="Beneficiary not found")
    if beneficiary.role != "beneficiary":
        raise HTTPException(status_code=400, detail="Can only issue funds to beneficiary role")

    fund_type = db.query(FundType).filter(FundType.id == payload.fund_type_id).first()
    if not fund_type:
        raise HTTPException(status_code=404, detail="Fund type not found")

    if payload.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")

    wallet = db.query(Wallet).filter(
        Wallet.user_id == payload.beneficiary_id,
        Wallet.fund_type_id == payload.fund_type_id,
    ).first()

    if wallet:
        wallet.balance += payload.amount
    else:
        wallet = Wallet(user_id=payload.beneficiary_id, fund_type_id=payload.fund_type_id, balance=payload.amount)
        db.add(wallet)

    db.commit()
    db.refresh(wallet)
    return {"wallet_id": wallet.id, "user_id": wallet.user_id, "fund_type": fund_type.name, "balance": wallet.balance}


@app.get("/fund-types")
def list_fund_types(db: Session = Depends(get_db)):
    types = db.query(FundType).all()
    return [{"id": t.id, "name": t.name, "description": t.description} for t in types]


@app.get("/users")
def list_users(role: str | None = None, db: Session = Depends(get_db)):
    q = db.query(User)
    if role:
        q = q.filter(User.role == role)
    users = q.all()
    return [{"id": u.id, "name": u.name, "email": u.email, "role": u.role} for u in users]


@app.get("/wallet/{user_id}")
def get_wallet(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    wallets = db.query(Wallet).filter(Wallet.user_id == user_id).all()
    balances = []
    for w in wallets:
        ft = db.query(FundType).filter(FundType.id == w.fund_type_id).first()
        balances.append({"fund_type": ft.name if ft else "Unknown", "balance": w.balance})

    return {"user_id": user.id, "user_name": user.name, "balances": balances}


@app.post("/vendors")
def register_vendor(payload: VendorPayload, db: Session = Depends(get_db)):
    vendor = Vendor(name=payload.name, category=payload.category, address=payload.address, approved=True)
    db.add(vendor)
    db.commit()
    db.refresh(vendor)
    return {"id": vendor.id, "name": vendor.name, "category": vendor.category, "approved": vendor.approved}


@app.get("/vendors")
def list_vendors(category: str | None = None, db: Session = Depends(get_db)):
    q = db.query(Vendor)
    if category:
        q = q.filter(Vendor.category == category)
    vendors = q.all()
    return [{"id": v.id, "name": v.name, "category": v.category, "address": v.address, "approved": v.approved} for v in vendors]


@app.post("/spend")
def spend(payload: SpendPayload, db: Session = Depends(get_db)):
    sender = db.query(User).filter(User.id == payload.sender_id).first()
    if not sender or sender.role != "beneficiary":
        raise HTTPException(status_code=400, detail="Invalid sender")

    vendor = db.query(Vendor).filter(Vendor.id == payload.vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    fund_type = db.query(FundType).filter(FundType.id == payload.fund_type_id).first()
    if not fund_type:
        raise HTTPException(status_code=404, detail="Fund type not found")

    if vendor.category != fund_type.name:
        raise HTTPException(status_code=400, detail=f"Vendor not approved for {fund_type.name}")

    if payload.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")

    wallet = db.query(Wallet).filter(
        Wallet.user_id == payload.sender_id,
        Wallet.fund_type_id == payload.fund_type_id,
    ).first()

    if not wallet or wallet.balance < payload.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    wallet.balance -= payload.amount
    tx = Transaction(
        sender_id=payload.sender_id,
        vendor_id=payload.vendor_id,
        fund_type_id=payload.fund_type_id,
        amount=payload.amount,
        status="Approved",
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return {
        "transaction_id": tx.id,
        "amount": tx.amount,
        "fund_type": fund_type.name,
        "vendor": vendor.name,
        "status": tx.status,
        "remaining_balance": wallet.balance,
    }


@app.get("/transactions")
def list_transactions(user_id: int | None = None, vendor_id: int | None = None, db: Session = Depends(get_db)):
    q = db.query(Transaction)
    if user_id:
        q = q.filter(Transaction.sender_id == user_id)
    if vendor_id:
        q = q.filter(Transaction.vendor_id == vendor_id)
    txs = q.order_by(Transaction.created_at.desc()).all()
    result = []
    for t in txs:
        ft = db.query(FundType).filter(FundType.id == t.fund_type_id).first()
        v = db.query(Vendor).filter(Vendor.id == t.vendor_id).first()
        result.append({
            "id": t.id,
            "amount": t.amount,
            "fund_type": ft.name if ft else "Unknown",
            "vendor_name": v.name if v else "Unknown",
            "status": t.status,
            "date": t.created_at.isoformat() if t.created_at else "",
        })
    return result
