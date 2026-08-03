import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.chdir(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine, Base
from models import FundType, User, Vendor
from passlib.context import CryptContext

Base.metadata.create_all(bind=engine)
db = SessionLocal()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

existing_ft = {ft.name for ft in db.query(FundType).all()}
expected = {"Food": "For food and groceries", "Medicine": "For medical expenses", "Education": "For educational expenses"}
for name, desc in expected.items():
    if name not in existing_ft:
        db.add(FundType(name=name, description=desc))
        print(f"Added fund type: {name}")

gov_email = "gov@tracefund.gov"
if not db.query(User).filter(User.email == gov_email).first():
    db.add(User(
        name="Government Admin",
        email=gov_email,
        hashed_password=pwd_context.hash("admin123"),
        role="government",
    ))
    print(f"Created government user: {gov_email} / admin123")

if db.query(Vendor).count() == 0:
    vendors = [
        Vendor(name="Fresh Grocers", category="Food", address="0x123...abc", approved=True),
        Vendor(name="City Pharmacy", category="Medicine", address="0x456...def", approved=True),
        Vendor(name="PharmaCorp", category="Medicine", address="0x789...ghi", approved=True),
        Vendor(name="National Bookstore", category="Education", address="0xabc...123", approved=True),
        Vendor(name="GreenMart", category="Food", address="0xdef...456", approved=True),
    ]
    db.add_all(vendors)
    print(f"Added {len(vendors)} vendors")

db.commit()
db.close()
print("Done")
