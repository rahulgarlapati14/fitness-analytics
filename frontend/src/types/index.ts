export interface User {
  id: number;
  email: string;
  gym_name: string;
  full_name: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
}

export interface InstagramAccount {
  id: number;
  instagram_user_id?: string;
  username: string;
  is_active: boolean;
  last_synced_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface EngagementPrediction {
  predicted_likes: number;
  predicted_comments: number;
  predicted_shares: number;
  predicted_engagement_rate: number;
  confidence_score: number;
}

export interface ConversionPrediction {
  predicted_conversions: number;
  probability: number;
  confidence_score: number;
}

export interface TimingPrediction {
  optimal_posting_times: Array<{
    day: string;
    hour: number;
    score: number;
  }>;
  best_day: string;
  best_hour: number;
}

export interface OfferRecommendation {
  recommended_offer_type: string;
  rationale: string;
  expected_performance_improvement: number;
  suggested_copy?: string;
}

export interface HashtagRecommendation {
  recommended_hashtags: string[];
  optimal_count: number;
  existing_hashtags: string[];
  suggested_count: number;
  rationale: string;
  trending_hashtags: string[];
}

export interface PredictionResponse {
  id: number;
  prediction_type: string;
  engagement?: EngagementPrediction;
  conversion?: ConversionPrediction;
  timing?: TimingPrediction;
  offer?: OfferRecommendation;
  hashtags?: HashtagRecommendation;
  model_version: string;
  created_at: string;
}

export interface PredictionRequest {
  caption?: string;
  media_type?: string;
  offer_type?: string;
  hashtags?: string[];
  campaign_name?: string;
}

export interface TierPrediction {
  tier: string;
  price: number;
  conversions: number;
  revenue: number;
}

export interface OfferOption {
  offer_type: string;
  rationale: string;
  suggested_copy: string;
  confidence_score: number;
  tier_predictions: TierPrediction[];
  total_expected_revenue: number;
}

export interface CampaignCreate {
  campaign_name: string;
  selected_offer_type: string;
  offer_details: any;
  suggested_copy: string;
}

export interface CampaignResponse {
  id: number;
  campaign_name: string;
  campaign_slug: string;
  selected_offer_type: string;
  landing_page_url: string;
  created_at: string;
}

export interface CampaignListResponse {
  id: number;
  campaign_name: string;
  campaign_slug: string;
  selected_offer_type: string;
  landing_page_url: string;
  is_active: boolean;
  created_at: string;
}
