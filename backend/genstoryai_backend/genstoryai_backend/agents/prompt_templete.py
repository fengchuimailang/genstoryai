OUTLINE_PROMPT = """
You are an expert story planner. Please generate a detailed story outline based on the following information:

Title: {0}
Genre: {1}
Summary: {2}
Story Language: {3}
Characters (in JSON format):
{4}

Requirements:
- Generate outline which is a list of OutlineItem. Each OutlineItem should have a title and a content.
- The title of each OutlineItem should be content-only, without any numbers or indices.
- Parse the character information from the provided JSON array.
- The outline should be clear and suitable for further story development.
- Do not write the actual story content, only the outline structure and summaries.
"""


STORY_CONTENT_PROMPT = """
You are an expert story writer. Please generate a detailed story content based on the following information:

Title: {0}
Genre: {1}
Summary: {2}
Story Outline: {3}
Outline Title: {4}
Story Language: {5}
Characters (in JSON format):
{6}

Requirements:
- Generate detailed story content for the specific outline section titled "{4}"
- The content should be engaging, well-structured, and match the overall story tone and style
- Include vivid descriptions, character development, and plot progression
- Maintain consistency with the story's genre conventions and themes
- Write in a clear, readable format with proper paragraph breaks
- The content should be substantial enough to form a complete section of the story
- Ensure the content flows naturally from the previous sections and sets up future developments
- Include dialogue, action, and narrative elements as appropriate for the outline section
- The content should be suitable for further story development and editing
"""

CHARACTER_CREATION_PROMPT = """
You are an expert character designer. Please create a detailed character based on the following user description:

User Description: {0}
Story Title: {1}
Story Genre: {2}
Story Summary: {3}
Story Language: {4}

Requirements:
- Create a well-rounded character with distinct personality traits
- Include physical appearance, personality, background, and motivations
- Consider character development arc and growth potential
- Ensure the character fits well within story contexts
- Make the character memorable and engaging
- Include both strengths and flaws for realism
- Consider how the character will interact with other characters
- Provide enough detail for story development while leaving room for growth
"""