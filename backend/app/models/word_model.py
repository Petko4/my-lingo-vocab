from app.core.database import Base
from sqlalchemy import Column, Integer, String


class Word(Base):
    __tablename__ = "words"

    id = Column(Integer, primary_key=True)
    word = Column(String)
    lanugage = Column(String)
