import httpx
from typing import Optional, Dict, List, Any
from datetime import datetime, timedelta
from ..core.config import settings


class InstagramService:
    """Service for interacting with Instagram Graph API."""
    
    BASE_URL = "https://graph.instagram.com"
    
    def __init__(self, access_token: str):
        self.access_token = access_token
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()
    
    async def get_user_info(self) -> Dict[str, Any]:
        """Get basic user information."""
        url = f"{self.BASE_URL}/me"
        params = {
            "fields": "id,username,account_type,media_count",
            "access_token": self.access_token
        }
        
        response = await self.client.get(url, params=params)
        response.raise_for_status()
        return response.json()
    
    async def get_media(
        self,
        limit: int = 25,
        fields: str = "id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count"
    ) -> List[Dict[str, Any]]:
        """Get user's media posts."""
        url = f"{self.BASE_URL}/me/media"
        params = {
            "fields": fields,
            "limit": limit,
            "access_token": self.access_token
        }
        
        response = await self.client.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        return data.get("data", [])
    
    async def get_media_insights(
        self,
        media_id: str,
        metrics: str = "engagement,impressions,reach,saved"
    ) -> Dict[str, Any]:
        """Get insights for a specific media post."""
        url = f"{self.BASE_URL}/{media_id}/insights"
        params = {
            "metric": metrics,
            "access_token": self.access_token
        }
        
        response = await self.client.get(url, params=params)
        response.raise_for_status()
        return response.json()
    
    async def get_all_posts_with_insights(
        self,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """Get all posts with their insights."""
        # Get media
        media_list = await self.get_media(limit=limit)
        
        posts_with_insights = []
        
        for media in media_list:
            media_id = media.get("id")
            
            # Get insights for each post
            try:
                insights = await self.get_media_insights(media_id)
                
                # Parse insights
                insights_data = {}
                for insight in insights.get("data", []):
                    metric_name = insight.get("name")
                    values = insight.get("values", [])
                    if values:
                        insights_data[metric_name] = values[0].get("value")
                
                # Combine media and insights
                post_data = {
                    **media,
                    "insights": insights_data
                }
                
                posts_with_insights.append(post_data)
                
            except Exception as e:
                print(f"Error fetching insights for media {media_id}: {e}")
                posts_with_insights.append(media)
        
        return posts_with_insights
    
    async def refresh_access_token(self) -> str:
        """Refresh the long-lived access token."""
        url = f"{self.BASE_URL}/refresh_access_token"
        params = {
            "grant_type": "ig_refresh_token",
            "access_token": self.access_token
        }
        
        response = await self.client.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        return data.get("access_token", self.access_token)
    
    async def is_token_valid(self) -> bool:
        """Check if the access token is valid."""
        try:
            await self.get_user_info()
            return True
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 401:
                return False
            raise


class InstagramOAuth:
    """Handle Instagram OAuth flow."""
    
    AUTH_URL = "https://api.instagram.com/oauth/authorize"
    TOKEN_URL = "https://api.instagram.com/oauth/access_token"
    
    @staticmethod
    def get_auth_url() -> str:
        """Generate the authorization URL."""
        params = {
            "client_id": settings.INSTAGRAM_CLIENT_ID,
            "redirect_uri": settings.INSTAGRAM_REDIRECT_URI,
            "scope": "user_profile,user_media",
            "response_type": "code"
        }
        
        # Build URL with params
        param_str = "&".join([f"{k}={v}" for k, v in params.items()])
        return f"{InstagramOAuth.AUTH_URL}?{param_str}"
    
    @staticmethod
    async def exchange_code_for_token(code: str) -> Dict[str, Any]:
        """Exchange authorization code for access token."""
        async with httpx.AsyncClient() as client:
            data = {
                "client_id": settings.INSTAGRAM_CLIENT_ID,
                "client_secret": settings.INSTAGRAM_CLIENT_SECRET,
                "grant_type": "authorization_code",
                "redirect_uri": settings.INSTAGRAM_REDIRECT_URI,
                "code": code
            }
            
            response = await client.post(InstagramOAuth.TOKEN_URL, data=data)
            response.raise_for_status()
            return response.json()
    
    @staticmethod
    async def get_long_lived_token(short_lived_token: str) -> Dict[str, Any]:
        """Exchange short-lived token for long-lived token."""
        url = f"{InstagramService.BASE_URL}/access_token"
        params = {
            "grant_type": "ig_exchange_token",
            "client_secret": settings.INSTAGRAM_CLIENT_SECRET,
            "access_token": short_lived_token
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            return response.json()
