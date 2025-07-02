from typing import Optional
from sqlmodel import SQLModel, Field


class CharacterBase(SQLModel):
    name: str = Field(description="The name of the character")
    description: str = Field(description="The description of the character", default="")
    age: int = Field(description="The age of the character", default=0)
    gender: str = Field(description="The gender of the character", default="")
    appearance: str = Field(description="The appearance of the character", default="")
    personality: str = Field(description="The personality of the character", default="")
    backstory: str = Field(description="The backstory of the character", default="")

class Character(CharacterBase,table=True):
    id: int = Field(primary_key=True, index=True)

class CharacterCreate(CharacterBase):
    pass

class CharacterRead(CharacterBase):
    id: int

class CharacterUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    appearance: Optional[str] = None
    personality: Optional[str] = None
    backstory: Optional[str] = None
