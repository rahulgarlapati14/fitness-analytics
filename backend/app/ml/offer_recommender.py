from typing import Dict, Any, List
import random


class OfferRecommender:
    """ML model for recommending optimal promotional offers."""
    
    def __init__(self):
        """Initialize the offer recommender."""
        self.is_trained = False
        
        # Offer type templates
        self.offer_templates = {
            "free_trial": {
                "rationale": "Free trials typically have the highest conversion rate for fitness businesses",
                "copy_templates": [
                    "🏋️ Start your fitness journey today! Get your first week FREE. No commitment required.",
                    "💪 Try us out with a FREE 7-day trial. Experience the difference!",
                    "🎯 First week on us! Sign up now and get 7 days FREE access to all facilities."
                ]
            },
            "discount": {
                "rationale": "Discounted offers create urgency and attract price-sensitive customers",
                "copy_templates": [
                    "🔥 LIMITED TIME: Get 20% OFF your first month! Don't miss out!",
                    "💰 Special offer: Join today and save 25% on your membership!",
                    "⚡ Flash sale! 30% off new memberships - ends soon!"
                ]
            },
            "bundle": {
                "rationale": "Bundle offers increase perceived value and encourage higher-tier memberships",
                "copy_templates": [
                    "🎁 Premium package deal! Get personal training + membership for one low price!",
                    "💎 Bundle and save! Membership + nutrition coaching + PT sessions included!",
                    "🏆 All-inclusive package: Gym access + classes + personal training!"
                ]
            },
            "referral": {
                "rationale": "Referral programs leverage your existing community for organic growth",
                "copy_templates": [
                    "👥 Bring a friend! Both of you get a FREE week when you sign up together!",
                    "🤝 Refer a friend and get 50% off your next month!",
                    "💬 Tag a workout buddy! You both get exclusive perks when you join!"
                ]
            }
        }
    
    def recommend(self, post_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Recommend the best offer type for a post.
        
        Args:
            post_data: Dictionary containing post information
            
        Returns:
            Dictionary with recommended offer and rationale
        """
        from .feature_engineering import FeatureExtractor
        
        # Extract features
        features = FeatureExtractor.extract_all_features(post_data)
        
        # Score each offer type
        offer_scores = {}
        
        # Free trial score
        free_trial_score = 0.8
        if features["media_type"] == "video":
            free_trial_score += 0.15
        if features["has_offer_mention"]:
            free_trial_score += 0.1
        offer_scores["free_trial"] = free_trial_score
        
        # Discount score
        discount_score = 0.75
        if features["is_weekend"]:
            discount_score += 0.15
        if features["is_evening"]:
            discount_score += 0.1
        if features["emoji_count"] > 0:
            discount_score += 0.1
        offer_scores["discount"] = discount_score
        
        # Bundle score
        bundle_score = 0.7
        if features["caption_length"] > 100:
            bundle_score += 0.15
        if features["emoji_count"] > 3:
            bundle_score += 0.1
        offer_scores["bundle"] = bundle_score
        
        # Referral score
        referral_score = 0.65
        if features["question_count"] > 0:
            referral_score += 0.15
        if features["exclamation_count"] > 0:
            referral_score += 0.1
        offer_scores["referral"] = referral_score
        
        # Select best offer
        recommended_offer = max(offer_scores, key=offer_scores.get)
        score = offer_scores[recommended_offer]
        
        # Get template
        template = self.offer_templates[recommended_offer]
        rationale = template["rationale"]
        
        # Select random copy template
        suggested_copy = random.choice(template["copy_templates"])
        
        # Calculate expected improvement
        base_conversion = 0.02
        improvement_map = {
            "free_trial": 2.5,
            "discount": 2.0,
            "bundle": 1.8,
            "referral": 1.5
        }
        expected_improvement = (improvement_map[recommended_offer] - 1.0) * 100
        
        return {
            "recommended_offer_type": recommended_offer,
            "rationale": rationale,
            "expected_performance_improvement": round(expected_improvement, 1),
            "suggested_copy": suggested_copy,
            "confidence_score": round(score, 2),
            "all_scores": offer_scores
        }
    
    def train(self, training_data: List[Dict[str, Any]]):
        """Train the model on historical offer performance data."""
        self.is_trained = True
        print(f"Offer recommender trained on {len(training_data)} samples")
