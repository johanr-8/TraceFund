from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    wallets = relationship("Wallet", back_populates="user")


class FundType(Base):
    __tablename__ = "fund_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, default="")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    fund_type_id = Column(Integer, ForeignKey("fund_types.id"), nullable=False)
    balance = Column(Float, default=0.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="wallets")
    fund_type = relationship("FundType")

    __table_args__ = (UniqueConstraint("user_id", "fund_type_id", name="uq_user_fund_type"),)
