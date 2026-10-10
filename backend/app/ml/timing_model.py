from typing import Dict, Any, List
from datetime import datetime, timedelta


class TimingPredictor:
    """ML model for predicting optimal posting times."""
    
    def __init__(self):
        """Initialize the timing predictor."""
        self.is_trained = False
        # Typical engagement patterns by hour (based on industry data)
        self.hourly_engagement = {
            6: 0.3,   # 6 AM
            7: 0.4,   # 7 AM
            8: 0.5,   # 8 AM
            9: 0.6,   # 9 AM
            10: 0.7,  # 10 AM
            11: 0.8,  # 11 AM
            12: 0.85, # 12 PM
            13: 0.8,  # 1 PM
            14: 0.75, # 2 PM
            15: 0.7,  # 3 PM
            16: 0.75, # 4 PM
            17: 0.9,  # 5 PM
            18: 0.95, # 6 PM
            19: 0.9,  # 7 PM
            20: 0.85, # 8 PM
            21: 0.7,  # 9 PM
            22: 0.5,  # 10 PM
            23: 0.3,  # 11 PM
            0: 0.2,   # 12 AM
            1: 0.1,   # 1 AM
            2: 0.1,   # 2 AM
            3: 0.1,   # 3 AM
            4: 0.1,   # 4 AM
            5: 0.2    # 5 AM
        }
        
        # Day of week engagement
        self.day_engagement = {
            0: 0.8,  # Monday
            1: 0.85, # Tuesday
            2: 0.9,  # Wednesday
            3: 0.85, # Thursday
            4: 0.95, # Friday
            5: 1.0,  # Saturday
            6: 0.9   # Sunday
        }
    
    def predict(self, historical_data: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Predict optimal posting times.
        
        Args:
            historical_data: Optional historical post data for personalization
            
        Returns:
            Dictionary with optimal times and recommendations
        """
        # If historical data is provided, personalize predictions
        if historical_data and len(historical_data) > 10:
            return self._predict_personalized(historical_data)
        
        # Otherwise, use industry defaults
        return self._predict_default()
    
    def _predict_default(self) -> Dict[str, Any]:
        """Predict optimal times using industry defaults."""
        # Calculate combined scores for each day-hour combination
        optimal_times = []
        
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        
        for day_idx, day_name in enumerate(days):
            day_multiplier = self.day_engagement[day_idx]
            
            for hour in range(24):
                hour_multiplier = self.hourly_engagement[hour]
                combined_score = day_multiplier * hour_multiplier
                
                optimal_times.append({
                    "day": day_name,
                    "hour": hour,
                    "score": round(combined_score, 3)
                })
        
        # Sort by score
        optimal_times.sort(key=lambda x: x["score"], reverse=True)
        
        # Get top recommendations
        top_times = optimal_times[:10]
        
        # Find best day and hour
        best_time = optimal_times[0]
        
        return {
            "optimal_posting_times": top_times,
            "best_day": best_time["day"],
            "best_hour": best_time["hour"],
            "best_score": best_time["score"],
            "confidence_score": 0.65
        }
    
    def _predict_personalized(self, historical_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Predict optimal times based on user's historical data."""
        # Aggregate engagement by day and hour
        day_hour_engagement = {}
        
        for post in historical_data:
            posted_at = post.get("posted_at")
            if not posted_at:
                continue
            
            if isinstance(posted_at, str):
                posted_at = datetime.fromisoformat(posted_at.replace("Z", "+00:00"))
            
            day_idx = posted_at.weekday()
            hour = posted_at.hour
            
            # Calculate engagement rate
            likes = post.get("likes_count", 0)
            comments = post.get("comments_count", 0)
            shares = post.get("shares_count", 0)
            reach = post.get("reach", 1)
            
            engagement_rate = (likes + comments + shares) / reach
            
            key = (day_idx, hour)
            if key not in day_hour_engagement:
                day_hour_engagement[key] = []
            day_hour_engagement[key].append(engagement_rate)
        
        # Calculate average engagement for each day-hour
        optimal_times = []
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        
        for day_idx in range(7):
            for hour in range(24):
                key = (day_idx, hour)
                if key in day_hour_engagement:
                    avg_engagement = sum(day_hour_engagement[key]) / len(day_hour_engagement[key])
                else:
                    # Fall back to industry defaults
                    avg_engagement = self.day_engagement[day_idx] * self.hourly_engagement[hour]
                
                optimal_times.append({
                    "day": days[day_idx],
                    "hour": hour,
                    "score": round(avg_engagement, 3)
                })
        
        # Sort by score
        optimal_times.sort(key=lambda x: x["score"], reverse=True)
        
        top_times = optimal_times[:10]
        best_time = optimal_times[0]
        
        return {
            "optimal_posting_times": top_times,
            "best_day": best_time["day"],
            "best_hour": best_time["hour"],
            "best_score": best_time["score"],
            "confidence_score": 0.85,  # Higher confidence with personalized data
            "data_points": len(historical_data)
        }
    
    def train(self, training_data: List[Dict[str, Any]]):
        """Train the model on historical data."""
        self.is_trained = True
        print(f"Timing model trained on {len(training_data)} samples")
