from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import select, delete

from app.models.vocabulary_model import Vocabulary
from app.exceptions.base_exceptions import DatabaseError
from app.exceptions.vocabulary_exceptions import VocabularyNotFoundError, UnauthorizedVocabularyAccessError
from app.exceptions.user_exceptions import UserNotFoundError


class VocabularyService():
    def __init__(self, db: Session):
        self._db = db

    def create_vocabulary(self, user, source_language, target_language):
        vocabulary = Vocabulary(user_id=user.id, source_language=source_language,
                                target_language=target_language, name=f"{source_language}-{target_language}")
        try:
            self._db.add(vocabulary)
            self._db.commit()
            self._db.refresh(vocabulary)
            return vocabulary
        except SQLAlchemyError as error:
            self._db.rollback()
            return DatabaseError(f"Database error: {str(error)}")

    def get_vocabularies(self, user) -> list[Vocabulary]:
        statement = select(Vocabulary).where(Vocabulary.user_id == user.id)
        vocabularies = self._db.execute(statement).scalars().all()
        return vocabularies

    def get_vocabulary_by_id(self, user, vocabulary_id):
        statement = select(Vocabulary).where(Vocabulary.id == vocabulary_id)
        vocabulary = self._db.execute(statement).scalar()
        if not vocabulary:
            raise VocabularyNotFoundError(
                f"Vocabulary with ID: {id} not found")

        if vocabulary.user_id != user.id:
            raise UnauthorizedVocabularyAccessError(
                f"User with ID: {user.id} doesn't have permission to access vocabulary with ID: {vocabulary.id}")

        return vocabulary

    def delete_vocabulary_by_id(self, user, id):
        statement = select(Vocabulary).where(Vocabulary.id == id)
        vocabulary = self._db.execute(statement).scalar()
        if not vocabulary:
            raise VocabularyNotFoundError(
                f"Vocabulary with ID: {id} not found")

        if vocabulary.user_id != user.id:
            raise UnauthorizedVocabularyAccessError(
                f"User with ID: {user.id} doesn't have permission to delete vocabulary with ID: {vocabulary.id}")

        try:
            self._db.delete(vocabulary)
            self._db.commit()
            return vocabulary
        except SQLAlchemyError as error:
            self._db.rollback()
            raise DatabaseError(f"Database error: {str(error)}")

    def delete_vocabularies_by_id(self, user, ids: list[int]) -> list[Vocabulary]:
        try:
            statement = select(Vocabulary).where(Vocabulary.id.in_(ids))
            vocabularies = self._db.execute(statement).scalars().all()
            for vocabulary in vocabularies:
                if vocabulary.user_id != user.id:
                    raise UnauthorizedVocabularyAccessError(
                        f"User with ID: {user.id} doesn't have permission to delete vocabulary with ID: {vocabulary.id}")
            for id in ids:
                if id not in [vocabulary.id for vocabulary in vocabularies]:
                    raise VocabularyNotFoundError(
                        f"Vocabulary with ID: {id} not found")

            delete_statement = delete(Vocabulary).where(Vocabulary.id.in_(ids))
            self._db.execute(delete_statement)
            self._db.commit()
            return vocabularies
        except SQLAlchemyError as error:
            self._db.rollback()
            raise DatabaseError(f"Database error: {str(error)}")
