from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
from pydantic_ai.providers.openai import OpenAIProvider
from genstoryai_backend.models.character import CharacterCreate
from genstoryai_backend.models.story import Story
from .prompt_templete import CHARACTER_CREATION_PROMPT
from genstoryai_backend.config import settings


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
character_agent = Agent(
    model,
    output_type=CharacterCreate,
    system_prompt="You are an expert character designer and development specialist. You excel at creating compelling, well-rounded characters with distinct personalities, motivations, and arcs. You understand character psychology, development techniques, and how to create memorable characters that drive story progression.",
)


async def generate_character(user_prompt: str,story: Story) -> CharacterCreate | None:
    """generate character by user_prompt"""
    # Use the template to structure the prompt
    formatted_prompt = CHARACTER_CREATION_PROMPT.format(user_prompt,story.title,story.genre,story.summary,story.language)
    result = await character_agent.run(formatted_prompt)
    if hasattr(result, 'output'):
        return result.output
    return None