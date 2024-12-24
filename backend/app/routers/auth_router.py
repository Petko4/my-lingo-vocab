from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas import UserCreate, UserResponse, Token
from app.services.user_service import UserService
from app.services.auth_service import AuthService
from app.core.config import settings
from app.exceptions.auth_exceptions import InvalidCredentialsError, TokenExpiredError, InvalidTokenError
from app.exceptions.user_exceptions import UserAlreadyExistsError, UserNotFoundError
from app.exceptions.base_exceptions import DatabaseError
from app.dependencies import get_user_service, get_auth_service


router = APIRouter(
    prefix="/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}}
)


@router.post("/signup")
async def sign_user(user: UserCreate, user_service: UserService = Depends(get_user_service)) -> UserResponse:
    try:
        new_user = user_service.add_user(
            user.username, user.email, user.password, user.native_language)
        return new_user

    except UserAlreadyExistsError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error)
        )

    except DatabaseError as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(error)
        )


@router.post("/signin")
async def sign_in(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), auth_service: AuthService = Depends(get_auth_service)):
    try:
        (access_token, refresh_token) = auth_service.sign_in(
            form_data.username, form_data.password)

        # set refresh token as httponly cookie
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=False,  # Enable for https
            samesite="strict",
            max_age=60 * 24 * 7,
            path="/auth/refresh"
        )

        # set access token in response body
        # return Token(access_token=access_token, token_type="bearer")
        return {"access_token": access_token, "token_type": "bearer"}

    except (UserNotFoundError, InvalidCredentialsError) as error:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Invalid Credentials", headers={"WWW-Authenticate": "Bearer"})
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Something went wrong")


@router.post("/refresh")
async def refresh_token(response: Response, refresh_token: str | None = Cookie(None), auth_service: AuthService = Depends(get_auth_service)):
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token missing")

    try:
        (new_access_token, new_refresh_token) = auth_service.refresh(refresh_token)

        response.set_cookie(
            key="refresh_token",
            value=new_refresh_token,
            httponly=True,
            secure=False,
            samesite="strict",
            max_age=60 * 24 * 7,
            path="/auth/refresh"
        )

        return Token(access_token=new_access_token, token_type="bearer")

    except TokenExpiredError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


@router.post("/signout")
async def sign_out(response: Response, refresh_token: str = Cookie(None), auth_service: AuthService = Depends(get_auth_service)):
    try:
        auth_service.revoke_refresh_token(refresh_token)
        response.delete_cookie(key="refresh_token", path="/auth/refresh")
        return {"message": "Successfully logged out"}
    except DatabaseError as error:
        print(str(error))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Something went wrong.")
