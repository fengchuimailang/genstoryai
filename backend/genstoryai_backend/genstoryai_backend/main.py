import os
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from contextlib import asynccontextmanager
from genstoryai_backend.config import print_env_vars

from genstoryai_backend.utils.middleware import add_middlewares
from genstoryai_backend.database.db import create_db_and_tables
from genstoryai_backend.router import story_router
from genstoryai_backend.router import character_router
from genstoryai_backend.router import user_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(title="GenStoryAI API", lifespan=lifespan)

# 添加CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境中应该限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

add_middlewares(app)

# add router with /api prefix - 必须在静态文件之前添加
app.include_router(character_router, prefix="/api")
app.include_router(story_router, prefix="/api")
app.include_router(user_router, prefix="/api")

@app.get("/api/")
async def root():
    return {"message": "Welcome to GenStoryAI API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "GenStoryAI API is running"}

@app.get("/api/test")
async def test():
    return {"message": "API test endpoint working"}

# 挂载静态文件 - 在API路由之后
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
if os.path.exists(static_dir):
    # 静态资源缓存配置
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets"), check_dir=False), name="assets")

# SPA路由处理 - 对于非API路由，返回index.html
@app.get("/{full_path:path}")
async def serve_spa(full_path: str, request: Request):
    # 如果是API路由，跳过
    if full_path.startswith("api/"):
        return {"error": "API endpoint not found"}
    
    # 检查是否是静态资源
    if full_path.startswith("assets/") or full_path in ["favicon.ico", "robots.txt"]:
        return {"error": "Static file not found"}
    
    # 返回index.html用于SPA路由
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path, headers={"Cache-Control": "no-cache"})
    else:
        return {"error": "Frontend not built"}

if __name__ == "__main__":
    print_env_vars()
    port = int(os.getenv("PORT", 80))
    uvicorn.run(app, host="0.0.0.0", port=port)