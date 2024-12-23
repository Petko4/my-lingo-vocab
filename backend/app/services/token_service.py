import jwt

from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import settings
from app.exceptions.auth_exceptions import TokenExpiredError, InvalidTokenError
from app.models.token_model import RefreshToken
from app.exceptions.base_exceptions import DatabaseError


class TokenService:
    def __init__(self, db: Session):
        self._db = db

    def create_access_token(self, data: dict):
        return self._create_token(data, expires_delta=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    def create_refresh_token(self, data: dict):
        refresh_token = self._create_token(
            data, settings.REFRESH_TOKEN_EXPIRE_MINUTES)

        db_token = RefreshToken(
            user_id=data["sub"],
            token=refresh_token,
            expires_at=datetime.now(
                timezone.utc) + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
        )
        try:
            self._db.add(db_token)
            self._db.commit()
            return refresh_token
        except SQLAlchemyError as error:
            raise DatabaseError("Token saving failed.")

    def _create_token(self, data: dict, expires_delta: timedelta | None = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + \
                timedelta(minutes=expires_delta)
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=15)

        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(
            to_encode, settings.SECRET_KEY, algorithm=settings.JWT_TOKEN_ALGORITHM)

        return encoded_jwt

    def get_user_id_from_token(self, token: str) -> str:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY,
                                 algorithms=[settings.JWT_TOKEN_ALGORITHM])
            user_id = payload["sub"]
            return user_id
        except jwt.ExpiredSignatureError:
            raise TokenExpiredError
        except jwt.PyJWTError:
            raise InvalidTokenError
