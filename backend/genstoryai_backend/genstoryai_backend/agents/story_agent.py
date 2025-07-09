from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
from pydantic_ai.providers.openai import OpenAIProvider
from ..models.story import StoryOutline
from ..config import settings
from ..models.story import Story
from .prompt_templete import OUTLINE_PROMPT

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
story_agent = Agent(
    model,
    output_type=StoryOutline,
    system_prompt="You are a helpful assistant that can help with story outline creation.",
)

async def generate_story_outline(story: Story, outline_level: int = 1) -> StoryOutline | None:
    """generate story outline by information in database"""
    assert outline_level in [1, 2], "Outline level must be 1 or 2"
    user_prompt = OUTLINE_PROMPT.format(story.title, story.genre, story.summary, outline_level)
    result = await story_agent.run(user_prompt)
    if hasattr(result, 'output'):
        return result.output
    return None