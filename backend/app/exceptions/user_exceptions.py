from app.exceptions.base_exceptions import AppException


class UserError(AppException):
    pass


class UserAlreadyExistsError(UserError):
    pass


class UserNotFoundError(UserError):
    pass
