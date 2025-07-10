from typing import Optional, List, Union, Any
from sqlmodel import SQLModel, Field
from genstoryai_backend.models import CommonBase
from genstoryai_backend.models.enum.genre import Genre
from genstoryai_backend.models.enum.language import Language
from genstoryai_backend.ssf.ssf import StorySchemaFormat
from pydantic import BaseModel, validator, field_validator, computed_field
import json
from datetime import datetime


class OneLevelOutline(BaseModel):
    title: str
    content: str

class TwoLevelOutline(BaseModel):
    title: str
    content: List[OneLevelOutline]

class StoryOutline(BaseModel):
    outline: Union[List[OneLevelOutline], List[TwoLevelOutline]]

class StoryBase(SQLModel):
    title: str = Field(description="The title of the story")
    creator_user_id: int = Field(description="The user id of the story")
    author: Optional[str] = Field(description="The author of the story")
    language: Optional[Language] = Field(description="The language of the story", default=Language.zh)
    genre: Optional[Genre] = Field(description="The genre of the story")
    summary: Optional[str] = Field(description="The summary of the story")
    outline: Optional[str] = Field(description="The outline of the story")
    version_time: Optional[datetime] = Field(description="The version time of the story", default=datetime.now())
    version_text: Optional[str] = Field(description="The version text of the story")
    story_template_id: Optional[int] = Field(description="The story template id")
    ssf: Optional[str] = Field(description="SSF format story")

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

    @property
    def outline_obj(self) -> Optional[StoryOutline]:
        if self.outline:
            try:
                return StoryOutline.model_validate_json(self.outline)
            except ValueError as e:
                print(f"Error parsing outline JSON: {e}")
                return None
        return None

    @outline_obj.setter
    def outline_obj(self, value: Optional[StoryOutline]):
        if value:
            self.outline = value.model_dump_json()
        else:
            self.outline = None

class Story(StoryBase,CommonBase, table=True):
    id: int = Field(primary_key=True, index=True)

class StoryCreate(StoryBase):
    outline: Optional[Union[str, list, dict]] = None
    ssf: Optional[Union[str, list, dict]] = None

    @field_validator("outline", mode="before")
    @classmethod
    def outline_to_str(cls, v):
        if isinstance(v, (dict, list)):
            return json.dumps(v, ensure_ascii=False)
        return v

    @field_validator("ssf", mode="before")
    @classmethod
    def ssf_to_str(cls, v):
        if isinstance(v, (dict, list)):
            return json.dumps(v, ensure_ascii=False)
        return v

class StoryRead(StoryBase):
    id: int
    outline: Any  # 覆盖父类的 outline 字段
    ssf: Any  # 覆盖父类的 ssf 字段

    @field_validator("outline", mode="before")
    @classmethod
    def parse_outline(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return None
        return v

    @field_validator("ssf", mode="before")
    @classmethod
    def parse_ssf(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return None
        return v

class StoryUpdate(StoryBase):
    title: Optional[str] = None
    author: Optional[str] = None
    genre: Optional[Genre] = None
    summary: Optional[str] = None
    version_time: Optional[datetime] = None
    version_text: Optional[str] = None
    outline: Optional[Union[str, list]] = None
    story_template_id: Optional[int] = None
    ssf: Optional[str] = None

    @field_validator("outline", mode="before")
    @classmethod
    def outline_to_str(cls, v):
        if isinstance(v, (dict, list)):
            return json.dumps(v, ensure_ascii=False)
        return v
    
    @field_validator("ssf", mode="before")
    @classmethod
    def ssf_to_str(cls, v):
        if isinstance(v, dict):
            return json.dumps(v, ensure_ascii=False)
        return v