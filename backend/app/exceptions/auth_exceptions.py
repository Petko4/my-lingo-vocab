class AuthError(Exception):
    """Base exception for auth related errors"""
    pass


class TokenExpiredError(AuthError):
    pass


class InvalidTokenError(AuthError):
    pass


class InvalidCredentialsError(AuthError):
    pass
