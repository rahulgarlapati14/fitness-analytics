from sqlalchemy import Column, Integer, String, DateTime, JSON, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base


class Campaign(Base):
    """Model for marketing campaigns and landing pages."""
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)

    # Campaign details
    campaign_name = Column(String, nullable=False)
    campaign_slug = Column(String, unique=True, nullable=False, index=True)
    selected_offer_type = Column(String, nullable=False)

    # Predictions and data
    offer_details = Column(JSON)  # Store all offer options and predictions
    landing_page_data = Column(JSON)  # Store landing page content

    # Status
    is_active = Column(Boolean, default=True)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
