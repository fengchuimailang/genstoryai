from pydantic import BaseModel


class StoryOutlineRequest(BaseModel):
    story_id: int
    outline_level: int