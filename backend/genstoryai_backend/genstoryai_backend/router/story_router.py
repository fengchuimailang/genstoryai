from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List

from ..database.db import get_db
from ..models.story import Story, StoryCreate, StoryRead, StoryUpdate, StoryOutline
from ..database.crud import create_story, get_story, get_stories, update_story, delete_story
from ..agents.story_agent import generate_story_outline
from ..database.crud.character_crud import get_characters_by_story_id
from ..models.character import CharacterRead


story_router = APIRouter(
    prefix="/story",
    tags=["story/故事"],
    responses={404: {"description": "Not found"}},
)

@story_router.post("/create/", response_model=Story)
def create_story_endpoint(story: StoryCreate, db: Session = Depends(get_db)):
    """创建新故事"""
    return create_story(db, story)

@story_router.get("/", response_model=List[StoryRead])
def get_stories_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """获取故事列表"""
    return get_stories(db, skip=skip, limit=limit)

@story_router.get("/{story_id}", response_model=StoryRead)
def get_story_endpoint(story_id: int, db: Session = Depends(get_db)):
    """获取单个故事详情"""
    story = get_story(db, story_id)
    if story is None:
        raise HTTPException(status_code=404, detail="Story not found")
    return StoryRead.model_validate(story)

@story_router.put("/{story_id}", response_model=StoryRead)
def update_story_endpoint(story_id: int, storyUpdate: StoryUpdate, db: Session = Depends(get_db)):
    """更新故事信息"""
    story = update_story(db, story_id, storyUpdate)
    if story is None:
        raise HTTPException(status_code=404, detail="Story not found")
    return StoryRead.model_validate(story)

@story_router.delete("/{story_id}")
def delete_story_endpoint(story_id: int, db: Session = Depends(get_db)):
    """删除故事"""
    delete_story(db, story_id)
    return {"message": "Story deleted successfully"}


@story_router.post("/generate_outline/", response_model=StoryOutline)
async def create_story_outline_endpoint(story_id: int, outline_level: int, db: Session = Depends(get_db)):
    """创建故事大纲"""
    story = get_story(db, story_id)
    if story is None:
        raise HTTPException(status_code=404, detail="Story not found")
    characters = get_characters_by_story_id(db, story_id)
    characterReads = [CharacterRead.model_validate(character) for character in characters]
    outline = await generate_story_outline(story, characterReads, outline_level)
    return outline
