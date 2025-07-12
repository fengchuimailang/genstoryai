from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from genstoryai_backend.models import CommonBase
from genstoryai_backend.models.enum.gender import Gender
from genstoryai_backend.models.enum.mbti import MBTI

if TYPE_CHECKING:
    from genstoryai_backend.models.event import Event

class CharacterBase(SQLModel):
    """角色基础模型"""
    story_id: int = Field(description="所属故事的ID")
    name: str = Field(description="角色名称")
    is_main: bool = Field(description="是否为主角", default=False)
    
    # 基本信息
    gender: Optional[Gender] = Field(description="性别", default=None)
    age: Optional[int] = Field(description="年龄", default=None)
    mbti: Optional[MBTI] = Field(description="MBTI性格类型", default=None)
    
    # 角色描述
    personality: Optional[str] = Field(description="性格特点", default=None)
    backstory: Optional[str] = Field(description="背景故事", default=None)
    appearance: Optional[str] = Field(description="外貌描述", default=None)
    character_arc: Optional[str] = Field(description="The character arc of the character", default=None)
    personality_quirks: Optional[str] = Field(description="The personality quirks of the character", default=None)
    description: Optional[str] = Field(description="角色描述", default=None)

class Character(CharacterBase, CommonBase, table=True):
    """角色模型"""
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    
    # 关联到事件（多对多，可选）
    events: List["Event"] = Relationship(
        back_populates="characters",
        link_model="CharacterEvent"
    )
    


class CharacterCreate(CharacterBase):
    """创建角色"""
    pass

class CharacterRead(CharacterBase):
    """读取角色"""
    id: int
    event_count: int = 0  # 参与事件数量

class CharacterUpdate(SQLModel):
    """更新角色"""
    name: Optional[str] = None
    is_main: Optional[bool] = None
    gender: Optional[Gender] = None
    age: Optional[int] = None
    mbti: Optional[MBTI] = None
    personality: Optional[str] = None
    backstory: Optional[str] = None
    appearance: Optional[str] = None
    character_arc: Optional[str] = None
    personality_quirks: Optional[str] = None
    description: Optional[str] = None 