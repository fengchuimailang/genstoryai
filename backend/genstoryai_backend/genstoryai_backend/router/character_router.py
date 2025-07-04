from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session

from genstoryai_backend.database.db import get_session
from genstoryai_backend.models.character import CharacterCreate,CharacterRead,CharacterUpdate
from genstoryai_backend.database.crud.character_crud import create_character, get_character, get_characters, update_character, delete_character
from genstoryai_backend.agent.character_agent import generate_character

character_router = APIRouter(
    prefix="/character",
    tags=["character/角色"],
    responses={404: {"description": "Not found"}},
)

@character_router.post("/generate/",response_model=CharacterCreate)
async def generate_character_endpoint(user_prompt: str = Query(None)):
    """generate character by user_prompt"""
    return await generate_character(user_prompt)

@character_router.post("/create/",response_model=CharacterCreate)
async def create_character_endpoint(character: CharacterCreate, db: Session = Depends(get_session)):
    """create character by character"""
    return create_character(db, character)

@character_router.get("/{character_id}", response_model=CharacterRead)
async def read_character_endpoint(character_id: int, db: Session = Depends(get_session)):
    """get character by id"""
    db_character = get_character(db, character_id=character_id)
    if db_character is None:
        raise HTTPException(status_code=404, detail="Character not found")
    return db_character
    
@character_router.get("/", response_model=List[CharacterRead])
async def read_characters_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_session)):
    """get characters by skip and limit"""
    characters = get_characters(db, skip=skip, limit=limit)
    return characters

@character_router.put("/{character_id}", response_model=CharacterRead)
async def update_character_endpoint(character_id: int, character: CharacterUpdate, db: Session = Depends(get_session)):
    """update character by character_id and character"""
    db_character = update_character(db, character_id=character_id, character=character)
    if db_character is None:
        raise HTTPException(status_code=404, detail="Character not found")
    return db_character

@character_router.delete("/{character_id}")
async def delete_character_endpoint(character_id: int, db: Session = Depends(get_session)):
    """delete character by character_id"""
    if delete_character(db, character_id=character_id) is None:
        raise HTTPException(status_code=404, detail="Character not found")
    return {"message": "Character deleted"}

