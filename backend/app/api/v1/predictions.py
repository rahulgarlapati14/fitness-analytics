from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ...core.database import get_db
from ...models.user import User
from ...models.instagram import InstagramAccount
from ...models.post import Post
from ...models.prediction import Prediction
from ...ml.offer_recommender import OfferRecommender
from ...schemas.prediction import (
    PredictionRequest,
    PredictionResponse,
    EngagementPrediction,
    ConversionPrediction,
    TimingPrediction,
    OfferRecommendation
)
from ...api.deps import get_current_user
from ...ml.engagement_model import EngagementPredictor
from ...ml.conversion_model import ConversionPredictor
from ...ml.timing_model import TimingPredictor
from ...ml.offer_recommender import OfferRecommender
from ...ml.hashtag_recommender import HashtagRecommender
from datetime import datetime

router = APIRouter()

# Initialize ML models
engagement_predictor = EngagementPredictor()
conversion_predictor = ConversionPredictor()
timing_predictor = TimingPredictor()
offer_recommender = OfferRecommender()
hashtag_recommender = HashtagRecommender()


@router.post("/engagement", response_model=PredictionResponse)
async def predict_engagement(
    request: PredictionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Predict engagement metrics for a post."""
    # Prepare post data for model
    post_data = {
        "caption": request.caption,
        "media_type": request.media_type,
        "offer_type": request.offer_type,
        "hashtags": request.hashtags
    }
    
    # Get prediction from ML model
    prediction_result = engagement_predictor.predict(post_data)
    
    engagement = EngagementPrediction(
        predicted_likes=prediction_result["predicted_likes"],
        predicted_comments=prediction_result["predicted_comments"],
        predicted_shares=prediction_result["predicted_shares"],
        predicted_engagement_rate=prediction_result["predicted_engagement_rate"],
        confidence_score=prediction_result["confidence_score"]
    )
    
    # Save prediction to database
    prediction = Prediction(
        user_id=current_user.id,
        prediction_type="engagement",
        predicted_likes=engagement.predicted_likes,
        predicted_comments=engagement.predicted_comments,
        predicted_shares=engagement.predicted_shares,
        predicted_engagement_rate=engagement.predicted_engagement_rate,
        confidence_score=engagement.confidence_score,
        model_version="v1.0.0",
        model_name="engagement_predictor"
    )
    
    db.add(prediction)
    await db.commit()
    await db.refresh(prediction)
    
    return PredictionResponse(
        id=prediction.id,
        prediction_type="engagement",
        engagement=engagement,
        model_version=prediction.model_version,
        created_at=prediction.created_at
    )


@router.post("/conversion", response_model=PredictionResponse)
async def predict_conversion(
    request: PredictionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Predict lead conversion for a post."""
    # Prepare post data for model
    post_data = {
        "caption": request.caption,
        "media_type": request.media_type,
        "offer_type": request.offer_type,
        "hashtags": request.hashtags
    }
    
    # Get prediction from ML model
    prediction_result = conversion_predictor.predict(post_data)
    
    conversion = ConversionPrediction(
        predicted_conversions=prediction_result["predicted_conversions"],
        probability=prediction_result["probability"],
        confidence_score=prediction_result["confidence_score"]
    )
    
    prediction = Prediction(
        user_id=current_user.id,
        prediction_type="conversion",
        predicted_conversions=conversion.predicted_conversions,
        confidence_score=conversion.confidence_score,
        model_version="v1.0.0",
        model_name="conversion_predictor"
    )
    
    db.add(prediction)
    await db.commit()
    await db.refresh(prediction)
    
    return PredictionResponse(
        id=prediction.id,
        prediction_type="conversion",
        conversion=conversion,
        model_version=prediction.model_version,
        created_at=prediction.created_at
    )


@router.post("/timing", response_model=PredictionResponse)
async def predict_timing(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Predict optimal posting times."""
    # Get user's historical posts for personalization
    result = await db.execute(
        select(Post).join(InstagramAccount).where(InstagramAccount.user_id == current_user.id)
    )
    posts = result.scalars().all()
    
    # Convert to dict format
    historical_data = []
    for post in posts:
        historical_data.append({
            "posted_at": post.posted_at,
            "likes_count": post.likes_count,
            "comments_count": post.comments_count,
            "shares_count": post.shares_count,
            "reach": post.reach
        })
    
    # Get prediction from ML model
    prediction_result = timing_predictor.predict(historical_data if historical_data else None)
    
    timing = TimingPrediction(
        optimal_posting_times=prediction_result["optimal_posting_times"],
        best_day=prediction_result["best_day"],
        best_hour=prediction_result["best_hour"]
    )
    
    prediction = Prediction(
        user_id=current_user.id,
        prediction_type="timing",
        optimal_posting_times=prediction_result["optimal_posting_times"],
        model_version="v1.0.0",
        model_name="timing_predictor"
    )
    
    db.add(prediction)
    await db.commit()
    await db.refresh(prediction)
    
    return PredictionResponse(
        id=prediction.id,
        prediction_type="timing",
        timing=timing,
        model_version=prediction.model_version,
        created_at=prediction.created_at
    )


@router.post("/offer", response_model=PredictionResponse)
async def recommend_offer(
    request: PredictionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Recommend optimal offer type for a post."""
    # Prepare post data for model
    post_data = {
        "caption": request.caption,
        "media_type": request.media_type,
        "offer_type": request.offer_type,
        "hashtags": request.hashtags
    }
    
    # Get recommendation from ML model
    recommendation = offer_recommender.recommend(post_data)
    
    offer = OfferRecommendation(
        recommended_offer_type=recommendation["recommended_offer_type"],
        rationale=recommendation["rationale"],
        expected_performance_improvement=recommendation["expected_performance_improvement"],
        suggested_copy=recommendation["suggested_copy"]
    )
    
    prediction = Prediction(
        user_id=current_user.id,
        prediction_type="offer",
        recommended_offer_type=offer.recommended_offer_type,
        offer_rationale=offer.rationale,
        model_version="v1.0.0",
        model_name="offer_recommender"
    )
    
    db.add(prediction)
    await db.commit()
    await db.refresh(prediction)
    
    return PredictionResponse(
        id=prediction.id,
        prediction_type="offer",
        offer=offer,
        model_version=prediction.model_version,
        created_at=prediction.created_at
    )


@router.post("/hashtags")
async def recommend_hashtags(
    request: PredictionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Recommend hashtags for a post."""
    # Prepare post data for model
    post_data = {
        "caption": request.caption,
        "media_type": request.media_type,
        "offer_type": request.offer_type,
        "hashtags": request.hashtags
    }
    
    # Get recommendation from ML model
    recommendation = hashtag_recommender.recommend(post_data)
    
    prediction = Prediction(
        user_id=current_user.id,
        prediction_type="hashtags",
        recommended_hashtags=recommendation["recommended_hashtags"],
        model_version="v1.0.0",
        model_name="hashtag_recommender"
    )
    
    db.add(prediction)
    await db.commit()
    await db.refresh(prediction)
    
    return {
        "recommended_hashtags": recommendation["recommended_hashtags"],
        "optimal_count": recommendation["optimal_count"],
        "existing_hashtags": recommendation["existing_hashtags"],
        "suggested_count": recommendation["suggested_count"],
        "rationale": recommendation["rationale"],
        "trending_hashtags": recommendation["trending_hashtags"]
    }


@router.post("/offer-options")
async def get_offer_options(
    request: PredictionRequest
):
    """Get multiple offer options with multi-tier revenue predictions (no auth for demo)."""

    # Prepare post data for model
    post_data = {
        "caption": request.caption or request.campaign_name or "",
        "media_type": request.media_type,
        "offer_type": request.offer_type,
        "hashtags": request.hashtags
    }

    # Get multiple offer recommendations
    offer_recommender = OfferRecommender()
    offer_options = offer_recommender.recommend_multiple(post_data)

    return {
        "offer_options": offer_options
    }


@router.get("/history", response_model=list[PredictionResponse])
async def get_prediction_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get prediction history for the current user."""
    result = await db.execute(
        select(Prediction).where(Prediction.user_id == current_user.id)
        .order_by(Prediction.created_at.desc())
        .limit(50)
    )
    predictions = result.scalars().all()
    
    return predictions
