from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class PredictionRequest(BaseModel):
    caption: Optional[str] = None
    media_type: Optional[str] = "image"
    offer_type: Optional[str] = None
    hashtags: Optional[List[str]] = None
    campaign_name: Optional[str] = None


class EngagementPrediction(BaseModel):
    predicted_likes: float
    predicted_comments: float
    predicted_shares: float
    predicted_engagement_rate: float
    confidence_score: float


class ConversionPrediction(BaseModel):
    predicted_conversions: float
    probability: float
    confidence_score: float


class TimingPrediction(BaseModel):
    optimal_posting_times: List[dict]
    best_day: str
    best_hour: int


class OfferRecommendation(BaseModel):
    recommended_offer_type: str
    rationale: str
    expected_performance_improvement: float
    suggested_copy: Optional[str] = None


class HashtagRecommendation(BaseModel):
    recommended_hashtags: List[str]
    optimal_count: int
    existing_hashtags: List[str]
    suggested_count: int
    rationale: str
    trending_hashtags: List[str]


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


class PredictionResponse(BaseModel):
    id: int
    prediction_type: str
    engagement: Optional[EngagementPrediction] = None
    conversion: Optional[ConversionPrediction] = None
    timing: Optional[TimingPrediction] = None
    offer: Optional[OfferRecommendation] = None
    hashtags: Optional[HashtagRecommendation] = None
    model_version: str
    created_at: datetime

    class Config:
        from_attributes = True
