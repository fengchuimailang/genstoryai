import os
from fastapi import FastAPI
import uvicorn

from genstoryai_backend.utils.i18n import compile_translations
from contextlib import asynccontextmanager
from genstoryai_backend.config import print_env_vars
compile_translations()

from genstoryai_backend.utils.middleware import add_middlewares
from genstoryai_backend.utils.i18n import trans 
from genstoryai_backend.database.db import create_db_and_tables
from genstoryai_backend.router import story_router
from genstoryai_backend.router import character_router
from genstoryai_backend.router import user_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(title="GenStoryAI API", lifespan=lifespan)
add_middlewares(app)

# add router
app.include_router(character_router)
app.include_router(story_router)
app.include_router(user_router)

@app.get("/")
async def root():
    return {"message": trans("Welcome to GenStoryAI API")}


if __name__ == "__main__":
    print_env_vars()
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)