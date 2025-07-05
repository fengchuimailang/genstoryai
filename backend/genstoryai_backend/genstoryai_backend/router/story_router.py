from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List

from ..database.db import get_db
from ..models.story import Story, StoryCreate, StoryRead, StoryUpdate
from ..database.crud import create_story, get_story, get_stories, update_story, delete_story


story_router = APIRouter(
    prefix="/story",
    tags=["story/故事"],
    responses={404: {"description": "Not found"}},
)

@story_router.post("/stories/", response_model=StoryCreate)
def create_story_endpoint(story: StoryCreate, db: Session = Depends(get_db)):
    """创建新故事"""
    return create_story(db, story)

@story_router.get("/stories/", response_model=List[StoryRead])
def get_stories_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """获取故事列表"""
    return get_stories(db, skip=skip, limit=limit)

@story_router.get("/stories/{story_id}", response_model=StoryRead)
def get_story_endpoint(story_id: int, db: Session = Depends(get_db)):
    """获取单个故事详情"""
    return get_story(db, story_id)

@story_router.put("/stories/{story_id}", response_model=StoryRead)
def update_story_endpoint(story_id: int, story: StoryUpdate, db: Session = Depends(get_db)):
    """更新故事信息"""
    return update_story(db, story_id, story)

@story_router.delete("/stories/{story_id}")
def delete_story_endpoint(story_id: int, db: Session = Depends(get_db)):
    """删除故事"""
    delete_story(db, story_id)
    return {"message": "Story deleted successfully"}
