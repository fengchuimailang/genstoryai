# 多阶段构建：前端构建 + 后端运行

# 阶段1：前端构建
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# 安装pnpm
RUN npm install -g pnpm

# 复制前端依赖文件
COPY frontend/genstoryai_frontend/package.json frontend/genstoryai_frontend/pnpm-lock.yaml ./

# 安装前端依赖
RUN pnpm install --frozen-lockfile

# 复制前端源代码
COPY frontend/genstoryai_frontend/ ./

# 设置构建时环境变量
ENV VITE_API_BASE_URL=/api

# 构建前端
RUN pnpm run build

# 阶段2：后端运行
FROM python:3.12-slim

WORKDIR /app

# 安装系统依赖
RUN apt-get update && \
    apt-get install -y gcc default-libmysqlclient-dev pkg-config && \
    pip install "poetry==1.7.1" && \
    rm -rf /var/lib/apt/lists/*

RUN poetry config virtualenvs.in-project true

# 复制后端依赖文件并安装依赖
COPY backend/genstoryai_backend/pyproject.toml backend/genstoryai_backend/poetry.lock ./
RUN poetry install --no-root

# 复制后端代码
COPY backend/genstoryai_backend .

# 从前端构建阶段复制静态文件
COPY --from=frontend-builder /app/frontend/dist ./static

# 创建静态文件目录（如果不存在）
RUN mkdir -p ./static

EXPOSE 8000

# 启动FastAPI应用
CMD ["poetry", "run", "start"] 