import re
from typing import Dict, List, Any
from datetime import datetime
import json


class FeatureExtractor:
    """Extract features from Instagram post data for ML models."""
    
    @staticmethod
    def extract_text_features(caption: str) -> Dict[str, Any]:
        """Extract features from caption text."""
        if not caption:
            return {
                "caption_length": 0,
                "word_count": 0,
                "hashtag_count": 0,
                "emoji_count": 0,
                "question_count": 0,
                "exclamation_count": 0,
                "has_offer_mention": False
            }
        
        # Basic counts
        caption_length = len(caption)
        word_count = len(caption.split())
        
        # Hashtag extraction
        hashtags = re.findall(r'#\w+', caption)
        hashtag_count = len(hashtags)
        
        # Emoji extraction (basic)
        emoji_pattern = re.compile(
            "["
            "\U0001F600-\U0001F64F"  # emoticons
            "\U0001F300-\U0001F5FF"  # symbols & pictographs
            "\U0001F680-\U0001F6FF"  # transport & map symbols
            "\U0001F1E0-\U0001F1FF"  # flags
            "\U00002702-\U000027B0"
            "\U000024C2-\U0001F251"
            "]+",
            flags=re.UNICODE
        )
        emojis = emoji_pattern.findall(caption)
        emoji_count = len(emojis)
        
        # Punctuation counts
        question_count = caption.count('?')
        exclamation_count = caption.count('!')
        
        # Offer detection
        offer_keywords = ['offer', 'discount', 'deal', 'sale', 'free', 'trial', 'promo', 'save']
        has_offer_mention = any(keyword in caption.lower() for keyword in offer_keywords)
        
        return {
            "caption_length": caption_length,
            "word_count": word_count,
            "hashtag_count": hashtag_count,
            "emoji_count": emoji_count,
            "question_count": question_count,
            "exclamation_count": exclamation_count,
            "has_offer_mention": has_offer_mention,
            "hashtags": hashtags
        }
    
    @staticmethod
    def extract_temporal_features(posted_at: datetime) -> Dict[str, Any]:
        """Extract temporal features from post timestamp."""
        if not posted_at:
            return {
                "hour_of_day": 0,
                "day_of_week": 0,
                "is_weekend": False,
                "is_morning": False,
                "is_afternoon": False,
                "is_evening": False
            }
        
        hour_of_day = posted_at.hour
        day_of_week = posted_at.weekday()  # 0 = Monday, 6 = Sunday
        is_weekend = day_of_week >= 5  # Saturday or Sunday
        
        # Time of day categorization
        is_morning = 6 <= hour_of_day < 12
        is_afternoon = 12 <= hour_of_day < 17
        is_evening = 17 <= hour_of_day < 22
        
        return {
            "hour_of_day": hour_of_day,
            "day_of_week": day_of_week,
            "is_weekend": is_weekend,
            "is_morning": is_morning,
            "is_afternoon": is_afternoon,
            "is_evening": is_evening
        }
    
    @staticmethod
    def extract_engagement_features(
        likes: int,
        comments: int,
        shares: int,
        impressions: int,
        reach: int
    ) -> Dict[str, Any]:
        """Calculate engagement-based features."""
        if reach == 0:
            engagement_rate = 0.0
        else:
            engagement_rate = (likes + comments + shares) / reach
        
        if impressions == 0:
            like_rate = 0.0
            comment_rate = 0.0
        else:
            like_rate = likes / impressions
            comment_rate = comments / impressions
        
        return {
            "engagement_rate": engagement_rate,
            "like_rate": like_rate,
            "comment_rate": comment_rate,
            "total_engagement": likes + comments + shares,
            "likes": likes,
            "comments": comments,
            "shares": shares,
            "impressions": impressions,
            "reach": reach
        }
    
    @staticmethod
    def extract_all_features(post_data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract all features from post data."""
        features = {}
        
        # Text features
        caption = post_data.get("caption", "")
        text_features = FeatureExtractor.extract_text_features(caption)
        features.update(text_features)
        
        # Temporal features
        posted_at = post_data.get("posted_at")
        if isinstance(posted_at, str):
            posted_at = datetime.fromisoformat(posted_at.replace("Z", "+00:00"))
        temporal_features = FeatureExtractor.extract_temporal_features(posted_at)
        features.update(temporal_features)
        
        # Engagement features
        engagement_features = FeatureExtractor.extract_engagement_features(
            likes=post_data.get("likes_count", 0),
            comments=post_data.get("comments_count", 0),
            shares=post_data.get("shares_count", 0),
            impressions=post_data.get("impressions", 0),
            reach=post_data.get("reach", 0)
        )
        features.update(engagement_features)
        
        # Media type
        features["media_type"] = post_data.get("media_type", "image")
        
        # Offer type
        features["offer_type"] = post_data.get("offer_type", "none")
        
        return features
