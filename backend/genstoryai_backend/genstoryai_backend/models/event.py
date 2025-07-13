from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from genstoryai_backend.models import CommonBase
from datetime import datetime
from genstoryai_backend.models.character_event import CharacterEvent

if TYPE_CHECKING:
    from genstoryai_backend.models.character import Character
    from genstoryai_backend.models.location import Location
    from genstoryai_backend.models.timeline import Timeline

class EventBase(SQLModel):
    """事件基础模型"""
    story_id: int = Field(description="所属故事的ID")
    name: Optional[str] = Field(description="事件名称", default=None)
    description: Optional[str] = Field(description="事件描述", default=None)
    
    # 时间信息
    start_time: datetime = Field(description="事件开始时间")
    end_time: Optional[datetime] = Field(description="事件结束时间", default=None)
    
    # 事件类型
    event_description: Optional[str] = Field(description="事件描述", default=None)

class Event(EventBase, CommonBase, table=True):
    """事件模型"""
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    
    # 关联到时间线（多对一）
    timeline_id: Optional[int] = Field(foreign_key="timeline.id", default=None)
    timeline: Optional["Timeline"] = Relationship(back_populates="events")
    
    # 关联到地点（可选）
    location_id: Optional[int] = Field(foreign_key="location.id", default=None)
    location: Optional["Location"] = Relationship(back_populates="events")
    
    # 父事件ID（支持事件层级）
    parent_event_id: Optional[int] = Field(foreign_key="event.id", default=None)
    
    # 关联到角色（多对多，可选）
    characters: List["Character"] = Relationship(
        back_populates="events",
        link_model=CharacterEvent
    )
    
    # 子事件（一对多）
    sub_events: List["Event"] = Relationship(
        back_populates="parent_event",
        sa_relationship_kwargs={"foreign_keys": "Event.parent_event_id"}
    )
    
    # 父事件（多对一）
    parent_event: Optional["Event"] = Relationship(
        back_populates="sub_events",
        sa_relationship_kwargs={"foreign_keys": "Event.parent_event_id", "remote_side": "Event.id"}
    )

class EventCreate(EventBase):
    """创建事件"""
    parent_event_id: Optional[int] = Field(description="父事件ID", default=None)

class EventRead(EventBase):
    """读取事件"""
    id: int
    parent_event_id: Optional[int] = None
    location_name: Optional[str] = None
    sub_event_count: int = 0

class EventUpdate(SQLModel):
    """更新事件"""
    name: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    event_description: Optional[str] = None
    parent_event_id: Optional[int] = None
    location_id: Optional[int] = None
    timeline_id: Optional[int] = None 