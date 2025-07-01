from pprint import pprint
from pydantic import BaseModel, Field
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
from pydantic_ai.providers.openai import OpenAIProvider
import asyncio
import dotenv
import os

from utils.i18n import trans 
# from langfuse import get_client

dotenv.load_dotenv()

# langfuse client


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

# output_type
class Character(BaseModel):
    character_name:str = Field(description="The name of the character", default="")
    character_description:str = Field(description="The description of the character", default="")
    character_age:int = Field(description="The age of the character", default=0)
    character_gender:str = Field(description="The gender of the character", default="")
    character_appearance:str = Field(description="The appearance of the character", default="")
    character_personality:str = Field(description="The personality of the character", default="")
    character_backstory:str = Field(description="The backstory of the character", default="")



# agent 
provider = OpenAIProvider(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
model = OpenAIModel(model_name=OPENAI_MODEL, provider=provider)
character_agent = Agent(
    model,
    output_type=Character,
    system_prompt=trans("You are a helpful assistant that can help with character creation."),
)


async def main():
    result = await character_agent.run("generate a character of a novel")
    pprint(result.output.model_dump(), indent=4)


if __name__ == "__main__":
    asyncio.run(main())
