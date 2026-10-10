from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class InstagramAccountBase(BaseModel):
    username: str


class InstagramAccountCreate(InstagramAccountBase):
    access_token: str
    token_expires_at: Optional[datetime] = None


class InstagramAccountInDB(InstagramAccountBase):
    id: int
    instagram_user_id: Optional[str] = None
    is_active: bool
    last_synced_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class InstagramAccount(InstagramAccountInDB):
    pass
