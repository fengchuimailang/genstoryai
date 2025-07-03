from datetime import datetime
from sqlmodel import SQLModel, Field

class CommonBase(SQLModel):
    create_time: datetime = Field(default_factory=datetime.utcnow, description="创建时间")
    update_time: datetime = Field(default_factory=datetime.utcnow, description="更新时间")
    is_deleted: bool = Field(default=False, description="是否删除")