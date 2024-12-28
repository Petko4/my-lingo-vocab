from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timezone

from app.core.config import settings
from app.exceptions.auth_exceptions import TokenExpiredError, InvalidTokenError
from app.exceptions.user_exceptions import UserNotFoundError
from app.exceptions.auth_exceptions import InvalidCredentialsError
from app.services.user_service import UserService
from app.services.password_service import PassswordService
from app.services.token_service import TokenService
from app.models.token_model import RefreshToken
from app.models.user_model import User
from app.exceptions.base_exceptions import DatabaseError


class AuthService:
    def __init__(self, db: Session, user_service: UserService, password_service: PassswordService, token_service: TokenService):
        self._db = db
        self._user_service = user_service
        self._password_service = password_service
        self._token_service = token_service

    def sign_in(self, username: str, password: str) -> str:
        try:
            user = self._user_service.get_user_by_username(username)
        except UserNotFoundError as error:
            print(str(error))  # add to log later
            raise error

        if self._password_service.verify_password(password, user.hashed_password):
            access_token = self._token_service.create_access_token(
                data={"sub": user.id})
            refresh_token = self._token_service.create_refresh_token(data={
                                                                     "sub": user.id})
            return (access_token, refresh_token)

        raise InvalidCredentialsError("Password mismatch")

    def refresh(self, refresh_token: str) -> tuple[str, str]:
        try:
            user_id = self._verify_refresh_token(refresh_token)
            self.revoke_refresh_token(refresh_token)
            access_token = self._token_service.create_access_token(
                {"sub": user_id})
            refresh_token = self._token_service.create_refresh_token({
                                                                     "sub": user_id})
            return (access_token, refresh_token)

        except (InvalidTokenError, TokenExpiredError) as error:
            print(str(error))  # add to log later
            raise error

    def _verify_refresh_token(self, refresh_token: str) -> int:
        db_token = self._db.query(RefreshToken)\
            .filter(
                RefreshToken.token == refresh_token,
                RefreshToken.revoked == False,
                RefreshToken.expires_at > datetime.now(timezone.utc)
        ).first()

        if not db_token:
            raise InvalidTokenError("Token not found or expired")

    def revoke_refresh_token(self, refresh_token: str):
        try:
            db_token = self._db.query(RefreshToken)\
                .filter(RefreshToken.token == refresh_token).first()

            if db_token:
                db_token.revoked = True
                db_token.revoked_at = datetime.now(timezone.utc)
                self._db.commit()
        except SQLAlchemyError as error:
            self._db.rollback()
            raise DatabaseError(f"Failed to revoke token: {str(error)}")

    def revoke_all_user_tokens(self, user_id: int):
        try:
            self._db.query(RefreshToken)\
                .filter(
                    RefreshToken == user_id,
                    RefreshToken.revoked == False
            )\
                .update({
                    "revoked": True,
                    "revoked_at": datetime.now(timezone.utc)
                })
            self._db.commit()
        except SQLAlchemyError as error:
            self._db.rollback()
            raise DatabaseError(f"Failed to revoke user tokens: {str(error)}")

    @staticmethod
    async def get_current_user(
        token: str,
        token_service: TokenService,
        db: Session
    ):
        print("in get_current_user")
        try:
            user_id = token_service.get_user_id_from_token(token)
            user = db.query(User).get(user_id)
            if not user:
                raise UserNotFoundError
            return user
        except TokenExpiredError as error:
            print(f"Token expired: {str(error)}")
            return user
        except InvalidTokenError as error:
            print(f"Invalid token: {str(error)}")
