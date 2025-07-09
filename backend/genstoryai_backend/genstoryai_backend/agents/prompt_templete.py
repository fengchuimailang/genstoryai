OUTLINE_PROMPT = """
You are an expert story planner. Please generate a detailed story outline based on the following information:

Title: {0}
Genre: {1}
Summary: {2}
Outline Level: {3}

Requirements:
- If Outline Level is 1, generate a one-level outline: a list of main chapters or sections, each with a title and a brief summary.
- If Outline Level is 2, generate a two-level outline: each main chapter should contain a list of sub-sections, each with a title and a brief summary.
- The outline should be clear, hierarchical, and suitable for further story development.
- Do not write the actual story content, only the outline structure and summaries.

"""