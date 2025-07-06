from sqlmodel import SQLModel, Field
from typing import Optional
from sqlmodel import Field
from datetime import datetime

class UserBase(SQLModel, table=False):
    username: str = Field(default="")
    email: str = Field(default="")

class User(UserBase, table=True):
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

class UserLogin(SQLModel, table=False):
    email: str
    password: str

class UserUpdate(SQLModel, table=False):
    username: str | None = None
    email: str | None = None
    password: str | None = None
