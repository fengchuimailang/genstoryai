from sqlmodel import BaseModel

class UserBase(BaseModel):
    username: str
    email: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int

    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    username: str | None = None
    email: str | None = None
    password: str | None = None

    class Config:
        orm_mode = True