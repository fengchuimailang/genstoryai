from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session
from typing import Optional
from datetime import datetime, timedelta, UTC
import jwt
import smtplib
from email.mime.text import MIMEText

from ..models.user import UserCreate, UserRead, UserLogin, UserUpdate
from ..database.db import get_db
from ..database.crud import (
    create_user, get_user_by_email, authenticate_user, 
    get_users, update_user, delete_user, verify_user_email
)

# OAuth2 配置
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# 邮件配置
SMTP_SERVER = "your-smtp-server"
SMTP_PORT = 587
SMTP_USERNAME = "your-email@example.com"
SMTP_PASSWORD = "your-email-password"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

user_router = APIRouter(
    prefix="/user",
    tags=["user/用户"],
    responses={404: {"description": "Not found"}},
)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@user_router.post("/register", response_model=UserRead)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """用户注册"""
    db_user = create_user(db, user)
    
    # 发送验证邮件
    verification_url = f"http://your-api-url/verify-email?token={db_user.verification_token}"
    subject = "验证您的邮箱"
    body = f"请点击以下链接验证您的邮箱: {verification_url}"
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = SMTP_USERNAME
    msg['To'] = user.email
    
    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"发送验证邮件失败: {str(e)}")
    
    return db_user


@user_router.post("/token", response_model=dict)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """用户登录"""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@user_router.post("/logout")
def logout():
    """用户登出"""
    return {"message": "Logout successful"}


@user_router.get("/users/me/", response_model=UserRead)
def read_users_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """获取当前用户信息"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = {"email": email}
    except jwt.InvalidTokenError:
        raise credentials_exception
    user = get_user_by_email(db, email=token_data["email"])
    if user is None:
        raise credentials_exception
    return user


credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


@user_router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    """验证邮箱"""
    user = verify_user_email(db, token)
    return {"message": "邮箱验证成功"}


@user_router.get("/users/", response_model=list[UserRead])
def get_all_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """获取用户列表"""
    return get_users(db, skip=skip, limit=limit)


@user_router.put("/users/{user_id}", response_model=UserRead)
def update_user_info(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    """更新用户信息"""
    return update_user(db, user_id, user)


@user_router.delete("/users/{user_id}")
def delete_user_info(user_id: int, db: Session = Depends(get_db)):
    """删除用户"""
    delete_user(db, user_id)
    return {"message": "User deleted successfully"}