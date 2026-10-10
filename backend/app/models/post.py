from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base


class Post(Base):
    """Instagram post model."""
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    instagram_account_id = Column(Integer, ForeignKey("instagram_accounts.id"), nullable=False)
    instagram_post_id = Column(String, unique=True, index=True)
    media_type = Column(String)  # image, video, carousel
    media_url = Column(String)
    caption = Column(Text)
    hashtags = Column(Text)  # JSON array as string
    posted_at = Column(DateTime(timezone=True))
    
    # Engagement metrics
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    shares_count = Column(Integer, default=0)
    impressions = Column(Integer, default=0)
    reach = Column(Integer, default=0)
    engagement_rate = Column(Float, default=0.0)
    
    # Conversion tracking
    lead_conversions = Column(Integer, default=0)
    offer_type = Column(String)  # free_trial, discount, bundle, referral
    
    # Analysis
    sentiment_score = Column(Float)
    has_offer = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    instagram_account = relationship("InstagramAccount", back_populates="posts")
    predictions = relationship("Prediction", back_populates="post")
