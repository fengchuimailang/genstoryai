import os
import logging
from typing import Optional
from pathlib import Path

# 加载.env文件
from dotenv import load_dotenv
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(env_path)

def print_env_vars():
    """以易读的格式打印所有环境变量"""
    print("=" * 50)
    print("环境变量配置")
    print("=" * 50)
    
    # 模型配置
    print("\n📋 模型配置:")
    print(f"  OPENAI_API_KEY: {os.getenv('OPENAI_API_KEY', '未设置')[:20]}...")
    print(f"  OPENAI_MODEL: {os.getenv('OPENAI_MODEL', 'gpt-4o-mini')}")
    print(f"  OPENAI_BASE_URL: {os.getenv('OPENAI_BASE_URL', 'https://api.openai.com/v1')}")
    
    # 数据库配置
    print("\n🗄️  数据库配置:")
    print(f"  DATABASE_URL: {os.getenv('DATABASE_URL', 'sqlite:///./genstoryai.db')}")
    
    # JWT配置
    print("\n🔐 JWT配置:")
    print(f"  SECRET_KEY: {os.getenv('SECRET_KEY', 'your-secret-key-change-this-in-production')[:20]}...")
    print(f"  ALGORITHM: {os.getenv('ALGORITHM', 'HS256')}")
    print(f"  ACCESS_TOKEN_EXPIRE_MINUTES: {os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '30')}")
    
    # 邮件配置
    print("\n📧 邮件配置:")
    print(f"  SMTP_SERVER: {os.getenv('SMTP_SERVER', 'smtp.exmail.com')}")
    print(f"  SMTP_PORT: {os.getenv('SMTP_PORT', '465')}")
    print(f"  SMTP_USERNAME: {os.getenv('SMTP_USERNAME', 'smtp_name')}")
    print(f"  SMTP_PASSWORD: {'*' * len(os.getenv('SMTP_PASSWORD', 'smtp_password')) if os.getenv('SMTP_PASSWORD') else '未设置'}")
    print(f"  MAIL_SIMULATE: {os.getenv('MAIL_SIMULATE', 'false')}")
    
    # 前端URL配置
    print("\n🌐 前端配置:")
    print(f"  FRONTEND_URL: {os.getenv('FRONTEND_URL', 'http://localhost:5173')}")
    
    # 邮件模板配置
    print("\n📝 邮件模板配置:")
    print(f"  EMAIL_FROM_NAME: {os.getenv('SMTP_EMAIL_FROM_NAME', 'your-email-name')}")
    print(f"  EMAIL_FROM_ADDRESS: {os.getenv('SMTP_EMAIL_FROM_ADDRESS', 'your-email@example.com')}")
    
    # 日志配置
    print("\n📊 日志配置:")
    print(f"  LOG_LEVEL: {os.getenv('LOG_LEVEL', 'INFO')}")
    print(f"  LOG_FILE: {os.getenv('LOG_FILE', '未设置')}")
    
    print("\n" + "=" * 50)

class Settings:
    # 模型
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "your-openai-api-key")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    OPENAI_BASE_URL: str = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")


    # 数据库配置
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./genstoryai.db")
    
    # JWT配置
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
    
    # 邮件配置
    SMTP_SERVER: str = os.getenv("SMTP_SERVER", "smtp.exmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", 465))
    SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "smtp_name")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "smtp_password")
    MAIL_SIMULATE: bool = os.getenv("MAIL_SIMULATE", "false").lower() == "true"
    
    # 前端URL配置
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    
    # 邮件模板配置
    EMAIL_FROM_NAME: str = os.getenv("SMTP_EMAIL_FROM_NAME", "your-email-name")
    EMAIL_FROM_ADDRESS: str = os.getenv("SMTP_EMAIL_FROM_ADDRESS", "your-email@example.com")

    # 日志配置
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO").upper()
    LOG_FILE: str = os.getenv("LOG_FILE", "")

    @classmethod
    def get_smtp_config(cls) -> dict:
        return {
            "server": cls.SMTP_SERVER,
            "port": cls.SMTP_PORT,
            "username": cls.SMTP_USERNAME,
            "password": cls.SMTP_PASSWORD,
        }
    
    @classmethod
    def get_jwt_config(cls) -> dict:
        return {
            "secret_key": cls.SECRET_KEY,
            "algorithm": cls.ALGORITHM,
            "expire_minutes": cls.ACCESS_TOKEN_EXPIRE_MINUTES,
        }

    @classmethod
    def setup_logging(cls):
        logging.basicConfig(
            level=getattr(logging, cls.LOG_LEVEL, logging.INFO),
            format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
            filename=cls.LOG_FILE if cls.LOG_FILE else None,
            filemode="a"
        )

# 创建全局设置实例
settings = Settings()
settings.setup_logging() 