from typing import Optional
from genstoryai_backend.models import CommonBase
from sqlmodel import SQLModel, Field


class StoryContentBase(SQLModel):
    story_id: int = Field(description="The id of the story")
    outline_title: str = Field(description="The title of the outline item")
    content: str = Field(description="The content of the outline item")


class StoryContent(StoryContentBase,CommonBase, table=True):
    id: int = Field(default=None, primary_key=True, index=True)

class StoryContentCreate(StoryContentBase):
    pass

class StoryContentRead(StoryContentBase):
    id: int

class StoryContentUpdate(SQLModel):
    outline_title: Optional[str] = None
    content: Optional[str] = None