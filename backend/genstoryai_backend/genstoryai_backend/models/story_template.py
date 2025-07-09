from enum import Enum
from typing import Optional
from sqlmodel import SQLModel, Field
from .story import Genre

class StoryTemplateBase(SQLModel):
    genre: Genre = Field(description="Story genre")
    title_template: str = Field(description="Title template")
    plot_template: str = Field(description="Plot template")
    character_template: str = Field(description="Character template")

class StoryTemplate(StoryTemplateBase, table=True):
    id: int = Field(primary_key=True, index=True)

class StoryTemplateCreate(StoryTemplateBase):
    pass

class StoryTemplateRead(StoryTemplateBase):
    id: int

class StoryTemplateUpdate(SQLModel):
    genre: Optional[Genre] = None
    title_template: Optional[str] = None
    plot_template: Optional[str] = None
    character_template: Optional[str] = None
    setting_template: Optional[str] = None