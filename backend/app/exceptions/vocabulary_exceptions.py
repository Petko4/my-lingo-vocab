from app.exceptions.base_exceptions import AppException


class VocabularyError(AppException):
    pass


class VocabularyNotFoundError(VocabularyError):
    pass


class UnauthorizedVocabularyAccessError(VocabularyError):
    pass
