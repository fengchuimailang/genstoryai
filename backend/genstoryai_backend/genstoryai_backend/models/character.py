from typing import Optional
from sqlmodel import SQLModel, Field
from genstoryai_backend.models import CommonBase
from genstoryai_backend.models.enum.gender import Gender
from genstoryai_backend.models.enum.mbti import MBTI

# 基础角色字段定义
class CharacterBase(SQLModel):
    story_id: int = Field(description="The id of the story")
    name: str = Field(description="The name of the character")
    is_main: bool = Field(description="Whether the character is the main character", default=False)
    gender: Optional[Gender] = Field(description="The gender of the character", default=None)
    age: Optional[int] = Field(description="The age of the character", default=None)
    mbti: Optional[MBTI] = Field(description="The MBTI of the character", default=None)
    personality: Optional[str] = Field(description="The personality of the character", default=None)
    backstory: Optional[str] = Field(description="The backstory of the character", default=None)
    appearance: Optional[str] = Field(description="The appearance of the character", default=None)
    character_arc: Optional[str] = Field(description="The character arc of the character", default=None)
    personality_quirks: Optional[str] = Field(description="The personality quirks of the character", default=None)
    description: Optional[str] = Field(description="The description of the character", default=None)



# 数据库模型
class Character(CharacterBase, CommonBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, index=True)


# AI生成和用户创建 
class CharacterCreate(CharacterBase):
    pass


# API响应
class CharacterRead(CharacterBase):
    id: int



# 更新模型 - 所有字段都是可选的
class CharacterUpdate(SQLModel):
    name: Optional[str] = None
    is_main: Optional[bool] = None
    gender: Optional[str] = None
    age: Optional[int] = None
    mbti: Optional[str] = None
    personality: Optional[str] = None
    backstory: Optional[str] = None
    appearance: Optional[str] = None
    character_arc: Optional[str] = None
    personality_quirks: Optional[str] = None
    description: Optional[str] = None

