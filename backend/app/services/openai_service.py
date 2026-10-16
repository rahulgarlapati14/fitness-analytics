from typing import Dict, Any, List
from openai import AsyncOpenAI
from ..core.config import settings


class OpenAIService:
    """Service for OpenAI API calls."""
    
    def __init__(self):
        self.client = None
        if settings.OPENAI_API_KEY:
            self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    
    async def generate_offer_prediction(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate offer prediction using OpenAI."""
        if not self.client:
            # Fallback to heuristic if no API key
            return self._heuristic_prediction(context)
        
        try:
            prompt = f"""
            You are a fitness marketing AI assistant. Analyze this context and recommend the best promotional offer.
            
            Campaign Context:
            - Campaign Name: {context.get('campaign_name', '')}
            - Caption: {context.get('caption', '')}
            - Media Type: {context.get('media_type', 'image')}
            
            Provide 3 offer options with:
            1. Offer type (discount, free_trial, bundle, referral)
            2. Rationale (why this offer works)
            3. Suggested copy (engaging Instagram caption)
            4. Expected conversions for each tier (day_pass, monthly_pass, three_month_pass)
            5. Expected revenue for each tier
            
            Return as JSON with this structure:
            {{
                "offer_options": [
                    {{
                        "offer_type": "discount",
                        "rationale": "...",
                        "suggested_copy": "...",
                        "confidence_score": 0.8,
                        "tier_predictions": [
                            {{"tier": "day_pass", "price": 15, "conversions": 250, "revenue": 3750}},
                            {{"tier": "monthly_pass", "price": 50, "conversions": 250, "revenue": 12500}},
                            {{"tier": "three_month_pass", "price": 120, "conversions": 250, "revenue": 30000}}
                        ],
                        "total_expected_revenue": 46250
                    }}
                ]
            }}
            """
            
            response = await self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "You are a fitness marketing expert specializing in gym promotions."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            
            import json
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return self._heuristic_prediction(context)
    
    def _heuristic_prediction(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback heuristic prediction when OpenAI is unavailable."""
        return {
            "offer_options": [
                {
                    "offer_type": "discount",
                    "rationale": "Discounted offers create urgency and attract price-sensitive customers",
                    "suggested_copy": "🔥 LIMITED TIME: Get 20% OFF your first month! Don't miss out!",
                    "confidence_score": 0.75,
                    "tier_predictions": [
                        {"tier": "day_pass", "price": 15, "conversions": 250, "revenue": 3750},
                        {"tier": "monthly_pass", "price": 50, "conversions": 250, "revenue": 12500},
                        {"tier": "three_month_pass", "price": 120, "conversions": 250, "revenue": 30000}
                    ],
                    "total_expected_revenue": 46250
                },
                {
                    "offer_type": "free_trial",
                    "rationale": "Free trials typically have the highest conversion rate for fitness businesses",
                    "suggested_copy": "💪 Try us out with a FREE 7-day trial. Experience the difference!",
                    "confidence_score": 0.9,
                    "tier_predictions": [
                        {"tier": "day_pass", "price": 15, "conversions": 300, "revenue": 4500},
                        {"tier": "monthly_pass", "price": 50, "conversions": 300, "revenue": 15000},
                        {"tier": "three_month_pass", "price": 120, "conversions": 300, "revenue": 36000}
                    ],
                    "total_expected_revenue": 55500
                },
                {
                    "offer_type": "bundle",
                    "rationale": "Bundle offers increase perceived value and encourage higher-tier memberships",
                    "suggested_copy": "🏆 All-inclusive package: Gym access + classes + personal training!",
                    "confidence_score": 0.7,
                    "tier_predictions": [
                        {"tier": "day_pass", "price": 15, "conversions": 200, "revenue": 3000},
                        {"tier": "monthly_pass", "price": 50, "conversions": 200, "revenue": 10000},
                        {"tier": "three_month_pass", "price": 120, "conversions": 200, "revenue": 24000}
                    ],
                    "total_expected_revenue": 37000
                }
            ]
        }
    
    async def search_content(self, query: str, data: Dict[str, Any]) -> str:
        """Search and summarize content using OpenAI."""
        if not self.client:
            return self._simple_search(query, data)
        
        try:
            prompt = f"""
            Search this data and answer the user's question.
            
            User Question: {query}
            
            Available Data:
            {str(data)}
            
            Provide a helpful, concise answer.
            """
            
            response = await self.client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "You are a helpful fitness analytics assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"OpenAI search error: {e}")
            return self._simple_search(query, data)
    
    def _simple_search(self, query: str, data: Dict[str, Any]) -> str:
        """Simple keyword-based search when OpenAI is unavailable."""
        query_lower = query.lower()
        results = []
        
        # Search in campaigns
        if 'campaigns' in data:
            for campaign in data['campaigns']:
                if query_lower in campaign.get('campaign_name', '').lower():
                    results.append(f"Campaign: {campaign['campaign_name']} - {campaign['selected_offer_type']}")
        
        # Search in predictions
        if 'predictions' in data:
            for pred in data['predictions']:
                if query_lower in str(pred).lower():
                    results.append(f"Prediction: {pred.get('prediction_type', 'N/A')}")
        
        if results:
            return "Found: " + "\n".join(results[:5])
        else:
            return f"No results found for '{query}'. Try searching for campaign names or prediction types."
