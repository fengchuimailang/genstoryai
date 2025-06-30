from pydantic import BaseModel

class CharacterCreateRequest(BaseModel):
    name: str
    description: str = ""
    age: int = None
    gender: str = None

class CharacterResponse(BaseModel):
    id: int
    name: str
    description: str = ""
    age: int = None
    gender: str = None 