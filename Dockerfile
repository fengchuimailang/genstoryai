# 多阶段构建：前端构建 + 后端运行

# 阶段1：前端构建
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# 安装pnpm
RUN npm install -g pnpm

# 复制前端依赖文件
COPY frontend/genstoryai_frontend/package.json frontend/genstoryai_frontend/pnpm-lock.yaml ./

# 安装前端依赖
RUN pnpm install

# 复制前端源代码
COPY frontend/genstoryai_frontend/ ./

# 构建前端
RUN pnpm run build

# 阶段2：后端运行
FROM python:3.12-slim

WORKDIR /app

# 安装系统依赖
RUN apt-get update && \
    apt-get install -y gcc default-libmysqlclient-dev pkg-config && \
    rm -rf /var/lib/apt/lists/*

# 安装 uv
RUN pip install uv

# 复制 uv.lock 并安装依赖
COPY backend/genstoryai_backend/uv.lock ./
RUN uv pip sync uv.lock --system

# 复制后端代码到 /app/genstoryai_backend
COPY backend/genstoryai_backend /app/genstoryai_backend

WORKDIR /app/genstoryai_backend

# 安装本地包
RUN pip install .

# 从前端构建阶段复制静态文件
COPY --from=frontend-builder /app/frontend/dist ./static

# 创建静态文件目录（如果不存在）
RUN mkdir -p ./static

EXPOSE 80

# 启动FastAPI应用
CMD ["python", "genstoryai_backend/main.py"] 