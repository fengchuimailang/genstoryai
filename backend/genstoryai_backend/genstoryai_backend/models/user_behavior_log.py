from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from . import CommonBase

class UserBehaviorLogBase(CommonBase, BaseModel):
    user_id: int = Field(description="执行操作的用户 ID")
    action: str = Field(description="用户执行的操作")
    target_type: str = Field(description="操作目标的类型")
    target_id: int = Field(description="操作目标的 ID")
    details: Optional[str] = Field(default=None, description="操作的详细信息")
    device_resolution: Optional[str] = Field(default=None, description="设备分辨率")
    mac_address: Optional[str] = Field(default=None, description="设备 MAC 地址")
    device_name: Optional[str] = Field(default=None, description="设备名称")

class UserBehaviorLog(UserBehaviorLogBase):
    id: int

    class Config:
        orm_mode = True

class UserBehaviorLogCreate(UserBehaviorLogBase):
    pass

class UserBehaviorLogRead(UserBehaviorLogBase):
    id: int

    class Config:
        orm_mode = True

class UserBehaviorLogUpdate(CommonBase, BaseModel):
    user_id: Optional[int] = None
    action: Optional[str] = None
    target_type: Optional[str] = None
    target_id: Optional[int] = None
    details: Optional[str] = None
    device_resolution: Optional[str] = None
    mac_address: Optional[str] = None
    device_name: Optional[str] = None

    class Config:
        orm_mode = True