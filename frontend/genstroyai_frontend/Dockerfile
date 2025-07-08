# 前端 Dockerfile（多阶段构建）
# 构建阶段
FROM node:20-alpine AS build
WORKDIR /app

# 复制package文件
COPY package*.json ./


# 复制源代码
COPY . .

# 设置构建时环境变量（默认值）
ARG VITE_API_BASE_URL=http://localhost:5000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# 构建应用
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制nginx配置（如果需要自定义）
# COPY nginx.conf /etc/nginx/nginx.conf

# 复制构建产物
COPY --from=build /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"] 