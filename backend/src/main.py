from fastapi import FastAPI
import uvicorn
from api.character_api import router as character_router
from utils.middleware import add_middlewares

app = FastAPI(title="GenStoryAI API")
add_middlewares(app)

# 挂载各个路由
app.include_router(character_router)

@app.get("/")
async def root():
    return {"message": "Welcome to GenStoryAI API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)