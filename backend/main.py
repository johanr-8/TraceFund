import logging
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func
from passlib.context import CryptContext
from database import engine, get_db, Base
from models import User, FundType, Wallet, Vendor, Transaction, AuditLog
from blockchain import TraceFundBridge, BLOCKCHAIN_ENABLED

Base.metadata.create_all(bind=engine)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("tracefund")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI(title="TraceFund API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──── Blockchain Bridge (lazy init — connects on first use) ────
bridge = TraceFundBridge()

@app.on_event("startup")
def startup():
    if BLOCKCHAIN_ENABLED:
        if bridge.is_connected():
            logger.info("Blockchain integration ACTIVE")
        else:
            logger.warning("Blockchain enabled but not connected — check RPC_URL and CONTRACT_ADDRESS")
    else:
        logger.info("Blockchain integration DISABLED (SQLite only)")


def log_audit(db: Session, user_id: int | None, action: str, target_type: str, target_id: int | None = None, details: str = ""):
    entry = AuditLog(user_id=user_id, action=action, target_type=target_type, target_id=target_id, details=details)
    db.add(entry)
    db.commit()


class RegisterPayload(BaseModel):
    name: str
    email: str
    password: str
    role: str


class LoginPayload(BaseModel):
    email: str
    password: str


class CreateStaffPayload(BaseModel):
    """Payload for a government admin creating another government/auditor account."""
    name: str
    email: str
    password: str
    role: str


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
    user_id: int
    business_name: str
    category: str


class FundTypePayload(BaseModel):
    name: str
    description: str = ""


@app.get("/")
def root():
    return {"message": "TraceFund API is running"}


VALID_ROLES = {"government", "beneficiary", "vendor", "auditor"}
# Roles that can self-register publicly. Government and auditor accounts are
# created only by an existing government admin (see POST /admin/users).
SELF_REGISTER_ROLES = {"beneficiary", "vendor"}

@app.post("/register")
def register(payload: RegisterPayload, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    if payload.role not in VALID_ROLES:
        raise HTTPException(status_code=400, detail="Invalid role")
    if payload.role not in SELF_REGISTER_ROLES:
        raise HTTPException(status_code=400, detail="Self-registration is only available for beneficiaries and vendors")
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

    # Register user on-chain
    bridge.register_user(user.id)

    # Audit log
    log_audit(db, user.id, "register", "user", user.id, f"role={user.role}")

    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role}


# Staff roles that a government admin may provision. Beneficiaries and vendors
# self-register via POST /register instead.
STAFF_ROLES = {"government", "auditor"}


@app.post("/admin/users")
def create_staff_user(payload: CreateStaffPayload, db: Session = Depends(get_db)):
    """Allow a government admin to create additional government and auditor accounts."""
    if payload.role not in STAFF_ROLES:
        raise HTTPException(status_code=400, detail="Admin can only create government or auditor accounts")

    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
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

    bridge.register_user(user.id)
    log_audit(db, user.id, "admin_create_user", "user", user.id, f"role={user.role}")

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

    # Issue fund on-chain
    bridge.issue_fund(payload.beneficiary_id, payload.fund_type_id, payload.amount)

    # Audit log
    log_audit(db, payload.beneficiary_id, "issue_fund", "fund", wallet.id, f"type={fund_type.name}, amount={payload.amount}")

    return {"wallet_id": wallet.id, "user_id": wallet.user_id, "fund_type": fund_type.name, "balance": wallet.balance}


@app.get("/fund-types")
def list_fund_types(db: Session = Depends(get_db)):
    types = db.query(FundType).all()
    return [{"id": t.id, "name": t.name, "description": t.description} for t in types]


@app.post("/fund-types")
def create_fund_type(payload: FundTypePayload, db: Session = Depends(get_db)):
    existing = db.query(FundType).filter(FundType.name == payload.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Fund type already exists")

    ft = FundType(name=payload.name, description=payload.description)
    db.add(ft)
    db.commit()
    db.refresh(ft)

    # Add on-chain
    bridge.add_fund_type(ft.id, ft.name)

    log_audit(db, None, "create_fund_type", "fund_type", ft.id, f"name={ft.name}")

    return {"id": ft.id, "name": ft.name, "description": ft.description}


@app.put("/fund-types/{fund_type_id}")
def update_fund_type(fund_type_id: int, payload: FundTypePayload, db: Session = Depends(get_db)):
    ft = db.query(FundType).filter(FundType.id == fund_type_id).first()
    if not ft:
        raise HTTPException(status_code=404, detail="Fund type not found")

    duplicate = db.query(FundType).filter(FundType.name == payload.name, FundType.id != fund_type_id).first()
    if duplicate:
        raise HTTPException(status_code=400, detail="Fund type name already taken")

    ft.name = payload.name
    ft.description = payload.description
    db.commit()
    db.refresh(ft)

    log_audit(db, None, "update_fund_type", "fund_type", ft.id, f"name={ft.name}")

    return {"id": ft.id, "name": ft.name, "description": ft.description}


@app.delete("/fund-types/{fund_type_id}")
def delete_fund_type(fund_type_id: int, db: Session = Depends(get_db)):
    ft = db.query(FundType).filter(FundType.id == fund_type_id).first()
    if not ft:
        raise HTTPException(status_code=404, detail="Fund type not found")

    # Check if any wallets or transactions use this fund type
    wallet_count = db.query(Wallet).filter(Wallet.fund_type_id == fund_type_id).count()
    tx_count = db.query(Transaction).filter(Transaction.fund_type_id == fund_type_id).count()
    if wallet_count > 0 or tx_count > 0:
        raise HTTPException(status_code=400, detail="Cannot delete — fund type is in use by wallets or transactions")

    db.delete(ft)
    db.commit()

    log_audit(db, None, "delete_fund_type", "fund_type", fund_type_id, f"name={ft.name}")

    return {"detail": f"Fund type '{ft.name}' deleted"}


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
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    existing = db.query(Vendor).filter(Vendor.user_id == payload.user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already has a vendor profile")

    vendor = Vendor(
        user_id=payload.user_id,
        business_name=payload.business_name,
        category=payload.category,
        approval_status="pending",
    )
    db.add(vendor)
    db.commit()
    db.refresh(vendor)

    # Register vendor on-chain
    bridge.register_vendor(vendor.id, payload.user_id, payload.business_name, payload.category)

    # Audit log
    log_audit(db, payload.user_id, "register_vendor", "vendor", vendor.id, f"business={payload.business_name}, category={payload.category}")

    return {"id": vendor.id, "user_id": vendor.user_id, "business_name": vendor.business_name, "category": vendor.category, "approval_status": vendor.approval_status}


@app.get("/vendors")
def list_vendors(category: str | None = None, status: str | None = None, user_id: int | None = None, db: Session = Depends(get_db)):
    q = db.query(Vendor)
    if user_id:
        q = q.filter(Vendor.user_id == user_id)
    if category:
        q = q.filter(Vendor.category == category)
    if status:
        q = q.filter(Vendor.approval_status == status)
    elif not user_id:
        q = q.filter(Vendor.approval_status == "approved")
    vendors = q.all()
    return [{"id": v.id, "user_id": v.user_id, "business_name": v.business_name, "category": v.category, "approval_status": v.approval_status} for v in vendors]


@app.post("/vendors/{vendor_id}/approve")
def approve_vendor(vendor_id: int, db: Session = Depends(get_db)):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    if vendor.approval_status != "pending":
        raise HTTPException(status_code=400, detail=f"Vendor is already {vendor.approval_status}")

    vendor.approval_status = "approved"
    db.commit()
    db.refresh(vendor)

    # Approve vendor on-chain
    bridge.approve_vendor(vendor.id)

    # Audit log
    log_audit(db, vendor.user_id, "approve_vendor", "vendor", vendor.id, f"business={vendor.business_name}")

    return {"id": vendor.id, "business_name": vendor.business_name, "approval_status": vendor.approval_status}


@app.post("/vendors/{vendor_id}/reject")
def reject_vendor(vendor_id: int, db: Session = Depends(get_db)):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    if vendor.approval_status != "pending":
        raise HTTPException(status_code=400, detail=f"Vendor is already {vendor.approval_status}")

    vendor.approval_status = "rejected"
    db.commit()
    db.refresh(vendor)

    # Audit log
    log_audit(db, vendor.user_id, "reject_vendor", "vendor", vendor.id, f"business={vendor.business_name}")

    return {"id": vendor.id, "business_name": vendor.business_name, "approval_status": vendor.approval_status}


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

    if vendor.approval_status != "approved":
        raise HTTPException(status_code=400, detail="Vendor not approved")

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

    # Execute spend on-chain (contract enforces category match + vendor approval + balance)
    chain_result = bridge.spend(payload.sender_id, payload.vendor_id, payload.fund_type_id, payload.amount)

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

    # Audit log
    log_audit(db, payload.sender_id, "spend", "transaction", tx.id, f"vendor={vendor.business_name}, type={fund_type.name}, amount={payload.amount}")

    return {
        "transaction_id": tx.id,
        "amount": tx.amount,
        "fund_type": fund_type.name,
        "vendor": vendor.business_name,
        "status": tx.status,
        "remaining_balance": wallet.balance,
        "chain_tx": chain_result,
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
            "vendor_name": v.business_name if v else "Unknown",
            "status": t.status,
            "date": t.created_at.isoformat() if t.created_at else "",
        })
    return result


@app.get("/transactions/{transaction_id}")
def get_transaction(transaction_id: int, db: Session = Depends(get_db)):
    tx = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    ft = db.query(FundType).filter(FundType.id == tx.fund_type_id).first()
    v = db.query(Vendor).filter(Vendor.id == tx.vendor_id).first()
    sender = db.query(User).filter(User.id == tx.sender_id).first()

    return {
        "id": tx.id,
        "sender_id": tx.sender_id,
        "sender_name": sender.name if sender else "Unknown",
        "vendor_id": tx.vendor_id,
        "vendor_name": v.business_name if v else "Unknown",
        "fund_type": ft.name if ft else "Unknown",
        "amount": tx.amount,
        "status": tx.status,
        "date": tx.created_at.isoformat() if tx.created_at else "",
    }


@app.get("/vendors/{vendor_id}/settlement")
def vendor_settlement(vendor_id: int, db: Session = Depends(get_db)):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    txs = db.query(Transaction).filter(Transaction.vendor_id == vendor_id).all()
    total_received = sum(t.amount for t in txs)
    tx_count = len(txs)

    # Breakdown by fund type
    category_breakdown = {}
    for t in txs:
        ft = db.query(FundType).filter(FundType.id == t.fund_type_id).first()
        cat = ft.name if ft else "Unknown"
        category_breakdown[cat] = category_breakdown.get(cat, 0) + t.amount

    return {
        "vendor_id": vendor.id,
        "business_name": vendor.business_name,
        "category": vendor.category,
        "approval_status": vendor.approval_status,
        "total_received": total_received,
        "transaction_count": tx_count,
        "category_breakdown": category_breakdown,
    }


@app.get("/blockchain/status")
def blockchain_status():
    """Check blockchain integration status."""
    return {
        "enabled": BLOCKCHAIN_ENABLED,
        "connected": bridge.is_connected(),
        "contract_address": bridge.contract.address if bridge.contract else None,
    }


@app.get("/blockchain/balance/{user_id}/{fund_type_id}")
def blockchain_balance(user_id: int, fund_type_id: int):
    """Get on-chain balance for a user + fund type."""
    balance = bridge.get_balance(user_id, fund_type_id)
    if balance is None:
        raise HTTPException(status_code=503, detail="Blockchain not available")
    return {"user_id": user_id, "fund_type_id": fund_type_id, "on_chain_balance": balance}


@app.get("/blockchain/transaction/{tx_id}")
def blockchain_transaction(tx_id: int):
    """Get an on-chain transaction record."""
    tx = bridge.get_transaction(tx_id)
    if tx is None:
        raise HTTPException(status_code=503, detail="Blockchain not available")
    return tx


@app.get("/audit-logs")
def list_audit_logs(user_id: int | None = None, action: str | None = None, limit: int = 50, db: Session = Depends(get_db)):
    q = db.query(AuditLog)
    if user_id:
        q = q.filter(AuditLog.user_id == user_id)
    if action:
        q = q.filter(AuditLog.action == action)
    logs = q.order_by(AuditLog.created_at.desc()).limit(limit).all()
    return [
        {
            "id": log.id,
            "user_id": log.user_id,
            "action": log.action,
            "target_type": log.target_type,
            "target_id": log.target_id,
            "details": log.details,
            "date": log.created_at.isoformat() if log.created_at else "",
        }
        for log in logs
    ]


@app.get("/stats")
def dashboard_stats(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    beneficiaries = db.query(User).filter(User.role == "beneficiary").count()
    vendors_registered = db.query(Vendor).count()
    vendors_approved = db.query(Vendor).filter(Vendor.approval_status == "approved").count()
    vendors_pending = db.query(Vendor).filter(Vendor.approval_status == "pending").count()

    total_issued = db.query(func.coalesce(func.sum(Wallet.balance), 0)).scalar()
    total_spent = db.query(func.coalesce(func.sum(Transaction.amount), 0)).scalar()
    total_transactions = db.query(Transaction).count()

    # Breakdown by fund type
    fund_type_breakdown = []
    for ft in db.query(FundType).all():
        issued = db.query(func.coalesce(func.sum(Wallet.balance), 0)).filter(Wallet.fund_type_id == ft.id).scalar()
        spent = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(Transaction.fund_type_id == ft.id).scalar()
        fund_type_breakdown.append({"name": ft.name, "issued": issued, "spent": spent})

    return {
        "total_users": total_users,
        "beneficiaries": beneficiaries,
        "vendors_registered": vendors_registered,
        "vendors_approved": vendors_approved,
        "vendors_pending": vendors_pending,
        "total_issued": total_issued,
        "total_spent": total_spent,
        "total_transactions": total_transactions,
        "fund_type_breakdown": fund_type_breakdown,
    }


@app.get("/public/stats")
def public_stats(db: Session = Depends(get_db)):
    """Aggregate stats for the public transparency dashboard — no personal data."""
    total_issued = db.query(func.coalesce(func.sum(Wallet.balance), 0)).scalar()
    total_spent = db.query(func.coalesce(func.sum(Transaction.amount), 0)).scalar()
    total_transactions = db.query(Transaction).count()
    vendors_approved = db.query(Vendor).filter(Vendor.approval_status == "approved").count()

    # Category-wise utilization
    categories = []
    for ft in db.query(FundType).all():
        spent = db.query(func.coalesce(func.sum(Transaction.amount), 0)).filter(Transaction.fund_type_id == ft.id).scalar()
        tx_count = db.query(Transaction).filter(Transaction.fund_type_id == ft.id).count()
        categories.append({"category": ft.name, "total_spent": spent, "transaction_count": tx_count})

    return {
        "total_issued": total_issued,
        "total_spent": total_spent,
        "total_transactions": total_transactions,
        "active_vendors": vendors_approved,
        "categories": categories,
    }
