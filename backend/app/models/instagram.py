from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base


class InstagramAccount(Base):
    """Instagram account model."""
    __tablename__ = "instagram_accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    instagram_user_id = Column(String, unique=True, index=True)
    username = Column(String, nullable=False)
    access_token = Column(String, nullable=False)
    token_expires_at = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    last_synced_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="instagram_accounts")
    posts = relationship("Post", back_populates="instagram_account")
