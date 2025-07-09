from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware


def add_middlewares(app):
    # 添加 CORS 中间件
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )