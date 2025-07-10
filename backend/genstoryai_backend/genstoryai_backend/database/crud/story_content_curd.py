from typing import List, Optional
from fastapi import HTTPException, status
from sqlmodel import Session, select
from genstoryai_backend.models.story_content import StoryContent, StoryContentCreate, StoryContentUpdate


def create_story_content(db: Session, story_content: StoryContentCreate) -> StoryContent:
    db_story_content = StoryContent.model_validate(story_content)
    db.add(db_story_content)
    db.commit()
    db.refresh(db_story_content)
    return db_story_content


def get_story_content(db: Session, story_content_id: int) -> Optional[StoryContent]:
    db_story_content = db.exec(select(StoryContent).where(StoryContent.id == story_content_id)).first()
    if db_story_content is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Story content not found")
    return db_story_content


def get_story_contents(db: Session, skip: int = 0, limit: int = 100) -> List[StoryContent]:
    story_contents = db.exec(select(StoryContent).offset(skip).limit(limit)).all()
    return list(story_contents)


def update_story_content(db: Session, story_content_id: int, story_content: StoryContentUpdate) -> Optional[StoryContent]:
    db_story_content = db.exec(select(StoryContent).where(StoryContent.id == story_content_id)).first()
    if db_story_content is None:
        raise HTTPException(status_code=404, detail="Story content not found")
    
    update_data = story_content.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_story_content, key, value)
    
    db.add(db_story_content)
    db.commit()
    db.refresh(db_story_content)
    return db_story_content


def delete_story_content(db: Session, story_content_id: int) -> Optional[StoryContent]:
    db_story_content = db.exec(select(StoryContent).where(StoryContent.id == story_content_id)).first()
    if db_story_content is None:
        raise HTTPException(status_code=404, detail="Story content not found")
    db.delete(db_story_content)
    db.commit()
    return db_story_content
