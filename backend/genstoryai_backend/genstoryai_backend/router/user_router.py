from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, Field
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import jwt
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from sqlalchemy import select

from ..models.user import UserCreate, UserRead, UserLogin, UserUpdate
from ..database.db import get_db
from ..database.crud import (
    create_user, get_user_by_email, login_user,
    get_users, update_user, delete_user, verify_user_email
)
from ..config import settings
from ..utils.email_templates import get_verification_email_content
from ..database.crud import set_user_verification_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

user_router = APIRouter(
    prefix="/user",
    tags=["user/用户"],
    responses={404: {"description": "Not found"}},
)

logger = logging.getLogger(__name__)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """创建访问令牌"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def send_verification_email(email: str, token: str, username: str, language: str = 'zh'):
    """发送验证邮件，支持模拟和真实发送，多语言"""
    verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    html_content, text_content = get_verification_email_content(username, verification_url, language)

    if settings.MAIL_SIMULATE:
        logger.info(f"[MAIL_SIMULATE] To: {email}, User: {username}, Lang: {language}, Link: {verification_url}")
        logger.debug(f"[MAIL_SIMULATE] Content: {text_content}")
        return True

    # 真实邮件发送
    msg = MIMEMultipart('alternative')
    msg['Subject'] = "验证您的 GenStoryAI 账户"
    msg['From'] = settings.SMTP_USERNAME
    msg['To'] = email
    text_part = MIMEText(text_content, 'plain', 'utf-8')
    html_part = MIMEText(html_content, 'html', 'utf-8')
    msg.attach(text_part)
    msg.attach(html_part)
    try:
        if settings.SMTP_PORT == 465:
            with smtplib.SMTP_SSL(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.send_message(msg)
        else:
            with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.send_message(msg)
        logger.info(f"[MAIL_SEND] Email sent to {email} ({language})")
        return True
    except Exception as e:
        logger.error(f"[MAIL_SEND_FAIL] To: {email}, Error: {str(e)}")
        return False


@user_router.post("/register", response_model=UserRead)
def register_endpoint(user: UserCreate, db: Session = Depends(get_db)) -> UserRead:
    """
    用户注册接口。
    - 创建新用户并发送邮箱验证邮件。
    - 若邮件发送失败，自动删除用户。
    """
    try:
        import secrets
        verification_token = secrets.token_urlsafe(32)
        token_created_at = datetime.utcnow()
        # create_user 需支持 token/token_created_at 参数
        db_user = create_user(db, user, verification_token=verification_token, token_created_at=token_created_at)
    except Exception as e:
        logger.error(f"[REGISTER_FAIL] DB error: {str(e)}")
        raise HTTPException(status_code=500, detail="注册失败，请稍后重试")
    if db_user.verification_token is None:
        db.delete(db_user)
        db.commit()
        logger.error(f"[REGISTER_FAIL] Token creation failed for {user.email}")
        raise HTTPException(status_code=500, detail="注册失败，请稍后重试")
    if not send_verification_email(user.email, str(db_user.verification_token), user.username, language='zh'):
        db.delete(db_user)
        db.commit()
        logger.error(f"[REGISTER_FAIL] Send mail failed for {user.email}")
        raise HTTPException(status_code=500, detail="注册失败，请稍后重试")
    logger.info(f"[REGISTER] User registered: {user.email}")
    return UserRead.model_validate(db_user)


@user_router.post("/token", response_model=dict)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """用户登录"""
    print(f"[ROUTER_DEBUG] 收到登录请求: {form_data.username}")
    logger.info(f"[LOGIN_ATTEMPT] Username: {form_data.username}")
    try:
        user = login_user(db, form_data.username, form_data.password)
    except HTTPException as e:
        print(f"[ROUTER_DEBUG] 登录失败: {str(e.detail)}")
        logger.warning(f"[LOGIN_FAIL] {str(e.detail)} for: {form_data.username}")
        raise
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    print(f"[ROUTER_DEBUG] 登录成功，生成token: {user.email}")
    logger.info(f"[LOGIN_SUCCESS] User logged in: {user.email}")
    return {"access_token": access_token, "token_type": "bearer"}


@user_router.post("/logout")
def logout():
    """用户登出"""
    return {"message": "Logout successful"}


@user_router.get("/users/me/", response_model=UserRead)
def read_users_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """获取当前用户信息"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
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
def verify_email_endpoint(token: str, db: Session = Depends(get_db)) -> dict:
    """
    邮箱验证接口。
    - 根据邮箱验证令牌激活用户。
    - 令牌只能使用一次。
    - 令牌有效期24小时。
    """
    logger.info(f"[VERIFY_EMAIL] Token: {token}")
    try:
        user = verify_user_email(db, token, expire_hours=24)
    except HTTPException as e:
        logger.error(f"[VERIFY_EMAIL_FAIL] {str(e.detail)}")
        raise
    logger.info(f"[VERIFY_EMAIL_SUCCESS] User: {user.email}")
    return {"message": "邮箱验证成功", "user_id": user.id, "email": user.email}


class ResendVerificationRequest(BaseModel):
    email: str

@user_router.post("/resend-verification")
def resend_verification_endpoint(request: ResendVerificationRequest, db: Session = Depends(get_db)) -> dict:
    """
    重新发送邮箱验证邮件接口。
    - 仅对未验证用户有效。
    - 生成新令牌并发送邮件。
    - 新令牌有效期24小时。
    """
    user = get_user_by_email(db, request.email)
    if not user:
        logger.error(f"[RESEND_FAIL] User not found: {request.email}")
        raise HTTPException(status_code=404, detail="用户不存在")
    if user.is_verified:
        logger.warning(f"[RESEND_FAIL] Already verified: {request.email}")
        raise HTTPException(status_code=400, detail="邮箱已经验证")
    user = set_user_verification_token(db, user)
    if not send_verification_email(user.email, str(user.verification_token), user.username, language='zh'):
        logger.error(f"[RESEND_FAIL] Send mail failed: {user.email}")
        raise HTTPException(status_code=500, detail="发送验证邮件失败，请稍后重试")
    logger.info(f"[RESEND] Verification mail resent to: {user.email}")
    return {"message": "验证邮件已重新发送"}


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