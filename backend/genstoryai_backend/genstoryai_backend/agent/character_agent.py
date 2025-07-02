import os
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
from pydantic_ai.providers.openai import OpenAIProvider
import dotenv
import asyncio



from genstoryai_backend.models.character import CharacterCreate
from genstoryai_backend.utils.i18n import trans 

dotenv.load_dotenv()

# model_provider
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL")
OPENAI_MODEL = os.getenv("OPENAI_MODEL")

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
    system_prompt=trans("You are a helpful assistant that can help with character creation."),
)


async def generate_character(user_prompt: str) -> CharacterCreate:
    """generate character by user_prompt"""
    result = await character_agent.run(user_prompt)
    if hasattr(result, 'output'):
        return result.output
    return result