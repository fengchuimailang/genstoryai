from typing import Generator
from sqlmodel import SQLModel, create_engine, Session

# 创建 SQLite 数据库引擎
SQLALCHEMY_DATABASE_URL = "sqlite:///./genstoryai.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

def create_db_and_tables():
    """Creates all SQLModel tables in the database."""
    SQLModel.metadata.create_all(engine)


def get_db() -> Generator[Session, None, None]: 
    """Dependency to get a database session."""
    with Session(engine) as session:
        yield session
