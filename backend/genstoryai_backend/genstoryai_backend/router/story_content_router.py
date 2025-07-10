from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session
from genstoryai_backend.database.crud.character_crud import get_characters_by_story_id
from genstoryai_backend.database.db import get_db
from genstoryai_backend.models.story_content import StoryContentCreate, StoryContentRead, StoryContentUpdate
from genstoryai_backend.database.crud import create_story_content, get_story_content, get_story_contents, update_story_content, delete_story_content
from genstoryai_backend.agents.story_content_agent import generate_story_content
from genstoryai_backend.database.crud.story_crud import get_story
from genstoryai_backend.models.character import CharacterRead

story_content_router = APIRouter(
    prefix="/story_content",
    tags=["story_content/故事内容"],
    responses={404: {"description": "Not found"}},
)

@story_content_router.post("/generate/{story_id}", response_model=StoryContentCreate)
async def generate_story_content_endpoint(story_id: int, outline_title: str = Query(...), db: Session = Depends(get_db)):
    """generate story content by AI"""
    story = get_story(db, story_id)
    if story is None:
        raise HTTPException(status_code=404, detail="Story not found")
    
    characters = get_characters_by_story_id(db, story_id)
    characterReads = [CharacterRead.model_validate(character) for character in characters]
    result = await generate_story_content(story,characterReads, outline_title)
    if result is None:
        raise HTTPException(status_code=500, detail="Failed to generate story content")
    return result

@story_content_router.post("/create/", response_model=StoryContentRead)
async def create_story_content_endpoint(story_content: StoryContentCreate, db: Session = Depends(get_db)):
    """create story content manually"""
    return create_story_content(db, story_content)

@story_content_router.get("/{story_content_id}", response_model=StoryContentRead)
async def read_story_content_endpoint(story_content_id: int, db: Session = Depends(get_db)):
    """get story content by id"""
    db_story_content = get_story_content(db, story_content_id)
    if db_story_content is None:
        raise HTTPException(status_code=404, detail="Story content not found")
    return db_story_content

@story_content_router.get("/", response_model=List[StoryContentRead])
async def read_story_contents_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """get story contents list"""
    story_contents = get_story_contents(db, skip=skip, limit=limit)
    return story_contents

@story_content_router.get("/story/{story_id}", response_model=List[StoryContentRead])
async def read_story_contents_by_story_endpoint(story_id: int, db: Session = Depends(get_db)):
    """get story contents by story id"""
    story_contents = get_story_contents(db, skip=0, limit=1000)  # 获取所有内容
    # 过滤出属于指定故事的内容
    filtered_contents = [content for content in story_contents if content.story_id == story_id]
    return filtered_contents

@story_content_router.put("/{story_content_id}", response_model=StoryContentRead)
async def update_story_content_endpoint(story_content_id: int, story_content: StoryContentUpdate, db: Session = Depends(get_db)):
    """update story content"""
    db_story_content = update_story_content(db, story_content_id, story_content)
    if db_story_content is None:
        raise HTTPException(status_code=404, detail="Story content not found")
    return db_story_content

@story_content_router.delete("/{story_content_id}")
async def delete_story_content_endpoint(story_content_id: int, db: Session = Depends(get_db)):
    """delete story content"""
    if delete_story_content(db, story_content_id) is None:
        raise HTTPException(status_code=404, detail="Story content not found")
    return {"message": "Story content deleted"}





