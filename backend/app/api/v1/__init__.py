from fastapi import APIRouter
from .auth import router as auth_router
from .instagram import router as instagram_router
from .predictions import router as predictions_router
from .campaigns import router as campaigns_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth_router, prefix="/auth", tags=["authentication"])
api_router.include_router(instagram_router, prefix="/instagram", tags=["instagram"])
api_router.include_router(predictions_router, prefix="/predict", tags=["predictions"])
api_router.include_router(campaigns_router, prefix="/campaigns", tags=["campaigns"])
