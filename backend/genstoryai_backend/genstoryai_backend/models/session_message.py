from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4
from enum import Enum
from sqlalchemy import JSON

class MessageRole(str, Enum):
    USER = "user"
    AGENT = "agent"
    SYSTEM = "system"
    TOOL_CALL = "tool_call"
    TOOL_OUTPUT = "tool_output"
    THOUGHT = "thought"

class SessionMessage(SQLModel, table=True):
    """会话消息表"""
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    session_id: UUID = Field(foreign_key="session.id", nullable=False)
    role: MessageRole = Field(nullable=False)
    content: str = Field(nullable=False)
    tool_name: Optional[str] = Field(max_length=255, default=None)
    tool_input: Optional[dict] = Field(default_factory=dict, sa_type=JSON)
    tool_output: Optional[dict] = Field(default_factory=dict, sa_type=JSON)
    tokens_used: Optional[int] = Field(default=None)
    message_metadata: Optional[dict] = Field(default_factory=dict, sa_type=JSON)
    parent_message_id: Optional[UUID] = Field(foreign_key="sessionmessage.id", default=None)
    sequence_number: int = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SessionMessageCreate(SQLModel):
    session_id: UUID
    role: MessageRole
    content: str
    tool_name: Optional[str] = None
    tool_input: Optional[dict] = None
    tool_output: Optional[dict] = None
    tokens_used: Optional[int] = None
    message_metadata: Optional[dict] = None
    parent_message_id: Optional[UUID] = None
    sequence_number: int

class SessionMessageRead(SQLModel):
    id: UUID
    session_id: UUID
    role: MessageRole
    content: str
    tool_name: Optional[str]
    tool_input: Optional[dict]
    tool_output: Optional[dict]
    tokens_used: Optional[int]
    message_metadata: Optional[dict]
    parent_message_id: Optional[UUID]
    sequence_number: int
    created_at: datetime 