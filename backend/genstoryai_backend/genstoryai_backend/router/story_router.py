from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database.db import get_session
from ..models.story import Story, StoryCreate, StoryRead, StoryUpdate


story_router = APIRouter(
    prefix="/story",
    tags=["story/故事"],
    responses={404: {"description": "Not found"}},
)

@story_router.post("/stories/", response_model=StoryCreate)
def create_story(story: StoryCreate, db: Session = Depends(get_session)):
    """创建新故事"""
    db_story = Story(**story.dict())
    db.add(db_story)
    db.commit()
    db.refresh(db_story)
    return db_story

@story_router.get("/stories/", response_model=List[StoryRead])
def get_stories(skip: int = 0, limit: int = 100, db: Session = Depends(get_session)):
    """获取故事列表"""
    stories = db.query(Story).offset(skip).limit(limit).all()
    return stories

@story_router.get("/stories/{story_id}", response_model=StoryRead)
def get_story(story_id: int, db: Session = Depends(get_session)):
    """获取单个故事详情"""
    story = db.query(Story).filter(Story.id == story_id).first()
    if story is None:
        raise HTTPException(status_code=404, detail="Story not found")
    return story

@story_router.put("/stories/{story_id}", response_model=StoryRead)
def update_story(story_id: int, story: StoryUpdate, db: Session = Depends(get_session)):
    """更新故事信息"""
    db_story = db.query(Story).filter(Story.id == story_id).first()
    if db_story is None:
        raise HTTPException(status_code=404, detail="Story not found")
    
    for key, value in story.dict(exclude_unset=True).items():
        setattr(db_story, key, value)
    
    db.commit()
    db.refresh(db_story)
    return db_story

@story_router.delete("/stories/{story_id}")
def delete_story(story_id: int, db: Session = Depends(get_session)):
    """删除故事"""
    db_story = db.query(Story).filter(Story.id == story_id).first()
    if db_story is None:
        raise HTTPException(status_code=404, detail="Story not found")
    
    db.delete(db_story)
    db.commit()
    return {"message": "Story deleted successfully"}
