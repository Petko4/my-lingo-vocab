# models.py
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base

# class Base(DeclarativeBase):
#     pass


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True,
                      name="uq_users_username")
    email = Column(String, unique=True, index=True, name="uq_users_email")
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    native_language = Column(String)

    refresh_tokens = relationship("RefreshToken", back_populates="user")
