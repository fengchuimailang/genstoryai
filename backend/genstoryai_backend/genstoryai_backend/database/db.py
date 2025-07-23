from typing import Generator
from sqlmodel import SQLModel, create_engine, Session,select
from datetime import datetime
from genstoryai_backend.models.user import User
from genstoryai_backend.models.story import Story, StoryCreate
from genstoryai_backend.database.crud.user_crud import get_password_hash
from genstoryai_backend.database.crud.story_crud import create_story
from genstoryai_backend.models.character import Character
from genstoryai_backend.models.character_event import CharacterEvent
from genstoryai_backend.models.character_relationship import CharacterRelationship
from genstoryai_backend.models.event import Event
from genstoryai_backend.models.timeline import Timeline
from genstoryai_backend.models.enum.genre import Genre
from genstoryai_backend.models.enum.gender import Gender
from genstoryai_backend.models.enum.mbti import MBTI
from genstoryai_backend.models.enum.language import Language
from genstoryai_backend.models.enum.location_type import LocationType
from genstoryai_backend.models.location import Location
# 导入新的会话相关模型
from genstoryai_backend.models.session import Session as SessionModel, SessionMessage, Tool, ToolUsage

# 创建 SQLite 数据库引擎
SQLALCHEMY_DATABASE_URL = "sqlite:///./genstoryai.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

def create_db_and_tables():
    """Creates all SQLModel tables in the database."""
    SQLModel.metadata.create_all(engine)

def init_db_with_default_data():
    """Initializes the database with default data."""
    with Session(engine) as session:
        # 默认用户
        user = session.exec(select(User).where(User.username == "admin")).first()
        if not user:
            user = User(username="admin", email="admin@example.com", password=get_password_hash("admin"),is_active=True,is_verified=True)
            session.add(user)
            session.commit()
        # 默认故事
        story = session.exec(select(Story).where(Story.title == "擒虎英雄")).first()
        if not story:
            storyCreate = StoryCreate(
                title="擒虎英雄", 
                creator_user_id=user.id, 
                genre=Genre.ADVENTURE, 
                ssf=None, 
                author=None, 
                summary=None, 
                outline=None, 
                version_text=None, 
                story_template_id=None, 
                language=Language.zh
            )
            story = create_story(session, storyCreate)
        # 默认时间线
        timeline = session.exec(select(Timeline).where(Timeline.story_id == story.id)).first()
        if not timeline:
            timeline = Timeline(
                story_id=story.id,
                name="擒虎英雄时间线",
                description="李元霸擒虎故事的主要时间线",
                start_time=datetime.now(),
                end_time=None
            )
            session.add(timeline)
            session.commit()
        
        # 默认地点
        chang_an = session.exec(select(Location).where(Location.name == "长安城")).first()
        if not chang_an:
            chang_an = Location(
                name="长安城",
                story_id=story.id,
                description="唐朝的都城，繁华的国际化大都市，是政治、经济、文化中心",
                location_type=LocationType.CAPITAL,
                x=0.0,
                y=0.0
            )
            session.add(chang_an)
            session.commit()
        
        # 默认角色
        character = session.exec(select(Character).where(Character.name == "李元霸")).first()
        if not character:
            character = Character(
                name="李元霸", 
                story_id=story.id,
                is_main=True, 
                gender=Gender.MALE, 
                age=20, 
                mbti=MBTI.ISTJ, 
                personality="稳重、有责任感、有组织能力", 
                backstory="李元霸是唐朝的一位将军，他勇猛无比，力大无穷，是唐朝的护国将军。", appearance="李元霸身材高大，肌肉发达，面容英俊，有一双炯炯有神的眼睛。", character_arc="李元霸是一个忠诚的将军，他的一生都在为唐朝的和平而战。", personality_quirks="李元霸是一个非常忠诚的人，他的一生都在为唐朝的和平而战。", description="李元霸是唐朝的一位将军，他勇猛无比，力大无穷，是唐朝的护国将军。")
            session.add(character)
            session.commit()

def get_db() -> Generator[Session, None, None]: 
    """Dependency to get a database session."""
    with Session(engine) as session:
        yield session
