from pydantic import BaseModel, Field
from typing import List
from . import CommonBase

class ContentLevel(str):
    CHAPTER = "chapter"
    SECTION = "section"
    FULL_CONTENT = "full_content"

class ContentGenerationBase(CommonBase, BaseModel):
    level: ContentLevel = Field(description="Content level, can be chapter, section, or full text")
    system_prompt: str = Field(description="System prompt for content generation")
    user_prompt: str = Field(description="User prompt")
    generation: str = Field(description="Generated content", default="")

class ContentGeneration(ContentGenerationBase):
    id: int

class ContentGenerationCreate(ContentGenerationBase):
    pass

class ContentGenerationRead(ContentGenerationBase):
    id: int

    level: ContentLevel | None = None
    generation: str | None = None
