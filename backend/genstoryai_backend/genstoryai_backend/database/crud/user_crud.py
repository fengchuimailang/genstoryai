from typing import List, Optional
from fastapi import HTTPException, status
from sqlmodel import Session, select

from genstoryai_backend.models.user import User, UserCreate, UserUpdate
from passlib.context import CryptContext
from datetime import datetime
import secrets
import logging

logger = logging.getLogger(__name__)


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def create_user(db: Session, user: UserCreate, verification_token: Optional[str] = None, token_created_at: Optional[datetime] = None) -> User:
    # 检查邮箱是否已存在
    existing_user = get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 密码加密
    hashed_password = get_password_hash(user.password)
    
    db_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password,
        is_active=True,
        is_verified=False,
        verification_token=verification_token,
        token_created_at=token_created_at
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_id(db: Session, user_id: int) -> User:
    db_user = db.exec(select(User).where(User.id == user_id)).first()
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.exec(select(User).where(User.email == email)).first()

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.exec(select(User).where(User.username == username)).first()


def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    return list(db.exec(select(User).offset(skip).limit(limit)).all())


def login_user(db: Session, username_or_email: str, password: str) -> User:
    """
    用户登录，支持用户名或邮箱登录，包含邮箱验证检查。
    """
    print(f"[DEBUG] 开始登录验证: {username_or_email}")  # 直接打印，确保能看到
    
    # 先尝试按邮箱查找用户
    user = get_user_by_email(db, username_or_email)
    print(f"[DEBUG] 按邮箱查找结果: {'找到' if user else '未找到'}")
    
    # 如果按邮箱没找到，尝试按用户名查找
    if not user:
        user = get_user_by_username(db, username_or_email)
        print(f"[DEBUG] 按用户名查找结果: {'找到' if user else '未找到'}")
    
    if not user:
        print(f"[DEBUG] 用户不存在: {username_or_email}")
        logger.info(f"[AUTH_DEBUG] User not found for: {username_or_email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"[DEBUG] 用户存在，开始验证密码: {user.email}")
    if not verify_password(password, user.password):
        print(f"[DEBUG] 密码验证失败: {username_or_email}")
        logger.info(f"[AUTH_DEBUG] Password verification failed for: {username_or_email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"[DEBUG] 密码验证成功，检查邮箱验证状态: {user.is_verified}")
    # 检查用户是否已验证邮箱
    if not user.is_verified:
        print(f"[DEBUG] 邮箱未验证: {user.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="请先验证您的邮箱地址",
        )
    
    print(f"[DEBUG] 登录成功: {username_or_email} -> {user.email}")
    logger.info(f"[AUTH_DEBUG] Authentication successful for: {username_or_email} (email: {user.email})")
    return user


def update_user(db: Session, user_id: int, user: UserUpdate) -> User:
    db_user = db.exec(select(User).where(User.id == user_id)).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user.dict(exclude_unset=True)
    for key, value in update_data.items():
        if key == "password" and value:
            value = get_password_hash(value)
        setattr(db_user, key, value)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int):
    db_user = db.exec(select(User).where(User.id == user_id)).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()


def verify_user_email(db: Session, token: str, expire_hours: int = 24) -> User:
    """
    校验邮箱验证token，支持token只能用一次和有效期限制。
    """
    user = db.exec(select(User).where(User.verification_token == token)).first()
    if not user:
        raise HTTPException(status_code=400, detail="无效的验证令牌")
    # 检查token是否过期
    # 检查token是否过期
    if not user.token_created_at or (datetime.utcnow() - user.token_created_at).total_seconds() > expire_hours * 3600:
        raise HTTPException(status_code=400, detail="验证令牌已过期")
    user.is_verified = True
    user.verification_token = None
    user.token_created_at = None
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def set_user_verification_token(db: Session, user: User) -> User:
    """
    为用户生成新的邮箱验证token和token_created_at。
    """
    new_token = secrets.token_urlsafe(32)
    user.verification_token = new_token
    user.token_created_at = datetime.utcnow()
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
