from sqlalchemy import Column, Integer, ForeignKey, DateTime
from datetime import datetime, timezone

from app.core.database import Base


class WordPair(Base):
    __tablename__ = "word_pairs"

    id = Column(Integer, primary_key=True)
    vocabulary_id = Column(Integer, ForeignKey("vocabularies.id"))
    source_word_id = Column(Integer, ForeignKey("words.id"))
    target_word_id = Column(Integer, ForeignKey("word.id"))
    mastery_level = Column(Integer, default=0)
    last_practiced = Column(DateTime)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
