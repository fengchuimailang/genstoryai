from pydantic import BaseModel
from typing import List
from . import CommonBase

class EventBase(CommonBase, BaseModel):
    name: str
    description: str | None = None
    timeline_ids: List[int]

class Event(EventBase):
    id: int

    class Config:
        orm_mode = True

class EventCreate(EventBase):
    pass

class EventRead(EventBase):
    id: int

    class Config:
        orm_mode = True

class EventUpdate(CommonBase, BaseModel):
    name: str | None = None
    description: str | None = None
    timeline_ids: List[int] | None = None

    class Config:
        orm_mode = True