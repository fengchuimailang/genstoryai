from typing import Optional, List
from sqlmodel import SQLModel, Field
from enum import Enum
from . import CommonBase

class Genre(str, Enum):
    FANTASY = "fantasy"  # 奇幻
    SCIENCE_FICTION = "science_fiction"  # 科幻
    MYSTERY = "mystery"  # 悬疑
    ROMANCE = "romance"  # 浪漫爱情
    THRILLER = "thriller"  # 惊悚
    HORROR = "horror"  # 恐怖
    ADVENTURE = "adventure"  # 冒险
    HISTORICAL = "historical"  # 历史
    CONTEMPORARY = "contemporary"  # 现代


class StoryBase(CommonBase, SQLModel):
    title: str = Field(description="The title of the story")
    creator_user_id: int = Field(description="The user id of the story")
    # owner_user_id: int = Field(description="The owner user id of the story")
    author: str = Field(description="The author of the story", default="")
    genre: Genre = Field(default=Genre.FANTASY, description="The genre of the story")
    summary: str = Field(description="The summary of the story", default="")
    version: int = Field(default=1, description="版本号")
    story_template_id: Optional[int] = Field(description="关联的故事模板 ID")

class Story(StoryBase, table=True):
    id: int = Field(primary_key=True, index=True)

class StoryCreate(StoryBase):
    pass

class StoryRead(StoryBase):
    id: int

class StoryUpdate(CommonBase, SQLModel):
    title: Optional[str] = None
    author: Optional[str] = None
    genre: Optional[Genre] = None
    summary: Optional[str] = None
    version: int = Field(default=1, description="版本号")
    content_generation_ids: Optional[List[int]] = None