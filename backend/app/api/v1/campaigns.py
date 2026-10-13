from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import re

from ...core.database import get_db
from ...models.campaign import Campaign
from ...schemas.campaign import CampaignCreate, CampaignResponse, CampaignListResponse
from datetime import datetime

router = APIRouter()


def generate_slug(campaign_name: str) -> str:
    """Generate a URL-safe slug from campaign name."""
    # Convert to lowercase, replace spaces with hyphens, remove special chars
    slug = re.sub(r'[^a-zA-Z0-9\s-]', '', campaign_name.lower())
    slug = re.sub(r'\s+', '-', slug).strip('-')
    return slug


@router.post("/create", response_model=CampaignResponse)
async def create_campaign(
    campaign_data: CampaignCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new marketing campaign with landing page."""
    # Generate slug from campaign name
    slug = generate_slug(campaign_data.campaign_name)

    # Check if slug already exists
    result = await db.execute(
        select(Campaign).where(Campaign.campaign_slug == slug)
    )
    existing = result.scalar_one_or_none()

    if existing:
        # Add timestamp to make it unique
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        slug = f"{slug}-{timestamp}"

    # Create campaign
    campaign = Campaign(
        campaign_name=campaign_data.campaign_name,
        campaign_slug=slug,
        selected_offer_type=campaign_data.selected_offer_type,
        offer_details=campaign_data.offer_details,
        landing_page_data={
            "title": campaign_data.campaign_name,
            "offer_type": campaign_data.selected_offer_type,
            "suggested_copy": campaign_data.suggested_copy,
            "created_at": datetime.now().isoformat()
        },
        is_active=True
    )

    db.add(campaign)
    await db.commit()
    await db.refresh(campaign)

    return CampaignResponse(
        id=campaign.id,
        campaign_name=campaign.campaign_name,
        campaign_slug=campaign.campaign_slug,
        selected_offer_type=campaign.selected_offer_type,
        landing_page_url=f"/campaigns/{campaign.campaign_slug}",
        created_at=campaign.created_at
    )


@router.get("/list", response_model=List[CampaignListResponse])
async def list_campaigns(
    db: AsyncSession = Depends(get_db)
):
    """List all campaigns."""
    result = await db.execute(
        select(Campaign).order_by(Campaign.created_at.desc())
    )
    campaigns = result.scalars().all()

    return [
        CampaignListResponse(
            id=c.id,
            campaign_name=c.campaign_name,
            campaign_slug=c.campaign_slug,
            selected_offer_type=c.selected_offer_type,
            landing_page_url=f"/campaigns/{c.campaign_slug}",
            is_active=c.is_active,
            created_at=c.created_at
        )
        for c in campaigns
    ]


@router.get("/{slug}", response_model=CampaignResponse)
async def get_campaign(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific campaign by slug."""
    result = await db.execute(
        select(Campaign).where(Campaign.campaign_slug == slug)
    )
    campaign = result.scalar_one_or_none()

    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )

    return CampaignResponse(
        id=campaign.id,
        campaign_name=campaign.campaign_name,
        campaign_slug=campaign.campaign_slug,
        selected_offer_type=campaign.selected_offer_type,
        landing_page_url=f"/campaigns/{campaign.campaign_slug}",
        created_at=campaign.created_at
    )


@router.delete("/{slug}")
async def delete_campaign(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    """Delete a campaign by slug."""
    result = await db.execute(
        select(Campaign).where(Campaign.campaign_slug == slug)
    )
    campaign = result.scalar_one_or_none()

    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )

    await db.delete(campaign)
    await db.commit()

    return {"message": "Campaign deleted successfully"}
