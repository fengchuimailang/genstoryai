#!/bin/bash

# GenStoryAI 部署脚本
# 使用FastAPI提供静态资源的单容器部署

set -e

echo "🚀 开始部署 GenStoryAI..."

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker未运行，请启动Docker"
    exit 1
fi

# 构建镜像
echo "📦 构建Docker镜像..."
docker build -t genstoryai-app:latest .

# 停止并删除旧容器
echo "🛑 停止旧容器..."
docker stop genstoryai-app 2>/dev/null || true
docker rm genstoryai-app 2>/dev/null || true

# 运行新容器
echo "▶️ 启动新容器..."
docker run -d \
    --name genstoryai-app \
    -p 80:80 \
    --restart unless-stopped \
    -e PORT=80 \
    -e OPENAI_API_KEY=${OPENAI_API_KEY:-your-openai-key} \
    -e OPENAI_BASE_URL=${OPENAI_BASE_URL:-http://localhost:11434/v1} \
    -e OPENAI_MODEL=${OPENAI_MODEL:-qwen3:4b} \
    -e DATABASE_URL=${DATABASE_URL:-sqlite:///./genstoryai.db} \
    -e SECRET_KEY=${SECRET_KEY:-your-secret-key} \
    -e ALGORITHM=${ALGORITHM:-HS256} \
    -e ACCESS_TOKEN_EXPIRE_MINUTES=${ACCESS_TOKEN_EXPIRE_MINUTES:-120} \
    -e SMTP_SERVER=${SMTP_SERVER:-your-mail-smtp.com} \
    -e SMTP_PORT=${SMTP_PORT:-465} \
    -e SMTP_USERNAME=${SMTP_USERNAME:-notification@example.com} \
    -e SMTP_PASSWORD=${SMTP_PASSWORD:-your-email-password} \
    -e MAIL_SIMULATE=${MAIL_SIMULATE:-true} \
    -e SMTP_EMAIL_FROM_NAME=${SMTP_EMAIL_FROM_NAME:-example} \
    -e SMTP_EMAIL_FROM_ADDRESS=${SMTP_EMAIL_FROM_ADDRESS:-notification@example.com} \
    -e FRONTEND_URL=${FRONTEND_URL:-http://localhost} \
    -e LOG_LEVEL=${LOG_LEVEL:-INFO} \
    -e LOG_FILE=${LOG_FILE:-genstoryai.log} \
    -e VITE_API_BASE_URL=${VITE_API_BASE_URL:-/api} \
    genstoryai-app:latest

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 健康检查
echo "🔍 执行健康检查..."
if curl -f http://localhost/api/health > /dev/null 2>&1; then
    echo "✅ 后端健康检查通过"
else
    echo "❌ 后端健康检查失败"
    exit 1
fi

if curl -f http://localhost/ > /dev/null 2>&1; then
    echo "✅ 前端健康检查通过"
else
    echo "❌ 前端健康检查失败"
    exit 1
fi

echo "🎉 部署完成！"
echo "📱 前端访问地址: http://localhost"
echo "🔧 API文档地址: http://localhost/docs"
echo "📊 健康检查地址: http://localhost/api/health"

# 显示容器状态
echo "📋 容器状态:"
docker ps --filter "name=genstoryai-app" 