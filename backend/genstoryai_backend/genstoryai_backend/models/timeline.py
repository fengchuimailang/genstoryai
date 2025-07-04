from pydantic import BaseModel
from typing import List
from . import CommonBase
from datetime import datetime

class TimelineBase(CommonBase, BaseModel):
    name: str
    start_time: datetime
    end_time: datetime
    description: str | None = None

class Timeline(TimelineBase):
    id: int
    events: List[int] = []

class TimelineCreate(TimelineBase):
    pass

class TimelineRead(TimelineBase):
    id: int

    class Config:
        orm_mode = True

class TimelineUpdate(CommonBase, BaseModel):
    name: str | None = None
    start_time: datetime | None = None
    end_time: datetime | None = None
    description: str | None = None
    events: List[int] | None = None

    class Config:
        orm_mode = True