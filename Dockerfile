# 构建前端
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/genstoryai_frontend/package.json frontend/genstoryai_frontend/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY frontend/genstoryai_frontend .
RUN pnpm run build

# 构建后端
FROM python:3.12-slim AS backend-build
WORKDIR /app
COPY backend/genstoryai_backend/pyproject.toml backend/genstoryai_backend/poetry.lock ./
RUN pip install poetry && poetry install --no-root --no-dev
COPY backend/genstoryai_backend .

# 生产镜像
FROM python:3.12-slim
WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y nginx supervisor && rm -rf /var/lib/apt/lists/*

# 复制后端
COPY --from=backend-build /app /app

# 复制前端静态文件到 nginx/html
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 复制 supervisor 配置
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# 暴露端口
EXPOSE 80

# 启动 supervisor
CMD ["/usr/bin/supervisord"] 