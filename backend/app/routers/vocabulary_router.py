from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies import require_auth, get_vocabulary_service
from app.services.vocabulary_service import VocabularyService
from app.schemas.vocabulary_schema import VocabularyCreate, Vocabulary, VocabularyIds
from app.exceptions.base_exceptions import DatabaseError
from app.exceptions.vocabulary_exceptions import VocabularyNotFoundError, UnauthorizedVocabularyAccessError
from app.exceptions.user_exceptions import UserNotFoundError

router = APIRouter(
    prefix="/vocabulary",
    responses={404: {"description": "Not found"}},
    tags=["vocabulary"],
    dependencies=[Depends(require_auth)]
)


@router.post("")
async def create_vocabulary(vocabulary: VocabularyCreate, current_user: str = Depends(require_auth), vocabulary_service: VocabularyService = Depends(get_vocabulary_service)) -> Vocabulary:
    try:
        vocabulary = vocabulary_service.create_vocabulary(
            user=current_user,
            source_language=vocabulary.source_language,
            target_language=vocabulary.target_language
        )
        return vocabulary
    except DatabaseError as error:
        print(f"{str(error)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong")


@router.get("")
async def get_vocabularies(current_user: str = Depends(require_auth), vocabulary_service: VocabularyService = Depends(get_vocabulary_service)) -> list[Vocabulary]:
    vocabularies = vocabulary_service.get_vocabularies(current_user)
    return vocabularies


@router.get("/{vocabulary_id}")
async def get_vocabulary(vocabulary_id: int, current_user: str = Depends(require_auth), vocabulary_service: VocabularyService = Depends(get_vocabulary_service)) -> Vocabulary:
    try:
        return vocabulary_service.get_vocabulary_by_id(current_user, vocabulary_id)
    except VocabularyNotFoundError as error:
        print(f"{str(error)}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vocabulary with ID: {vocabulary_id} not found"
        )
    except UnauthorizedVocabularyAccessError as error:
        print(f"{str(error)}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"You don't have permission to access vocabulary with ID: {vocabulary_id}"
        )


@router.delete("/{vocabulary_id}")
async def delete_vocabulary(vocabulary_id: int, current_user: str = Depends(require_auth), vocabulary_service: VocabularyService = Depends(get_vocabulary_service)) -> Vocabulary:
    try:
        return vocabulary_service.delete_vocabulary_by_id(
            current_user, vocabulary_id)

    except UnauthorizedVocabularyAccessError as error:
        print(f"{str(error)}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"You don't have permission to delete vocabulary with ID: {vocabulary_id}"
        )
    except VocabularyNotFoundError as error:
        print(f"str(error)")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vocabulary with ID: {vocabulary_id} not found"
        )
    except DatabaseError as error:
        print(f"{str(error)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong")


@router.post("/bulk-delete")
async def bulk_delete_vocabularies(vocabularyIds: VocabularyIds, current_user: str = Depends(require_auth), vocabulary_service: VocabularyService = Depends(get_vocabulary_service)) -> list[Vocabulary]:
    try:
        return vocabulary_service.delete_vocabularies_by_id(current_user, vocabularyIds.ids)

    except UnauthorizedVocabularyAccessError as error:
        print(f"{str(error)}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"You don't have permission to delete one or more vocabularies"
        )
    except VocabularyNotFoundError as error:
        print(f"str(error)")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vocabulary with ID: {vocabulary_id} not found"
        )
    except DatabaseError as error:
        print(f"{str(error)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong"
        )
