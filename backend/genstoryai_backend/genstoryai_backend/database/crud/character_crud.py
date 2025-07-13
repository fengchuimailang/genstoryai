from typing import List, Optional
from fastapi import HTTPException, status
from sqlmodel import Session, select
from genstoryai_backend.models.character import Character, CharacterCreate, CharacterUpdate


def create_character(db: Session, character: CharacterCreate) -> Character:
    # 使用 model_validate 创建 Character 对象
    db_character = Character.model_validate(character)
    db.add(db_character)
    db.commit()
    db.refresh(db_character)
    return db_character

def get_character(db: Session, character_id: int) -> Character:
    db_character = db.exec(select(Character).where(Character.id == character_id)).first()
    if db_character is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Character not found")
    return db_character

def get_characters(db: Session, skip: int = 0, limit: int = 100) -> List[Character]:
    characters = db.exec(select(Character).offset(skip).limit(limit)).all()
    return list(characters)

def get_characters_by_story_id(db: Session, story_id: int) -> List[Character]:
    characters = db.exec(select(Character).where(Character.story_id == story_id)).all()
    return list(characters)


def update_character(db: Session, character_id: int, character: CharacterUpdate) -> Character:
    db_character = db.exec(select(Character).where(Character.id == character_id)).first()
    if db_character is None:
        raise HTTPException(status_code=404, detail="Character not found")
    update_data = character.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_character, key, value)
    db.add(db_character)
    db.commit()
    db.refresh(db_character)
    return db_character

def delete_character(db: Session, character_id: int):
    db_character = db.exec(select(Character).where(Character.id == character_id)).first()
    if db_character is None:
        raise HTTPException(status_code=404, detail="Character not found")
    db.delete(db_character)
    db.commit()
