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
    vendor_users = [
        ("Fresh Grocers", "vendor1@tracefund.gov", "Food"),
        ("City Pharmacy", "vendor2@tracefund.gov", "Medicine"),
        ("PharmaCorp", "vendor3@tracefund.gov", "Medicine"),
        ("National Bookstore", "vendor4@tracefund.gov", "Education"),
        ("GreenMart", "vendor5@tracefund.gov", "Food"),
    ]
    for vname, vemail, vcat in vendor_users:
        if not db.query(User).filter(User.email == vemail).first():
            db.add(User(
                name=vname,
                email=vemail,
                hashed_password=pwd_context.hash("vendor123"),
                role="vendor",
            ))
    db.commit()

    vendors = [
        Vendor(user_id=db.query(User).filter(User.email == "vendor1@tracefund.gov").first().id, business_name="Fresh Grocers", category="Food", approval_status="approved"),
        Vendor(user_id=db.query(User).filter(User.email == "vendor2@tracefund.gov").first().id, business_name="City Pharmacy", category="Medicine", approval_status="approved"),
        Vendor(user_id=db.query(User).filter(User.email == "vendor3@tracefund.gov").first().id, business_name="PharmaCorp", category="Medicine", approval_status="approved"),
        Vendor(user_id=db.query(User).filter(User.email == "vendor4@tracefund.gov").first().id, business_name="National Bookstore", category="Education", approval_status="approved"),
        Vendor(user_id=db.query(User).filter(User.email == "vendor5@tracefund.gov").first().id, business_name="GreenMart", category="Food", approval_status="approved"),
    ]
    db.add_all(vendors)
    print(f"Added {len(vendors)} vendors")

db.commit()
db.close()
print("Done")
