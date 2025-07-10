from sqlmodel import SQLModel, Field
from typing import Optional
from sqlmodel import Field
from datetime import datetime
from genstoryai_backend.models import CommonBase


class UserBase(SQLModel):
    username: str = Field(default="")
    email: str = Field(default="")

class User(UserBase,CommonBase, table=True):
    id: int = Field(default=None, primary_key=True)
    is_active: bool = Field(default=True)
    password: str = Field(default="")
    is_verified: bool = Field(default=False)
    verification_token: Optional[str] = Field(default=None)
    token_created_at: Optional[datetime] = Field(default=None)

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int

class UserLogin(SQLModel):
    email: str
    password: str

class UserUpdate(UserBase):
    username:Optional[str] = None
    email:Optional[str] = None
