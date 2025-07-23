"""
Models for story and related entities. Includes story base, creation, reading, and update schemas.
- Outline and SSF fields are stored as JSON strings for flexibility.
- Indexes are added to common query fields for performance.
- Relationships are defined for ORM navigation.
"""
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship, JSON
from genstoryai_backend.models import CommonBase
from genstoryai_backend.models.enum.genre import Genre
from genstoryai_backend.models.enum.language import Language
from genstoryai_backend.ssf.ssf import StorySchemaFormat
from pydantic import BaseModel
from datetime import datetime

if TYPE_CHECKING:
    from genstoryai_backend.models.timeline import Timeline


class OutlineItem(BaseModel):
    title: str = Field(description="The title of the outline item")
    content: str = Field(description="The content of the outline item")
    story_content_id: Optional[int] = Field(default=None, description="The story content id")


class StoryOutline(BaseModel):
    itemList: List[OutlineItem] = Field(description="The outline of the story")

class StoryBase(SQLModel):
    title: str = Field(description="The title of the story")
    creator_user_id: Optional[int] = Field(description="The user id of the story", index=True)
    author: Optional[str] = Field(description="The author of the story")
    language: Optional[Language] = Field(description="The language of the story", default=Language.zh, index=True)
    genre: Optional[Genre] = Field(description="The genre of the story", index=True)
    summary: Optional[str] = Field(description="The summary of the story")
    outline: Optional[dict] = Field(default=None, sa_type=JSON, description="The outline of the story")
    version_time: Optional[datetime] = Field(description="The version time of the story", default_factory=datetime.now)
    version_text: Optional[str] = Field(description="The version text of the story")
    story_template_id: Optional[int] = Field(description="The story template id")
    ssf: Optional[dict] = Field(default=None, sa_type=JSON, description="SSF format story")

    @property
    def outline_obj(self) -> Optional[StoryOutline]:
        if self.outline is not None:
            return StoryOutline.model_validate(self.outline)
        return None

    @outline_obj.setter
    def outline_obj(self, value: Optional[StoryOutline]):
        if value is not None:
            self.outline = value.model_dump()
        else:
            self.outline = None

    @property
    def ssf_obj(self) -> Optional[StorySchemaFormat]:
        if self.ssf is not None:
            return StorySchemaFormat.model_validate(self.ssf)
        return None

    @ssf_obj.setter
    def ssf_obj(self, value: Optional[StorySchemaFormat]):
        if value is not None:
            self.ssf = value.model_dump()
        else:
            self.ssf = None


class Story(StoryBase,CommonBase, table=True):
    id: int = Field(primary_key=True, index=True)
    timeline: Optional["Timeline"] = Relationship(back_populates="story")

class StoryCreate(StoryBase):
    pass

class StoryRead(StoryBase):
    id: int
    pass

class StoryUpdate(StoryBase):
    title: Optional[str] = None
    creator_user_id: Optional[int] = None
    author: Optional[str] = None
    genre: Optional[Genre] = None
    summary: Optional[str] = None
    version_time: Optional[datetime] = None
    version_text: Optional[str] = None
    outline: Optional[StoryOutline] = None
    story_template_id: Optional[int] = None
    ssf: Optional[StorySchemaFormat] = None