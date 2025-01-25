from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from app.models.user_model import User

from app.services.password_service import PassswordService
from app.exceptions.user_exceptions import UserAlreadyExistsError, UserNotFoundError
from app.exceptions.base_exceptions import DatabaseError


class UserService:
    def __init__(self, db: Session, password_service: PassswordService):
        self._db = db
        self._password_service = password_service

    def get_user_by_username(self, username: str) -> User:
        user = self._db.query(User).filter(User.username == username).first()
        if user is None:
            raise UserNotFoundError
        return user

    def create_user(self, username, email, password, native_language) -> User | None:
        hashed_password = self._password_service.get_password_hash(password)
        user = User(username=username, email=email,
                    hashed_password=hashed_password, native_language=native_language)
        try:
            self._db.add(user)
            self._db.commit()
            self._db.refresh(user)
            return user
        except IntegrityError as error:
            self._db.rollback()
            error_msg = str(error.orig)

            if "UNIQUE constraint failed: users.uq_users_email" in error_msg:
                raise UserAlreadyExistsError("Email already exits")
            elif "UNIQUE constraint failed: users.uq_users_username" in error_msg:
                raise UserAlreadyExistsError("Username already exists")

            raise DatabaseError(f"Database integrity error: {str(error)}")

        except SQLAlchemyError as error:
            self._db.rollback()
            raise DatabaseError(f"Database error: {str(error)}")
