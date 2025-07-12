from typing import Optional
from sqlmodel import SQLModel, Field


class CharacterEvent(SQLModel, table=True):
    """角色-事件关联表"""
    
    character_id: int = Field(foreign_key="character.id", primary_key=True)
    event_id: int = Field(foreign_key="event.id", primary_key=True)
    
    # 角色在事件中的详细信息
    role: Optional[str] = Field(description="角色在事件中的角色/作用", default=None)
    importance: Optional[int] = Field(description="角色在事件中的重要程度", default=1)
    actions: Optional[str] = Field(description="角色在事件中的具体行动", default=None)
    emotions: Optional[str] = Field(description="角色在事件中的情感状态", default=None) 