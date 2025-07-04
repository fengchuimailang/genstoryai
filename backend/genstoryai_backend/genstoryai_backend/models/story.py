from typing import Optional, List
from sqlmodel import SQLModel, Field
from . import CommonBase
from ..ssf.ssf import StorySchemaFormat
from .genre import Genre


class StoryBase(CommonBase, SQLModel):
    title: str = Field(description="The title of the story")
    creator_user_id: int = Field(description="The user id of the story")
    # owner_user_id: int = Field(description="The owner user id of the story")
    author: str = Field(description="The author of the story", default="")
    genre: Genre = Field(default=Genre.FANTASY, description="The genre of the story")
    summary: str = Field(description="The summary of the story", default="")
    version: int = Field(default=1, description="版本号")
    story_template_id: Optional[int] = Field(description="关联的故事模板 ID")
    ssf: Optional[str] = Field(default=None, description="SSF 格式的故事")

    @property
    def ssf_obj(self) -> Optional[StorySchemaFormat]:
        if self.ssf:
            try:
                return StorySchemaFormat.from_json(self.ssf)
            except ValueError as e:
                # 处理无效 JSON 的情况，例如记录日志或返回 None
                print(f"Error parsing SSF JSON: {e}")
                return None
        return None

    @ssf_obj.setter
    def ssf_obj(self, value: Optional[StorySchemaFormat]):
        if value:
            self.ssf = value.to_json()
        else:
            self.ssf = None

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