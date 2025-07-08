# 后端 Dockerfile
FROM python:3.12-slim

# 设置工作目录
WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    libffi-dev \
    libpq-dev \
    build-essential \
    gettext \
    pkg-config \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

# 创建非root用户
RUN useradd --create-home --shell /bin/bash app

# 复制 Poetry 配置文件并安装依赖
COPY pyproject.toml poetry.lock ./
RUN pip install "poetry==1.7.1"
RUN poetry install --no-root --only main || (cat /root/.cache/pypoetry/log/* || true; exit 1)

# 复制后端全部代码
COPY . .

# 更改文件所有权
RUN chown -R app:app /app

# 切换到非root用户
USER app

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["poetry", "run", "start"] 