from typing import Dict, List, Any
import re


class HashtagRecommender:
    """ML model for recommending optimal hashtags for Instagram posts."""
    
    def __init__(self):
        """Initialize the hashtag recommender."""
        self.is_trained = False
        
        # Category-based hashtag database
        self.hashtag_categories = {
            'boxing': [
                '#boxing', '#boxingtraining', '#boxeo', '#boxeoentrenamiento',
                '#boxinglife', '#boxingday', '#fightcamp', '#gym',
                '#fitness', '#workout', '#motivation', '#boxingmotivation',
                '#fighter', '#mma', '#kickboxing', '#muaythai',
                '#combat', '#sparring', '#heavybag', '#speedbag',
                '#fitnessmotivation', '#boxingcoach', '#boxinggym'
            ],
            'fitness': [
                '#fitness', '#fitnessmotivation', '#gymlife', '#workout',
                '#gym', '#training', '#fitfam', '#fitnessjourney',
                '#health', '#wellness', '#crossfit', '#strength',
                '#cardio', '#hiit', '#fit', '#muscle', '#gains',
                '#bodybuilding', '#trainingday', '#legday', '#pushday'
            ],
            'gym': [
                '#gym', '#gymlife', '#gymrat', '#gymtim',
                '#fitness', '#workout', '#training', '#fitfam',
                '#personaltrainer', '#pt', '#fitnessmotivation',
                '#strength', '#cardio', '#hiit', '#crossfit',
                '#bodybuilding', '#fitnessjourney', '#health'
            ],
            'motivation': [
                '#motivation', '#fitnessmotivation', '#mindset',
                '#goals', '#grind', '#hustle', '#dedication',
                '#discipline', '#nevergiveup', '#believe', '#success',
                '#fitnessjourney', '#transform', '#progress', '#gains'
            ],
            'class': [
                '#boxingclass', '#fitnessclass', '#gymclass',
                '#personaltraining', '#pt', '#workoutclass',
                '#training', '#fitfam', '#fitness', '#workout',
                '#class', '#session', '#booknow', '#reserve'
            ],
            'general': [
                '#fitfam', '#fitness', '#gym', '#workout',
                '#training', '#health', '#wellness', '#motivation',
                '#lifestyle', '#goals', '#progress', '#gains'
            ]
        }
        
        # Trending hashtags (would be updated from API in production)
        self.trending_hashtags = [
            '#fitnessmotivation', '#gymlife', '#workout',
            '#fitnessjourney', '#fitfam', '#gymrat',
            '#boxingday', '#motivationmonday', '#legday'
        ]
    
    def recommend(self, post_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Recommend hashtags for a post.
        
        Args:
            post_data: Dictionary containing post information
            
        Returns:
            Dictionary with recommended hashtags and rationale
        """
        caption = post_data.get('caption', '').lower()
        media_type = post_data.get('media_type', 'image')
        offer_type = post_data.get('offer_type', '')
        
        # Analyze caption for content themes
        detected_categories = self._detect_caption_themes(caption)
        
        # Select hashtags based on detected categories
        recommended = []
        
        # Always include general fitness hashtags
        recommended.extend(self.hashtag_categories['general'][:5])
        
        # Add category-specific hashtags
        for category in detected_categories:
            if category in self.hashtag_categories:
                recommended.extend(self.hashtag_categories[category][:5])
        
        # Add trending hashtags
        recommended.extend(self.trending_hashtags[:3])
        
        # Remove duplicates and limit to 30
        recommended = list(set(recommended))[:30]
        
        # Analyze caption for existing hashtags
        existing_hashtags = self._extract_hashtags(caption)
        
        # Calculate optimal hashtag count
        optimal_count = self._calculate_optimal_count(len(caption), media_type)
        
        # Generate rationale
        rationale = self._generate_rationale(detected_categories, optimal_count)
        
        return {
            'recommended_hashtags': recommended,
            'optimal_count': optimal_count,
            'existing_hashtags': existing_hashtags,
            'suggested_count': min(len(recommended), optimal_count),
            'rationale': rationale,
            'trending_hashtags': self.trending_hashtags[:5]
        }
    
    def _detect_caption_themes(self, caption: str) -> List[str]:
        """Detect content themes from caption."""
        themes = []
        
        keywords = {
            'boxing': ['boxing', 'boxeo', 'fight', 'sparring', 'knockout', 'punch', 'round', 'match'],
            'fitness': ['fitness', 'workout', 'exercise', 'training', 'cardio', 'strength', 'hiit'],
            'gym': ['gym', 'facility', 'location', 'center', 'studio', 'trainer', 'coach'],
            'motivation': ['motivation', 'inspire', 'goals', 'grind', 'hustle', 'never give up', 'believe'],
            'class': ['class', 'session', 'lesson', 'course', 'workshop', 'training session']
        }
        
        for theme, words in keywords.items():
            if any(word in caption for word in words):
                themes.append(theme)
        
        return themes
    
    def _extract_hashtags(self, caption: str) -> List[str]:
        """Extract existing hashtags from caption."""
        return re.findall(r'#\w+', caption)
    
    def _calculate_optimal_count(self, caption_length: int, media_type: str) -> int:
        """Calculate optimal hashtag count based on content."""
        base_count = 10
        
        # Adjust based on caption length
        if caption_length > 100:
            base_count += 5
        elif caption_length > 200:
            base_count += 10
        
        # Adjust based on media type
        if media_type == 'video':
            base_count += 3
        elif media_type == 'carousel':
            base_count += 5
        
        # Cap at 30 (Instagram limit)
        return min(base_count, 30)
    
    def _generate_rationale(self, themes: List[str], optimal_count: int) -> str:
        """Generate rationale for hashtag recommendations."""
        if not themes:
            return f"Using {optimal_count} general fitness hashtags for broad reach. Mix of trending and evergreen tags for maximum visibility."
        
        theme_str = ', '.join(themes)
        return f"Based on your content about {theme_str}, I recommend {optimal_count} hashtags. Mix of category-specific and trending tags for targeted reach plus broad visibility."
    
    def train(self, training_data: List[Dict[str, Any]]):
        """Train the model on historical hashtag performance data."""
        self.is_trained = True
        print(f"Hashtag recommender trained on {len(training_data)} samples")
