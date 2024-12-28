from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.services.user_service import UserService
from app.services.password_service import PassswordService
from app.services.token_service import TokenService
from app.services.auth_service import AuthService


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_oauth_scheme():
    return OAuth2PasswordBearer(tokenUrl="/auth/signin")


def get_password_service():
    return PassswordService()


def get_token_service(db: Session = Depends(get_db)):
    return TokenService(db)


def get_user_service(db: Session = Depends(get_db), password_service: PassswordService = Depends(get_password_service)):
    return UserService(db, password_service)


def get_auth_service(db: Session = Depends(get_db),
                     user_service: UserService = Depends(get_user_service),
                     password_service: PassswordService = Depends(
                         get_password_service),
                     token_service: TokenService = Depends(get_token_service)):
    return AuthService(db, user_service, password_service, token_service)


async def require_auth(token: str = Depends(get_oauth_scheme()), token_service: TokenService = Depends(get_token_service), db: Session = Depends(get_db)):
    return await AuthService.get_current_user(token, token_service, db)
