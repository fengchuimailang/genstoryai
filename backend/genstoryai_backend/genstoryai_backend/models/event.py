from pydantic import BaseModel
from typing import List, Optional
from . import CommonBase
from datetime import datetime
from sqlmodel import SQLModel, Field

class EventBase(SQLModel):
    name: str = Field(description="The name of the event")
    description: str = Field(description="The description of the event")
    timeline_ids: List[int] = Field(description="The ids of the timelines")
    start_time: datetime = Field(description="The start time of the event")
    end_time: datetime = Field(description="The end time of the event")

class Event(EventBase,CommonBase, table=True):
    id: int = Field(default=None, primary_key=True, index=True)


class EventCreate(EventBase):
    pass

class EventRead(EventBase):
    id: int



class EventUpdate(EventBase):
    name: Optional[str] = None
    description: Optional[str] = None
    timeline_ids: Optional[List[int]] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
