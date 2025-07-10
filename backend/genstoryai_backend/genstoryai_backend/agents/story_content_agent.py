from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
from pydantic_ai.providers.openai import OpenAIProvider
from genstoryai_backend.models.character import CharacterRead
from genstoryai_backend.models.story_content import StoryContentCreate
from genstoryai_backend.models.story import Story
from .prompt_templete import STORY_CONTENT_PROMPT
from genstoryai_backend.config import settings
from typing import List
import json

# model_provider
OPENAI_API_KEY = settings.OPENAI_API_KEY
OPENAI_BASE_URL = settings.OPENAI_BASE_URL
OPENAI_MODEL = settings.OPENAI_MODEL

if OPENAI_API_KEY is None:
    raise ValueError("OPENAI_API_KEY is not set, please set it and try again.")
if OPENAI_BASE_URL is None:
    raise ValueError("OPENAI_BASE_URL is not set, please set it and try again.")
if OPENAI_MODEL is None:
    raise ValueError("OPENAI_MODEL is not set, please set it and try again.")

# agent
provider = OpenAIProvider(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
model = OpenAIModel(model_name=OPENAI_MODEL, provider=provider)
story_content_agent = Agent(
    model,
    output_type=StoryContentCreate,
    system_prompt="You are an expert creative writer specializing in story content generation. You excel at creating engaging, well-structured narrative content that follows story outlines and maintains consistency with established themes, characters, and plot elements. You understand various literary genres and can adapt your writing style accordingly.",
)

async def generate_story_content(story: Story, characterReads: List[CharacterRead],outline_title: str) -> StoryContentCreate | None:
    """generate story content by information in database"""
    # Convert genre object to string if it exists
    genre_str = story.genre.name if story.genre else "Unknown"

    characters_data = [character.model_dump(exclude_unset=True) for character in characterReads]
    characters_json = json.dumps(characters_data, ensure_ascii=False, indent=2)

    user_prompt = STORY_CONTENT_PROMPT.format(
        story.title, 
        genre_str,
        story.summary or "", 
        story.outline or "", 
        outline_title,
        story.language,
        characters_json
    )
    result = await story_content_agent.run(user_prompt)
    if hasattr(result, 'output'):
        return result.output
    return None