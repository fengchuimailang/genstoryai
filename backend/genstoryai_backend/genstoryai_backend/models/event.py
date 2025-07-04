from pydantic import BaseModel
from typing import List
from . import CommonBase
from datetime import datetime

class EventBase(CommonBase, BaseModel):
    name: str
    description: str | None = None
    timeline_ids: List[int] | None = None
    start_time: datetime | None = None
    end_time: datetime | None = None

class Event(EventBase):
    id: int


class EventCreate(EventBase):
    pass

class EventRead(EventBase):
    id: int



class EventUpdate(CommonBase, BaseModel):
    name: str | None = None
    description: str | None = None
    timeline_ids: List[int] | None = None
    start_time: datetime | None = None
    end_time: datetime | None = None
