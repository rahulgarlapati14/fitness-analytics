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

export interface PredictionResponse {
  id: number;
  prediction_type: string;
  engagement?: EngagementPrediction;
  conversion?: ConversionPrediction;
  timing?: TimingPrediction;
  offer?: OfferRecommendation;
  model_version: string;
  created_at: string;
}

export interface PredictionRequest {
  caption?: string;
  media_type?: string;
  offer_type?: string;
  hashtags?: string[];
}
