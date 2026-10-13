from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Any


class TierPrediction(BaseModel):
    tier: str
    price: float
    conversions: int
    revenue: float


class OfferOption(BaseModel):
    offer_type: str
    rationale: str
    suggested_copy: str
    confidence_score: float
    tier_predictions: List[TierPrediction]
    total_expected_revenue: float


class CampaignCreate(BaseModel):
    campaign_name: str
    selected_offer_type: str
    offer_details: dict  # JSON with all offer options
    suggested_copy: str


class CampaignResponse(BaseModel):
    id: int
    campaign_name: str
    campaign_slug: str
    selected_offer_type: str
    landing_page_url: str
    created_at: datetime


class CampaignListResponse(BaseModel):
    id: int
    campaign_name: str
    campaign_slug: str
    selected_offer_type: str
    landing_page_url: str
    is_active: bool
    created_at: datetime
