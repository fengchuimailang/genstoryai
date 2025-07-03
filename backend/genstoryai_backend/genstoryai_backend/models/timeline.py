from pydantic import BaseModel
from typing import List
from . import CommonBase

class TimelineBase(CommonBase, BaseModel):
    name: str
    description: str | None = None

class Timeline(TimelineBase):
    id: int
    events: List[int] = []

    class Config:
        orm_mode = True

class TimelineCreate(TimelineBase):
    pass

class TimelineRead(TimelineBase):
    id: int

    class Config:
        orm_mode = True

class TimelineUpdate(CommonBase, BaseModel):
    name: str | None = None
    description: str | None = None
    events: List[int] | None = None

    class Config:
        orm_mode = True