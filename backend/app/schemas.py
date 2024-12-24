from pydantic import BaseModel, Field, field_validator
import re


class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=20, error_messages={
        "min_length": "Username must have at least 3 characters.",
        "max_length": "Username must be no longer than 50 characters."
    }, examples=["pepa"])
    email: str = Field(
        pattern=r'^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$',
        examples=["pepa@example.com"])
    password: str
    native_language: str

    @field_validator("password")
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters.')
        if not re.search(r"\d", v):
            raise ValueError('The password must contain at least one number.')
        if not re.search(r"[a-z]", v):
            raise ValueError(
                'The password must contain at least one lower case letter.')
        if not re.search(r"[A-Z]", v):
            raise ValueError(
                'The password must contain at least one capital letter.')
        if not re.search(r"[^A-Za-z0-9]", v):
            raise ValueError(
                'The password must contain at least one special character.')
        return v


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    native_language: str


# class UserLogin(BaseModel):
#     username: str
#     password: str


class Token(BaseModel):
    access_token: str
    token_type: str
