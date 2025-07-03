from typing import Optional, List
from sqlmodel import SQLModel, Field
from . import CommonBase


class StoryBase(CommonBase, SQLModel):
    title: str = Field(description="The title of the story")
    author: str = Field(description="The author of the story", default="")
    genre: str = Field(description="The genre of the story", default="")
    summary: str = Field(description="The summary of the story", default="")
    version: int = Field(default=1, description="版本号")
    story_content_ids: List[int] = Field(description="关联的故事内容 ID 列表", default=[])

class Story(StoryBase, table=True):
    id: int = Field(primary_key=True, index=True)

class StoryCreate(StoryBase):
    pass

class StoryRead(StoryBase):
    id: int

class StoryUpdate(CommonBase, SQLModel):
    title: Optional[str] = None
    author: Optional[str] = None
    genre: Optional[str] = None
    summary: Optional[str] = None
    version: int = Field(default=1, description="版本号")
    story_content_ids: Optional[List[int]] = None