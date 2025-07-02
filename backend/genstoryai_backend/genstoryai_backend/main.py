from fastapi import FastAPI
import uvicorn
from genstoryai_backend.utils.i18n import compile_translations
compile_translations()

from genstoryai_backend.utils.middleware import add_middlewares
from genstoryai_backend.utils.i18n import trans 
from genstoryai_backend.database.db import create_db_and_tables
from genstoryai_backend.router import character_router

app = FastAPI(title="GenStoryAI API")
add_middlewares(app)

# add router
app.include_router(character_router)

# init db 
@app.on_event("startup")
def startup():
    """Event handler to create database tables on application startup."""
    create_db_and_tables()

@app.get("/")
async def root():
    return {"message": trans("Welcome to GenStoryAI API")}

