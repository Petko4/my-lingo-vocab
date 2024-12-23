class AppException(Exception):
    """Base application exception"""
    pass
    # in case of adding app loging add timestamp and formatting exception


class DatabaseError(AppException):
    pass
