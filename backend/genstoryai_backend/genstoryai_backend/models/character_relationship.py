from typing import Optional
from sqlmodel import SQLModel, Field
from genstoryai_backend.models.enum.relationship_type import RelationshipType


class CharacterRelationship(SQLModel, table=True):
    """角色关系表"""
    
    # 关系的主体和客体
    character_id: int = Field(foreign_key="character.id", primary_key=True)
    related_character_id: int = Field(foreign_key="character.id", primary_key=True)
    
    # 关系类型
    relationship_type: RelationshipType = Field(description="关系类型")
    
    # 关系描述
    description: Optional[str] = Field(description="关系描述", default=None)
    
    # 关系强度（1-10，1最弱，10最强）
    strength: Optional[int] = Field(description="关系强度", default=5) 