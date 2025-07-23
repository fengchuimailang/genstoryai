from pydantic_ai import Agent, RunContext
from pydantic_ai.models.openai import OpenAIModel
from pydantic_ai.providers.openai import OpenAIProvider
from genstoryai_backend.models.story import StoryOutline, Story, OutlineItem
from genstoryai_backend.models.character import CharacterCreate, CharacterRead
from genstoryai_backend.models.story_content import StoryContentCreate
from genstoryai_backend.database.storage_sync import StorageManagerSync
from genstoryai_backend.config import settings
from sqlmodel import Session
from genstoryai_backend.database.db import engine
from typing import List, Optional, Dict, Any, Union
from uuid import UUID
import json
from genstoryai_backend.agents.prompt_templete import OUTLINE_PROMPT, STORY_CONTENT_PROMPT
from genstoryai_backend.agents.prompt_templete import CHARACTER_CREATION_PROMPT

class UnifiedAgent:
    """Unified agent that manages story generation using Pydantic AI tools"""
    
    def __init__(self, db_session: Optional[Session] = None, redis_url: str = "redis://localhost:6379/0"):
        self.db_session = db_session or Session(engine)
        self.storage = StorageManagerSync(self.db_session, redis_url=redis_url)
        
        # Initialize OpenAI model
        OPENAI_API_KEY = settings.OPENAI_API_KEY
        OPENAI_BASE_URL = settings.OPENAI_BASE_URL
        OPENAI_MODEL = settings.OPENAI_MODEL
        
        if not all([OPENAI_API_KEY, OPENAI_BASE_URL, OPENAI_MODEL]):
            raise ValueError("OpenAI configuration is incomplete")
            
        provider = OpenAIProvider(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
        model = OpenAIModel(model_name=OPENAI_MODEL, provider=provider)
        
        # Create the main agent with tools and structured output
        self.agent = Agent(
            model,
            system_prompt=(
                "You are an expert AI assistant for story generation. You can help users create "
                "story outlines, generate story content, and develop characters. Use the available "
                "tools to perform these tasks effectively. When asked to generate content, always "
                "use the appropriate tool rather than trying to generate content directly in your response. "
                "After using tools, provide a helpful response or return the structured data as requested."
            ),
            deps_type=Dict[str, Any],  # Context dependencies
            output_type=[str, StoryOutline, StoryContentCreate, CharacterCreate]  # 结构化输出类型
        )
        
        # Register tools with the agent
        self._register_tools()
    
    def _register_tools(self):
        """Register all tools with the agent"""
        
        @self.agent.tool
        async def prepare_outline_data(
            ctx: RunContext[Dict[str, Any]],
            story_title: str,
            story_genre: str,
            story_summary: str,
            story_language: str = "English",
            characters_json: str = "[]"
        ) -> str:
            """
            Prepare data for story outline generation.
            
            Args:
                story_title: The title of the story
                story_genre: The genre of the story
                story_summary: A brief summary of the story
                story_language: The language for the story
                characters_json: JSON string of character information
            """
            session_id = ctx.deps.get('session_id')
            if not session_id:
                raise ValueError("Session ID is required")
            
            # Log the tool call
            self.storage.add_user_message(session_id, f"Preparing outline data for: {story_title}")
            
            # Parse characters
            try:
                characters_data = json.loads(characters_json) if characters_json != "[]" else []
            except json.JSONDecodeError:
                characters_data = []
            
            # Generate outline using the existing logic
            user_prompt = OUTLINE_PROMPT.format(
                story_title, 
                story_genre, 
                story_summary, 
                story_language,
                json.dumps(characters_data, ensure_ascii=False, indent=2)
            )
            
            self.storage.add_agent_message(session_id, f"Prepared outline data for {story_title}")
            return f"Ready to generate outline for '{story_title}' ({story_genre} genre, language: {story_language}). Summary: {story_summary}. Characters: {len(characters_data)} characters provided."
        
        @self.agent.tool
        async def prepare_content_data(
            ctx: RunContext[Dict[str, Any]],
            story_title: str,
            story_genre: str,
            story_summary: str,
            story_outline: str,
            outline_title: str,
            story_language: str = "English",
            characters_json: str = "[]"
        ) -> str:
            """
            Prepare data for story content generation.
            
            Args:
                story_title: The title of the story
                story_genre: The genre of the story
                story_summary: A brief summary of the story
                story_outline: The full story outline
                outline_title: The specific outline section to expand
                story_language: The language for the story
                characters_json: JSON string of character information
            """
            session_id = ctx.deps.get('session_id')
            if not session_id:
                raise ValueError("Session ID is required")
            
            # Log the tool call
            self.storage.add_user_message(session_id, f"Preparing content data for: {outline_title}")
            
            # Parse characters
            try:
                characters_data = json.loads(characters_json) if characters_json != "[]" else []
            except json.JSONDecodeError:
                characters_data = []
            
            # Create content using the existing logic
            user_prompt = STORY_CONTENT_PROMPT.format(
                story_title, 
                story_genre,
                story_summary, 
                story_outline, 
                outline_title,
                story_language,
                json.dumps(characters_data, ensure_ascii=False, indent=2)
            )
            
            story_id = ctx.deps.get('story_id', 1)
            self.storage.add_agent_message(session_id, f"Prepared content data for {outline_title}")
            return f"Ready to generate content for '{outline_title}' in '{story_title}' (story_id: {story_id}). Genre: {story_genre}. Language: {story_language}. Characters: {len(characters_data)} characters provided."
        
        @self.agent.tool
        async def prepare_character_data(
            ctx: RunContext[Dict[str, Any]],
            user_prompt: str,
            story_title: str,
            story_genre: str,
            story_summary: str,
            story_language: str = "English"
        ) -> str:
            """
            Prepare data for character generation.
            
            Args:
                user_prompt: User's description of the character they want
                story_title: The title of the story
                story_genre: The genre of the story
                story_summary: A brief summary of the story
                story_language: The language for the story
            """
            session_id = ctx.deps.get('session_id')
            if not session_id:
                raise ValueError("Session ID is required")
            
            # Log the tool call
            self.storage.add_user_message(session_id, f"Preparing character data for: {user_prompt}")
            
            # Create character using the existing logic
            formatted_prompt = CHARACTER_CREATION_PROMPT.format(
                user_prompt, 
                story_title, 
                story_genre, 
                story_summary, 
                story_language
            )
            
            story_id = ctx.deps.get('story_id', 1)
            self.storage.add_agent_message(session_id, f"Prepared character data for story {story_title}")
            return f"Ready to generate character for story '{story_title}' (story_id: {story_id}). User request: {user_prompt}. Genre: {story_genre}. Language: {story_language}."
    
    async def run(self, user_message: str, session_id: UUID, context: Optional[Dict[str, Any]] = None) -> Union[str, StoryOutline, StoryContentCreate, CharacterCreate]:
        """
        Run the unified agent with a user message.
        
        Args:
            user_message: The user's input message
            session_id: The session ID for logging
            context: Additional context for the tools
            
        Returns:
            The agent's response
        """
        # Prepare dependencies
        deps = {
            'session_id': session_id,
            **(context or {})
        }
        
        # Log user message
        self.storage.add_user_message(session_id, user_message)
        
        # Run the agent
        result = await self.agent.run(user_message, deps=deps)
        
        # Log agent response
        response = result.output if hasattr(result, 'output') else str(result)
        
        # Convert structured objects to string for logging
        if isinstance(response, (StoryOutline, StoryContentCreate, CharacterCreate)):
            log_message = f"Generated {type(response).__name__}: {response}"
        else:
            log_message = str(response)
            
        self.storage.add_agent_message(session_id, log_message)
        
        return response
    
    async def generate_story_outline(self, session_id: UUID, story: Story, character_reads: List[CharacterRead]) -> Optional[StoryOutline]:
        """Generate story outline using the unified agent"""
        characters_data = [character.model_dump(exclude_unset=True) for character in character_reads]
        characters_json = json.dumps(characters_data, ensure_ascii=False, indent=2)
        
        context = {
            'story': story.model_dump(),
            'characters': characters_data,
            'story_id': story.id
        }
        
        user_prompt = OUTLINE_PROMPT.format(
            story.title,
            story.genre.name if story.genre else 'Unknown',
            story.summary or 'No summary provided',
            story.language,
            characters_json
        )
        
        result = await self.run(user_prompt, session_id, context)
        
        # 检查结果是否是 StoryOutline 类型
        if isinstance(result, StoryOutline):
            return result
        else:
            # 如果不是结构化输出，返回默认大纲
            print(f"Expected StoryOutline but got: {type(result)}")
            outline_items = [
                OutlineItem(
                    title=f"Chapter {i+1}",
                    content=f"Generated content for chapter {i+1} of {story.title}"
                ) for i in range(3)
            ]
            return StoryOutline(outline=outline_items)
    
    async def generate_story_content(self, session_id: UUID, story: Story, character_reads: List[CharacterRead], outline_title: str) -> Optional[StoryContentCreate]:
        """Generate story content using the unified agent"""
        characters_data = [character.model_dump(exclude_unset=True) for character in character_reads]
        characters_json = json.dumps(characters_data, ensure_ascii=False, indent=2)
        
        context = {
            'story': story.model_dump(),
            'characters': characters_data,
            'outline_title': outline_title,
            'story_id': story.id
        }
        
        user_prompt = f"Generate story content for '{outline_title}' in '{story.title}'. Genre: {story.genre.name if story.genre else 'Unknown'}. Language: {story.language}. Please use the prepare_content_data tool and then return a StoryContentCreate."
        
        result = await self.run(user_prompt, session_id, context)
        
        # 检查结果是否是 StoryContentCreate 类型
        if isinstance(result, StoryContentCreate):
            return result
        else:
            # 如果不是结构化输出，返回默认内容
            print(f"Expected StoryContentCreate but got: {type(result)}")
            return StoryContentCreate(
                story_id=story.id,
                outline_title=outline_title,
                content=f"Generated content for {outline_title} in {story.title}"
            )
    
    async def generate_character(self, session_id: UUID, user_prompt: str, story: Story) -> Optional[CharacterCreate]:
        """Generate character using the unified agent"""
        context = {
            'story': story.model_dump(),
            'user_prompt': user_prompt,
            'story_id': story.id
        }
        
        prompt = f"Create a character for the story '{story.title}'. User request: {user_prompt}. Genre: {story.genre.name if story.genre else 'Unknown'}. Language: {story.language}. Please use the prepare_character_data tool and then return a CharacterCreate."
        
        result = await self.run(prompt, session_id, context)
        
        # 检查结果是否是 CharacterCreate 类型
        if isinstance(result, CharacterCreate):
            return result
        else:
            # 如果不是结构化输出，返回默认角色
            print(f"Expected CharacterCreate but got: {type(result)}")
            return CharacterCreate(
                story_id=story.id,
                name="Generated Character",
                description=result if isinstance(result, str) else f"Character based on: {user_prompt}",
                personality="Friendly and determined"
            ) 