from datetime import datetime
from pydantic import BaseModel, Field, field_serializer


class VocabularyCreate(BaseModel):
    source_language: str = Field(min_length=2, max_length=20, error_messages={
        "min_length": "source_language must have at least 2 characters.",
        "max_length": "source_language must be no longer than 20 characters."
    }, examples=["CZ"])
    target_language: str = Field(min_length=2, max_length=20, error_messages={
        "min_length": "target lanugage must have at least 2 characters.",
        "max_length": "target lanugage must be no longer than 20 characters."
    }, examples=["EN"])


class Vocabulary(BaseModel):
    id: int
    name: str
    source_language: str
    target_language: str
    user_id: int
    is_active: bool
    created_at: datetime

    @field_serializer("created_at")
    def serialize_dt(self, dt: datetime):
        return dt.isoformat()


class VocabularyIds(BaseModel):
    ids: list[int]
