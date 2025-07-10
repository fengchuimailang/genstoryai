from pydantic import BaseModel
from typing import List, Optional
from . import CommonBase
from datetime import datetime
from sqlmodel import SQLModel, Field

class TimelineBase(SQLModel):
    name: str = Field(description="The name of the timeline")
    start_time: datetime = Field(description="The start time of the timeline")
    end_time: datetime = Field(description="The end time of the timeline")
    description: str = Field(description="The description of the timeline")

class Timeline(TimelineBase,CommonBase, table=True):
    id: int = Field(default=None, primary_key=True, index=True)

class TimelineCreate(TimelineBase):
    pass

class TimelineRead(TimelineBase):
    id: int

class TimelineUpdate(TimelineBase):
    name: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    description: Optional[str] = None