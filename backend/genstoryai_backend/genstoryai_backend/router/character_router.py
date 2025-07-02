from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from genstoryai_backend.database.db import get_session
from genstoryai_backend.models.character import CharacterCreate,CharacterRead,CharacterUpdate
from genstoryai_backend.database.crud.character_crud import create_character, get_character, get_characters, update_character, delete_character
from genstoryai_backend.agent.character_agent import character_agent

router = APIRouter(
    prefix="/character",
    tags=["character"],
    responses={404: {"description": "Not found"}},
)

@router.post("/generate/",response_model=CharacterCreate)
async def generate_character_endpoint(user_prompt: str = None):
    """generate character by user_prompt"""
    return character_agent.run(user_prompt)

@router.post("/create/",response_model=CharacterCreate)
async def create_character_endpoint(character: CharacterCreate, db: Session = Depends(get_session)):
    """create character by character"""
    return create_character(db, character)

@router.get("/{character_id}", response_model=CharacterRead)
async def read_character_endpoint(character_id: int, db: Session = Depends(get_session)):
    """get character by id"""
    db_character = get_character(db, character_id=character_id)
    if db_character is None:
        raise HTTPException(status_code=404, detail="Character not found")
    return db_character
    
@router.get("/", response_model=List[CharacterRead])
async def read_characters_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_session)):
    """get characters by skip and limit"""
    characters = get_characters(db, skip=skip, limit=limit)
    return characters

@router.put("/{character_id}", response_model=CharacterRead)
async def update_character_endpoint(character_id: int, character: CharacterUpdate, db: Session = Depends(get_session)):
    """update character by character_id and character"""
    db_character = update_character(db, character_id=character_id, character=character)
    if db_character is None:
        raise HTTPException(status_code=404, detail="Character not found")
    return db_character


