from pydantic import BaseModel, Field
from typing import List
from . import CommonBase

class ContentLevel(str):
    CHAPTER = "chapter"
    SECTION = "section"
    FULL_CONTENT = "full_content"

class StoryContentBase(CommonBase, BaseModel):
    level: ContentLevel = Field(description="内容层级，可以是章、节或者全文")
    content: str = Field(description="故事内容", default="")

class StoryContent(StoryContentBase):
    id: int

    class Config:
        orm_mode = True

class StoryContentCreate(StoryContentBase):
    pass

class StoryContentRead(StoryContentBase):
    id: int

    class Config:
        orm_mode = True

class StoryContentUpdate(CommonBase, BaseModel):
    level: ContentLevel | None = None
    content: str | None = None

    class Config:
        orm_mode = True