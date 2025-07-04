"""
SSF StorySchema Format is a file protocol which contains following part:
- mate data : 存储基础信息以及版本管理，支持快速检索与分类。用于电子书平台的搜索与标签系统
- content_blocks: 将章节拆分为可独立标记的内容块，支持文本样式、多媒体混排 富文本电子书、跨媒介叙事
- charactes: 包含人物和人物关系网络，自动生成 “人物关系图谱”
- timeline: 时间线以及关键事件
- extended_metadata: 预留扩展字段，支持文学分析、版权管理等深度需求


tips
- 对content_blocks中的文本使用 LZ4 或 Zstandard 压缩，压缩比可达 1:5~1:10
"""
from pydantic import BaseModel,Field
from typing import List

from ..models.genre import Genre

class _Metadata(BaseModel):
    title: str = Field(description="The title of the story")
    author: str = Field(description="The author of the story", default="")
    genre: Genre = Field(description="The genre of the story", default=Genre.FANTASY)
    summary: str = Field(description="The summary of the story", default="")
    version: int = Field(default=1, description="版本号")

class _ContentBlocks(BaseModel):
    blocks: List[str] = Field(default_factory=list, description="List of content blocks")

class _Characters(BaseModel):
    pass

class _Timeline(BaseModel):
    pass

class _ExtendedMetadata(BaseModel):
    pass

class StorySchemaFormat(BaseModel):
    metadata: _Metadata
    content_blocks: _ContentBlocks
    characters: _Characters
    timeline: _Timeline
    extended_metadata: _ExtendedMetadata

    def to_json(self) -> str:
        return self.model_dump_json()

    @classmethod
    def from_json(cls, json_str: str) -> 'StorySchemaFormat':
        return cls.model_validate_json(json_str)
