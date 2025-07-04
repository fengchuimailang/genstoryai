from enum import Enum
from typing import Optional
from sqlmodel import SQLModel, Field
from .story import Genre

class StoryTemplateBase(SQLModel):
    genre: Genre = Field(description="故事类型")
    title_template: str = Field(description="标题模板")
    plot_template: str = Field(description="剧情模板")
    character_template: str = Field(description="角色模板")

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