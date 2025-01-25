from sqlalchemy import Column, Integer, ForeignKey, DateTime, String, Boolean
from datetime import datetime, timezone

from app.core.database import Base


class Vocabulary(Base):
    __tablename__ = "vocabularies"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    source_language = Column(String)
    target_language = Column(String)
    name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    is_active = Column(Boolean, default=True)
