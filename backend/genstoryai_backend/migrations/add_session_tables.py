"""
数据库迁移脚本：添加会话管理相关表
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlmodel import SQLModel, create_engine, Session, select
from genstoryai_backend.database.db import engine
from genstoryai_backend.models.session import Session as SessionModel, SessionMessage, Tool, ToolUsage
from genstoryai_backend.models.user import User
from genstoryai_backend.models.story import Story
from genstoryai_backend.models.character import Character
from genstoryai_backend.models.character_event import CharacterEvent
from genstoryai_backend.models.character_relationship import CharacterRelationship
from genstoryai_backend.models.event import Event
from genstoryai_backend.models.timeline import Timeline
from genstoryai_backend.models.location import Location


def create_session_tables():
    """创建会话相关的表"""
    print("开始创建会话相关表...")
    
    # 创建所有表
    SQLModel.metadata.create_all(engine)
    
    print("会话相关表创建完成！")


def init_default_tools():
    """初始化默认工具"""
    print("开始初始化默认工具...")
    
    with Session(engine) as session:
        # 检查是否已有工具
        existing_tools = session.exec(select(Tool)).all()
        if existing_tools:
            print("工具已存在，跳过初始化")
            return
        
        # 创建默认工具
        default_tools = [
            Tool(
                name="generate_outline",
                description="生成故事大纲",
                version="1.0.0",
                is_active=True
            ),
            Tool(
                name="generate_content",
                description="生成故事内容",
                version="1.0.0",
                is_active=True
            ),
            Tool(
                name="generate_character",
                description="生成角色",
                version="1.0.0",
                is_active=True
            ),
            Tool(
                name="generate_map",
                description="生成地图",
                version="1.0.0",
                is_active=True
            )
        ]
        
        for tool in default_tools:
            session.add(tool)
        
        session.commit()
        print("默认工具初始化完成！")


def main():
    """主函数"""
    print("=== 数据库迁移：添加会话管理表 ===")
    
    try:
        # 创建表
        create_session_tables()
        
        # 初始化默认工具
        init_default_tools()
        
        print("迁移完成！")
        
    except Exception as e:
        print(f"迁移失败：{e}")
        raise


if __name__ == "__main__":
    main() 