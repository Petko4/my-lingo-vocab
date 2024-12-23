from passlib.context import CryptContext


class PassswordService:
    def __init__(self):
        self._pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def get_password_hash(self, password) -> str:
        return self._pwd_context.hash(password)

    def verify_password(self, password: str, hashed_password: str) -> bool:
        return self._pwd_context.verify(password, hashed_password)
