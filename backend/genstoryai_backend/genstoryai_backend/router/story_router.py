from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import Story
from ..schemas import StoryCreate, StoryUpdate, StoryResponse

router = APIRouter()

@router.post("/stories/", response_model=StoryResponse)
def create_story(story: StoryCreate, db: Session = Depends(get_db)):
    """创建新故事"""
    db_story = Story(**story.dict())
    db.add(db_story)
    db.commit()
    db.refresh(db_story)
    return db_story

@router.get("/stories/", response_model=List[StoryResponse])
def get_stories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """获取故事列表"""
    stories = db.query(Story).offset(skip).limit(limit).all()
    return stories

@router.get("/stories/{story_id}", response_model=StoryResponse)
def get_story(story_id: int, db: Session = Depends(get_db)):
    """获取单个故事详情"""
    story = db.query(Story).filter(Story.id == story_id).first()
    if story is None:
        raise HTTPException(status_code=404, detail="Story not found")
    return story

@router.put("/stories/{story_id}", response_model=StoryResponse)
def update_story(story_id: int, story: StoryUpdate, db: Session = Depends(get_db)):
    """更新故事信息"""
    db_story = db.query(Story).filter(Story.id == story_id).first()
    if db_story is None:
        raise HTTPException(status_code=404, detail="Story not found")
    
    for key, value in story.dict(exclude_unset=True).items():
        setattr(db_story, key, value)
    
    db.commit()
    db.refresh(db_story)
    return db_story

@router.delete("/stories/{story_id}")
def delete_story(story_id: int, db: Session = Depends(get_db)):
    """删除故事"""
    db_story = db.query(Story).filter(Story.id == story_id).first()
    if db_story is None:
        raise HTTPException(status_code=404, detail="Story not found")
    
    db.delete(db_story)
    db.commit()
    return {"message": "Story deleted successfully"}
