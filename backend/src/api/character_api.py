from fastapi import APIRouter
from models.character import CharacterCreateRequest, CharacterResponse

router = APIRouter()

# 用于存储角色的内存数据库
characters = []
character_id_counter = 1

@router.post("/character", response_model=CharacterResponse)
def create_character(character: CharacterCreateRequest):
    global character_id_counter
    new_character = {
        "id": character_id_counter,
        "name": character.name,
        "description": character.description,
        "age": character.age,
        "gender": character.gender
    }
    characters.append(new_character)
    character_id_counter += 1
    return new_character 