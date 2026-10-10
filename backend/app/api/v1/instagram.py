from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta
from ...core.database import get_db
from ...models.user import User
from ...models.instagram import InstagramAccount
from ...models.post import Post
from ...schemas.instagram import InstagramAccount, InstagramAccountCreate
from ...api.deps import get_current_user
from ...services.instagram_service import InstagramService, InstagramOAuth
from typing import List

router = APIRouter()


@router.get("/auth-url")
async def get_instagram_auth_url():
    """Get Instagram OAuth authorization URL."""
    auth_url = InstagramOAuth.get_auth_url()
    return {"auth_url": auth_url}


@router.post("/callback")
async def instagram_callback(
    code: str = Query(...),
    db: AsyncSession = Depends(get_db)
):
    """Handle Instagram OAuth callback."""
    try:
        # Exchange code for short-lived token
        token_data = await InstagramOAuth.exchange_code_for_token(code)
        short_lived_token = token_data.get("access_token")
        user_id = token_data.get("user_id")
        
        # Exchange for long-lived token
        long_lived_data = await InstagramOAuth.get_long_lived_token(short_lived_token)
        long_lived_token = long_lived_data.get("access_token")
        expires_in = long_lived_data.get("expires_in", 5184000)  # Default 60 days
        
        # Calculate expiration date
        expires_at = datetime.utcnow() + timedelta(seconds=expires_in)
        
        # Get user info from Instagram
        instagram_service = InstagramService(long_lived_token)
        user_info = await instagram_service.get_user_info()
        await instagram_service.close()
        
        username = user_info.get("username")
        
        # Return account info (user will need to register/login first)
        return {
            "instagram_user_id": user_id,
            "username": username,
            "access_token": long_lived_token,
            "expires_at": expires_at.isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to complete Instagram OAuth: {str(e)}"
        )


@router.post("/connect", response_model=InstagramAccount, status_code=status.HTTP_201_CREATED)
async def connect_instagram(
    account_data: InstagramAccountCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Connect an Instagram account."""
    # Check if account already connected
    result = await db.execute(
        select(InstagramAccount).where(
            InstagramAccount.user_id == current_user.id,
            InstagramAccount.username == account_data.username
        )
    )
    existing_account = result.scalar_one_or_none()
    
    if existing_account:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Instagram account already connected"
        )
    
    # Create new Instagram account connection
    new_account = InstagramAccount(
        user_id=current_user.id,
        username=account_data.username,
        access_token=account_data.access_token,
        token_expires_at=account_data.token_expires_at
    )
    
    db.add(new_account)
    await db.commit()
    await db.refresh(new_account)
    
    return new_account


@router.get("/accounts", response_model=List[InstagramAccount])
async def list_accounts(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """List all connected Instagram accounts for the current user."""
    result = await db.execute(
        select(InstagramAccount).where(
            InstagramAccount.user_id == current_user.id,
            InstagramAccount.is_active == True
        )
    )
    accounts = result.scalars().all()
    return accounts


@router.post("/sync/{account_id}")
async def sync_posts(
    account_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Sync posts from Instagram account."""
    # Verify account ownership
    result = await db.execute(
        select(InstagramAccount).where(
            InstagramAccount.id == account_id,
            InstagramAccount.user_id == current_user.id
        )
    )
    account = result.scalar_one_or_none()
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Instagram account not found"
        )
    
    try:
        # Initialize Instagram service
        instagram_service = InstagramService(account.access_token)
        
        # Check if token is valid, refresh if needed
        if not await instagram_service.is_token_valid():
            new_token = await instagram_service.refresh_access_token()
            account.access_token = new_token
            await db.commit()
        
        # Fetch posts with insights
        posts_data = await instagram_service.get_all_posts_with_insights(limit=50)
        
        # Process and store posts
        synced_count = 0
        for post_data in posts_data:
            # Check if post already exists
            post_result = await db.execute(
                select(Post).where(Post.instagram_post_id == post_data.get("id"))
            )
            existing_post = post_result.scalar_one_or_none()
            
            if existing_post:
                # Update existing post
                existing_post.likes_count = post_data.get("like_count", 0)
                existing_post.comments_count = post_data.get("comments_count", 0)
                
                # Update insights if available
                insights = post_data.get("insights", {})
                existing_post.impressions = insights.get("impressions", 0)
                existing_post.reach = insights.get("reach", 0)
                existing_post.engagement_rate = insights.get("engagement", 0.0)
                
                existing_post.updated_at = datetime.utcnow()
            else:
                # Create new post
                new_post = Post(
                    instagram_account_id=account_id,
                    instagram_post_id=post_data.get("id"),
                    media_type=post_data.get("media_type"),
                    media_url=post_data.get("media_url"),
                    caption=post_data.get("caption"),
                    posted_at=datetime.fromisoformat(post_data.get("timestamp", "").replace("Z", "+00:00")) if post_data.get("timestamp") else None,
                    likes_count=post_data.get("like_count", 0),
                    comments_count=post_data.get("comments_count", 0)
                )
                
                # Add insights if available
                insights = post_data.get("insights", {})
                new_post.impressions = insights.get("impressions", 0)
                new_post.reach = insights.get("reach", 0)
                new_post.engagement_rate = insights.get("engagement", 0.0)
                
                db.add(new_post)
                synced_count += 1
        
        # Update last synced timestamp
        account.last_synced_at = datetime.utcnow()
        
        await db.commit()
        
        await instagram_service.close()
        
        return {
            "message": "Sync completed successfully",
            "account_id": account_id,
            "posts_synced": synced_count,
            "total_posts": len(posts_data)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to sync posts: {str(e)}"
        )
