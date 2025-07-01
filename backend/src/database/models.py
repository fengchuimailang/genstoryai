from sqlalchemy import Column, Integer, String
from .db import Base


class Character(Base):
    __tablename__ = "characters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, default="")
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)