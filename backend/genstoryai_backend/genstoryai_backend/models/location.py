from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from genstoryai_backend.models import CommonBase
from genstoryai_backend.models.enum.location_type import LocationType

if TYPE_CHECKING:
    from genstoryai_backend.models.event import Event

class LocationBase(SQLModel):
    """地点基础模型"""
    story_id: int = Field(description="所属故事的ID")
    name: str = Field(description="地点名称")
    description: Optional[str] = Field(description="地点描述", default=None)
    
    # 坐标信息
    x: Optional[float] = Field(description="X坐标", default=None)
    y: Optional[float] = Field(description="Y坐标", default=None)
    
    # 地点类型
    location_type: Optional[LocationType] = Field(description="地点类型", default=None)

class Location(LocationBase, CommonBase, table=True):
    """地点模型"""
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    
    # 关联到事件（一对多，可选）
    events: List["Event"] = Relationship(back_populates="location")

class LocationCreate(LocationBase):
    """创建地点"""
    pass

class LocationRead(LocationBase):
    """读取地点"""
    id: int
    event_count: int = 0  # 发生事件数量

class LocationUpdate(SQLModel):
    """更新地点"""
    name: Optional[str] = None
    description: Optional[str] = None
    x: Optional[float] = None
    y: Optional[float] = None
    location_type: Optional[LocationType] = None 