from typing import Optional
from sqlmodel import SQLModel, Field
from . import CommonBase


class CharacterBase(CommonBase, SQLModel):
    name: str = Field(description="The name of the character")
    is_main: bool = Field(description="Whether the character is the main character", default=False)
    description: str = Field(description="The description of the character", default="")
    age: int = Field(description="The age of the character", default=0)
    mbti: str = Field(description="The MBTI of the character", default="")
    character_arc: str = Field(description="The character arc of the character", default="")
    personality_quirks: str = Field(description="The personality quirks of the character", default="")
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

class CharacterUpdate(CommonBase, SQLModel):
    name: Optional[str] = None
    is_main: Optional[bool] = None
    description: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    appearance: Optional[str] = None
    personality: Optional[str] = None
    backstory: Optional[str] = None
