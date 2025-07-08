# 基础镜像
FROM python:3.12-slim

WORKDIR /app

# 安装所有依赖
RUN apt-get update && \
    apt-get install -y gcc default-libmysqlclient-dev pkg-config nginx supervisor && \
    pip install "poetry==1.7.1" && \
    rm -rf /var/lib/apt/lists/*

RUN poetry config virtualenvs.in-project true

# 复制后端依赖文件并安装依赖
COPY backend/genstoryai_backend/pyproject.toml backend/genstoryai_backend/poetry.lock ./
RUN poetry install --no-root

# 复制后端代码
COPY backend/genstoryai_backend .

# 复制本地已构建好的前端静态文件
COPY frontend/genstoryai_frontend/dist /usr/share/nginx/html

# 复制 nginx/supervisor 配置
COPY nginx.conf /etc/nginx/nginx.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80
EXPOSE 8000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"] 