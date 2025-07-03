from pydantic import BaseModel, Field
from typing import List
from . import CommonBase

class ContentLevel(str):
    CHAPTER = "chapter"
    SECTION = "section"
    FULL_CONTENT = "full_content"

class ContentGenerationBase(CommonBase, BaseModel):
    level: ContentLevel = Field(description="内容层级，可以是章、节或者全文")
    content: str = Field(description="故事内容", default="")

class ContentGeneration(ContentGenerationBase):
    id: int

    class Config:
        orm_mode = True

class ContentGenerationCreate(ContentGenerationBase):
    pass

class ContentGenerationRead(ContentGenerationBase):
    id: int

    class Config:
        orm_mode = True

class ContentGenerationUpdate(CommonBase, BaseModel):
    level: ContentLevel | None = None
    content: str | None = None

    class Config:
        orm_mode = True