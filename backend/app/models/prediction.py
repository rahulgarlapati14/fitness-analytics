from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base


class Prediction(Base):
    """Model prediction results."""
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Prediction type
    prediction_type = Column(String)  # engagement, conversion, timing, offer
    
    # Predicted values
    predicted_likes = Column(Float)
    predicted_comments = Column(Float)
    predicted_shares = Column(Float)
    predicted_engagement_rate = Column(Float)
    predicted_conversions = Column(Float)
    confidence_score = Column(Float)
    
    # Timing predictions
    optimal_posting_times = Column(JSON)  # List of recommended times
    
    # Offer recommendation
    recommended_offer_type = Column(String)
    offer_rationale = Column(String)
    
    # Hashtag recommendation
    recommended_hashtags = Column(JSON)
    
    # Model metadata
    model_version = Column(String)
    model_name = Column(String)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    post = relationship("Post", back_populates="predictions")
