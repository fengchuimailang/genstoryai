from pydantic import BaseModel, Field
from typing import List
from . import CommonBase

class ContentLevel(str):
    CHAPTER = "chapter"
    SECTION = "section"
    FULL_CONTENT = "full_content"

class ContentGenerationBase(CommonBase, BaseModel):
    level: ContentLevel = Field(description="内容层级，可以是章、节或者全文")
    system_prompt: str = Field(description="生成内容的系统提示词")
    user_prompt: str = Field(description="用户提示词")
    generation: str = Field(description="生成内容", default="")

class ContentGeneration(ContentGenerationBase):
    id: int

class ContentGenerationCreate(ContentGenerationBase):
    pass

class ContentGenerationRead(ContentGenerationBase):
    id: int

    level: ContentLevel | None = None
    generation: str | None = None
