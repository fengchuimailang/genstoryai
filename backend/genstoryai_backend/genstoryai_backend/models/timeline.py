from typing import List, Optional, TYPE_CHECKING
from . import CommonBase
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from genstoryai_backend.models.story import Story
    from genstoryai_backend.models.event import Event

class TimelineBase(SQLModel):
    name: str = Field(description="时间线名称")
    description: Optional[str] = Field(description="时间线描述", default=None)
    start_time: Optional[datetime] = Field(description="时间线开始时间", default=None)
    end_time: Optional[datetime] = Field(description="时间线结束时间", default=None)

class Timeline(TimelineBase,CommonBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    
    # 关联到故事（一对一）
    story_id: int = Field(foreign_key="story.id", unique=True)
    story: "Story" = Relationship(back_populates="timeline")
    
    # 关联到事件（一对多）
    events: List["Event"] = Relationship(back_populates="timeline")

class TimelineCreate(TimelineBase):
    story_id: int = Field(description="所属故事的ID")

class TimelineRead(TimelineBase):
    id: int
    story_id: int
    event_count: int = 0  # 事件数量

class TimelineUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    story_id: Optional[int] = None