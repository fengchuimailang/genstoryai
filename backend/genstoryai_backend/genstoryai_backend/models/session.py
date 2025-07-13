from sqlmodel import SQLModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID, uuid4
from enum import Enum
from sqlalchemy import JSON
from genstoryai_backend.models.session_message import SessionMessage, MessageRole


class SessionStatus(str, Enum):
    ACTIVE = "active"
    CLOSED = "closed"
    ARCHIVED = "archived"


class Session(SQLModel, table=True):
    """会话表"""
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: str = Field(max_length=255, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    title: Optional[str] = Field(max_length=255, default=None)
    status: SessionStatus = Field(default=SessionStatus.ACTIVE)
    session_metadata: Optional[dict] = Field(default_factory=dict, sa_type=JSON)  # 避免与SQLModel.metadata冲突
    total_tokens: int = Field(default=0)
    model_used: Optional[str] = Field(max_length=100, default=None)


class Tool(SQLModel, table=True):
    """工具注册表"""
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(max_length=255, unique=True, nullable=False)
    description: Optional[str] = Field(default=None)
    version: Optional[str] = Field(max_length=50, default=None)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ToolUsage(SQLModel, table=True):
    """工具使用统计表"""
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    session_id: UUID = Field(foreign_key="session.id", nullable=False)
    tool_id: UUID = Field(foreign_key="tool.id", nullable=False)
    message_id: UUID = Field(foreign_key="sessionmessage.id", nullable=False)
    execution_time_ms: Optional[int] = Field(default=None)
    success: bool = Field(default=True)
    error_message: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)


# Pydantic models for API responses
class SessionCreate(SQLModel):
    user_id: str
    title: Optional[str] = None
    session_metadata: Optional[dict] = None


class SessionRead(SQLModel):
    id: UUID
    user_id: str
    created_at: datetime
    updated_at: datetime
    title: Optional[str]
    status: SessionStatus
    session_metadata: Optional[dict]
    total_tokens: int
    model_used: Optional[str]


class ToolCreate(SQLModel):
    name: str
    description: Optional[str] = None
    version: Optional[str] = None
    is_active: bool = True


class ToolRead(SQLModel):
    id: UUID
    name: str
    description: Optional[str]
    version: Optional[str]
    is_active: bool
    created_at: datetime


class ToolUsageCreate(SQLModel):
    session_id: UUID
    tool_id: UUID
    message_id: UUID
    execution_time_ms: Optional[int] = None
    success: bool = True
    error_message: Optional[str] = None


class ToolUsageRead(SQLModel):
    id: UUID
    session_id: UUID
    tool_id: UUID
    message_id: UUID
    execution_time_ms: Optional[int]
    success: bool
    error_message: Optional[str]
    created_at: datetime 