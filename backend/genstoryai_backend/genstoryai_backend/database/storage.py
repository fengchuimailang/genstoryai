"""
存储管理器 - 提供统一的数据访问接口
支持会话、消息、工具、工具使用记录的CRUD操作
"""
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime, timedelta
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select, update
from genstoryai_backend.models.session import Session, SessionCreate, SessionRead, SessionStatus
from genstoryai_backend.models.session_message import SessionMessage, SessionMessageCreate, SessionMessageRead, MessageRole
from genstoryai_backend.models.session import Tool, ToolUsage, ToolCreate, ToolRead, ToolUsageCreate, ToolUsageRead
import logging

logger = logging.getLogger(__name__)


class StorageManager:
    """存储管理器 - 统一管理数据库操作"""
    
    def __init__(self, db_session: AsyncSession):
        self.db = db_session
    
    # ==================== 会话管理 ====================
    
    async def create_session(self, user_id: str, title: Optional[str] = None, 
                           session_metadata: Optional[dict] = None) -> Optional[Session]:
        """创建新会话"""
        try:
            session = Session(
                user_id=user_id,
                title=title,
                session_metadata=session_metadata or {}
            )
            self.db.add(session)
            await self.db.commit()
            await self.db.refresh(session)
            logger.info(f"创建会话成功: {session.id}")
            return session
        except Exception as e:
            logger.error(f"创建会话失败: {e}")
            await self.db.rollback()
            return None
    
    async def get_session(self, session_id: UUID) -> Optional[Session]:
        """获取会话信息"""
        try:
            result = await self.db.exec(
                select(Session).where(Session.id == session_id)
            )
            return result.first()
        except Exception as e:
            logger.error(f"获取会话失败: {e}")
            return None
    
    async def get_user_sessions(self, user_id: str, limit: int = 50, 
                               offset: int = 0) -> List[Session]:
        """获取用户的所有会话"""
        try:
            result = await self.db.exec(
                select(Session)
                .where(Session.user_id == user_id)
                .order_by(Session.updated_at.desc())
                .offset(offset)
                .limit(limit)
            )
            return result.all()
        except Exception as e:
            logger.error(f"获取用户会话失败: {e}")
            return []
    
    async def update_session(self, session_id: UUID, **kwargs) -> Optional[Session]:
        """更新会话信息"""
        try:
            # 更新updated_at时间
            kwargs['updated_at'] = datetime.utcnow()
            
            result = await self.db.exec(
                update(Session)
                .where(Session.id == session_id)
                .values(**kwargs)
            )
            await self.db.commit()
            
            # 返回更新后的会话
            return await self.get_session(session_id)
        except Exception as e:
            logger.error(f"更新会话失败: {e}")
            await self.db.rollback()
            return None
    
    async def close_session(self, session_id: UUID) -> bool:
        """关闭会话"""
        try:
            result = await self.db.exec(
                update(Session)
                .where(Session.id == session_id)
                .values(status=SessionStatus.CLOSED, updated_at=datetime.utcnow())
            )
            await self.db.commit()
            logger.info(f"关闭会话成功: {session_id}")
            return True
        except Exception as e:
            logger.error(f"关闭会话失败: {e}")
            await self.db.rollback()
            return False
    
    # ==================== 消息管理 ====================
    
    async def add_message(self, message_data: SessionMessageCreate) -> Optional[SessionMessage]:
        """添加消息到会话"""
        try:
            message = SessionMessage(**message_data.model_dump())
            self.db.add(message)
            await self.db.commit()
            await self.db.refresh(message)
            logger.info(f"添加消息成功: {message.id}")
            return message
        except Exception as e:
            logger.error(f"添加消息失败: {e}")
            await self.db.rollback()
            return None
    
    async def get_session_messages(self, session_id: UUID, limit: int = 50, 
                                  offset: int = 0) -> List[SessionMessage]:
        """获取会话的消息历史"""
        try:
            result = await self.db.exec(
                select(SessionMessage)
                .where(SessionMessage.session_id == session_id)
                .order_by(SessionMessage.sequence_number)
                .offset(offset)
                .limit(limit)
            )
            return result.all()
        except Exception as e:
            logger.error(f"获取会话消息失败: {e}")
            return []
    
    async def get_next_sequence_number(self, session_id: UUID) -> int:
        """获取会话的下一个序列号"""
        try:
            result = await self.db.exec(
                select(SessionMessage.sequence_number)
                .where(SessionMessage.session_id == session_id)
                .order_by(SessionMessage.sequence_number.desc())
                .limit(1)
            )
            last_sequence = result.first()
            return (last_sequence or 0) + 1
        except Exception as e:
            logger.error(f"获取序列号失败: {e}")
            return 1
    
    async def add_user_message(self, session_id: UUID, content: str, 
                              metadata: Optional[dict] = None) -> Optional[SessionMessage]:
        """添加用户消息"""
        sequence_number = await self.get_next_sequence_number(session_id)
        message_data = SessionMessageCreate(
            session_id=session_id,
            role=MessageRole.USER,
            content=content,
            sequence_number=sequence_number,
            message_metadata=metadata or {}
        )
        return await self.add_message(message_data)
    
    async def add_agent_message(self, session_id: UUID, content: str, 
                               tool_calls: Optional[List[Dict]] = None,
                               metadata: Optional[dict] = None) -> Optional[SessionMessage]:
        """添加Agent消息"""
        sequence_number = await self.get_next_sequence_number(session_id)
        message_data = SessionMessageCreate(
            session_id=session_id,
            role=MessageRole.AGENT,
            content=content,
            tool_input=tool_calls,
            sequence_number=sequence_number,
            message_metadata=metadata or {}
        )
        return await self.add_message(message_data)
    
    async def add_tool_call_message(self, session_id: UUID, tool_name: str, 
                                   tool_input: dict, metadata: Optional[dict] = None) -> Optional[SessionMessage]:
        """添加工具调用消息"""
        sequence_number = await self.get_next_sequence_number(session_id)
        message_data = SessionMessageCreate(
            session_id=session_id,
            role=MessageRole.TOOL_CALL,
            content=f"调用工具: {tool_name}",
            tool_name=tool_name,
            tool_input=tool_input,
            sequence_number=sequence_number,
            message_metadata=metadata or {}
        )
        return await self.add_message(message_data)
    
    async def add_tool_output_message(self, session_id: UUID, tool_name: str, 
                                     tool_output: dict, metadata: Optional[dict] = None) -> Optional[SessionMessage]:
        """添加工具输出消息"""
        sequence_number = await self.get_next_sequence_number(session_id)
        message_data = SessionMessageCreate(
            session_id=session_id,
            role=MessageRole.TOOL_OUTPUT,
            content=f"工具 {tool_name} 执行完成",
            tool_name=tool_name,
            tool_output=tool_output,
            sequence_number=sequence_number,
            message_metadata=metadata or {}
        )
        return await self.add_message(message_data)
    
    # ==================== 工具管理 ====================
    
    async def get_tool_by_name(self, name: str) -> Optional[Tool]:
        """根据名称获取工具"""
        try:
            result = await self.db.exec(
                select(Tool).where(Tool.name == name, Tool.is_active == True)
            )
            return result.first()
        except Exception as e:
            logger.error(f"获取工具失败: {e}")
            return None
    
    async def get_all_tools(self) -> List[Tool]:
        """获取所有活跃的工具"""
        try:
            result = await self.db.exec(
                select(Tool).where(Tool.is_active == True)
            )
            return result.all()
        except Exception as e:
            logger.error(f"获取所有工具失败: {e}")
            return []
    
    async def create_tool(self, tool_data: ToolCreate) -> Optional[Tool]:
        """创建新工具"""
        try:
            tool = Tool(**tool_data.model_dump())
            self.db.add(tool)
            await self.db.commit()
            await self.db.refresh(tool)
            logger.info(f"创建工具成功: {tool.id}")
            return tool
        except Exception as e:
            logger.error(f"创建工具失败: {e}")
            await self.db.rollback()
            return None
    
    # ==================== 工具使用统计 ====================
    
    async def add_tool_usage(self, usage_data: ToolUsageCreate) -> Optional[ToolUsage]:
        """添加工具使用记录"""
        try:
            usage = ToolUsage(**usage_data.model_dump())
            self.db.add(usage)
            await self.db.commit()
            await self.db.refresh(usage)
            logger.info(f"添加工具使用记录成功: {usage.id}")
            return usage
        except Exception as e:
            logger.error(f"添加工具使用记录失败: {e}")
            await self.db.rollback()
            return None
    
    async def record_tool_usage(self, session_id: UUID, tool_id: UUID, message_id: UUID,
                               execution_time_ms: Optional[int] = None, 
                               success: bool = True, error_message: Optional[str] = None) -> Optional[ToolUsage]:
        """记录工具使用"""
        usage_data = ToolUsageCreate(
            session_id=session_id,
            tool_id=tool_id,
            message_id=message_id,
            execution_time_ms=execution_time_ms,
            success=success,
            error_message=error_message
        )
        return await self.add_tool_usage(usage_data)
    
    async def get_session_tool_usage(self, session_id: UUID) -> List[ToolUsage]:
        """获取会话的工具使用记录"""
        try:
            result = await self.db.exec(
                select(ToolUsage)
                .where(ToolUsage.session_id == session_id)
                .order_by(ToolUsage.created_at.desc())
            )
            return result.all()
        except Exception as e:
            logger.error(f"获取会话工具使用记录失败: {e}")
            return []
    
    # ==================== 统计和查询 ====================
    
    async def get_session_stats(self, session_id: UUID) -> Dict[str, Any]:
        """获取会话统计信息"""
        try:
            # 获取消息数量
            messages_result = await self.db.exec(
                select(SessionMessage).where(SessionMessage.session_id == session_id)
            )
            message_count = len(messages_result.all())
            
            # 获取工具使用次数
            usage_result = await self.db.exec(
                select(ToolUsage).where(ToolUsage.session_id == session_id)
            )
            tool_usage_count = len(usage_result.all())
            
            # 获取会话信息
            session = await self.get_session(session_id)
            
            return {
                "session_id": session_id,
                "message_count": message_count,
                "tool_usage_count": tool_usage_count,
                "session": session
            }
        except Exception as e:
            logger.error(f"获取会话统计失败: {e}")
            return {}
    
    async def cleanup_old_sessions(self, days: int = 30) -> int:
        """清理旧会话（可选功能）"""
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            result = await self.db.exec(
                update(Session)
                .where(Session.updated_at < cutoff_date, Session.status == SessionStatus.CLOSED)
                .values(status=SessionStatus.ARCHIVED)
            )
            await self.db.commit()
            logger.info(f"清理了 {result.rowcount} 个旧会话")
            return result.rowcount
        except Exception as e:
            logger.error(f"清理旧会话失败: {e}")
            await self.db.rollback()
            return 0 