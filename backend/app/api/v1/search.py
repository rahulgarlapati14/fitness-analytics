from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Dict, Any
from ...services.openai_service import OpenAIService
from ...core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ...models.campaign import Campaign
from ...models.prediction import Prediction

router = APIRouter()


class SearchRequest(BaseModel):
    query: str


@router.post("/search")
async def search_content(
    request: SearchRequest,
    db: AsyncSession = Depends(get_db)
):
    """Search across campaigns and predictions using AI."""
    openai_service = OpenAIService()
    
    # Gather data to search
    campaigns_result = await db.execute(select(Campaign))
    campaigns = campaigns_result.scalars().all()
    
    predictions_result = await db.execute(select(Prediction))
    predictions = predictions_result.scalars().all()
    
    data = {
        "campaigns": [
            {
                "campaign_name": c.campaign_name,
                "selected_offer_type": c.selected_offer_type,
                "created_at": str(c.created_at)
            }
            for c in campaigns
        ],
        "predictions": [
            {
                "prediction_type": p.prediction_type,
                "created_at": str(p.created_at)
            }
            for p in predictions
        ]
    }
    
    result = await openai_service.search_content(request.query, data)
    
    return {
        "query": request.query,
        "answer": result
    }
