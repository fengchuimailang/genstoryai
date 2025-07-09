from typing import List, Optional
from fastapi import HTTPException, status
from sqlmodel import Session, select
from genstoryai_backend.models.story import Story, StoryCreate, StoryUpdate


def create_story(db: Session, story: StoryCreate) -> Story:
    db_story = Story(**story.model_dump(exclude_unset=True))
    db.add(db_story)
    db.commit()
    db.refresh(db_story)
    return db_story


def get_story(db: Session, story_id: int) -> Story:
    db_story = db.exec(select(Story).where(Story.id == story_id)).first()
    if db_story is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Story not found")
    return db_story


def get_stories(db: Session, skip: int = 0, limit: int = 100) -> List[Story]:
    return list(db.exec(select(Story).offset(skip).limit(limit)).all())


def update_story(db: Session, story_id: int, story: StoryUpdate) -> Story:
    db_story = db.exec(select(Story).where(Story.id == story_id)).first()
    if db_story is None:
        raise HTTPException(status_code=404, detail="Story not found")
    
    update_data = story.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_story, key, value)
    
    db.add(db_story)
    db.commit()
    db.refresh(db_story)
    return db_story


def delete_story(db: Session, story_id: int):
    db_story = db.exec(select(Story).where(Story.id == story_id)).first()
    if db_story is None:
        raise HTTPException(status_code=404, detail="Story not found")
    db.delete(db_story)
    db.commit()
