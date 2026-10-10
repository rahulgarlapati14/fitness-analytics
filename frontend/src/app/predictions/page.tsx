'use client';

import { useState } from 'react';
import { predictionAPI } from '@/services/api';

export default function PredictionsPage() {
  const [activeTab, setActiveTab] = useState('engagement');
  const [caption, setCaption] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [offerType, setOfferType] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [demoMode, setDemoMode] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      let response;
      if (activeTab === 'engagement') {
        response = await predictionAPI.predictEngagement({ caption, media_type: mediaType, offer_type: offerType });
      } else if (activeTab === 'conversion') {
        response = await predictionAPI.predictConversion({ caption, media_type: mediaType, offer_type: offerType });
      } else if (activeTab === 'timing') {
        response = await predictionAPI.predictTiming();
      } else if (activeTab === 'offer') {
        response = await predictionAPI.recommendOffer({ caption, media_type: mediaType, offer_type: offerType });
      }

      if (response) {
        setResult(response.data);
      }
    } catch (error: any) {
      console.error('Prediction failed:', error);
      alert('Prediction failed. Using demo mode instead.');
      // Fallback to demo mode
      generateDemoPrediction();
    } finally {
      setLoading(false);
    }
  };

  const generateDemoPrediction = () => {
    // Randomize demo data for variety
    const randomMultiplier = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    const likes = Math.floor(2000 * randomMultiplier);
    const comments = Math.floor(150 * randomMultiplier);
    const shares = Math.floor(80 * randomMultiplier);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const randomDay = days[Math.floor(Math.random() * days.length)];
    const randomHour = Math.floor(Math.random() * 12) + 9; // 9 AM to 8 PM

    const offers = ['free_trial', 'discount', 'bundle', 'referral'];
    const offerTypes = ['Free Trial', 'Discount', 'Bundle Deal', 'Referral Program'];
    const randomOfferIndex = Math.floor(Math.random() * offers.length);

    const captions = [
      '🥊 Ready to transform? Try our FREE trial week! Experience world-class boxing training, expert coaching, and an unbeatable community atmosphere. No commitment required. DM us "FREE TRIAL" to claim your spot! #Boxing #Fitness #Trial',
      '💪 New class starting Monday! Join our elite boxing program and train like a champion. Limited spots available - DM to reserve yours now! #BoxingTraining #FitnessGoals',
      '🏆 Train with the best! Our boxing gym offers world-class coaching, state-of-the-art equipment, and a supportive community. Sign up today and get your first week FREE! #BoxingLife #GymMotivation',
      '🥇 Transform your fitness journey! Our boxing classes combine strength training, cardio, and technique work. Perfect for all skill levels. Drop in this week! #Boxing #MMA #Workout'
    ];
    const randomCaption = captions[Math.floor(Math.random() * captions.length)];

    const rationales = [
      'Boxing gyms benefit most from free trial offers as they let potential members experience the training intensity and community atmosphere before committing.',
      'Discount offers create urgency and attract price-sensitive customers who might otherwise hesitate to join.',
      'Bundle deals increase perceived value and encourage higher-tier memberships by combining multiple services.',
      'Referral programs leverage your existing community for organic growth through word-of-mouth marketing.'
    ];

    const demoData = {
      engagement: {
        predicted_likes: likes,
        predicted_comments: comments,
        predicted_shares: shares,
        predicted_engagement_rate: 0.08 + Math.random() * 0.02,
        confidence_score: 0.75 + Math.random() * 0.15
      },
      conversion: {
        predicted_conversions: Math.floor(15 * randomMultiplier),
        probability: 0.25 + Math.random() * 0.15,
        confidence_score: 0.70 + Math.random() * 0.15
      },
      timing: {
        optimal_posting_times: [
          { day: randomDay, hour: randomHour, score: 0.95 },
          { day: days[(days.indexOf(randomDay) + 1) % 7], hour: randomHour, score: 0.90 },
          { day: days[(days.indexOf(randomDay) + 2) % 7], hour: randomHour + 1, score: 0.85 },
          { day: days[(days.indexOf(randomDay) + 3) % 7], hour: randomHour, score: 0.80 },
          { day: days[(days.indexOf(randomDay) + 4) % 7], hour: randomHour - 1, score: 0.75 }
        ],
        best_day: randomDay,
        best_hour: randomHour
      },
      offer: {
        recommended_offer_type: offers[randomOfferIndex],
        rationale: rationales[randomOfferIndex],
        expected_performance_improvement: Math.floor(100 + Math.random() * 100),
        suggested_copy: randomCaption
      }
    };

    setResult(demoData);
  };

  const handleQuickDemo = () => {
    setLoading(true);
    setDemoMode(true);
    // Set demo caption based on boxing gym content
    setCaption('🥊 New boxing class starting this week! Join our elite training program and take your skills to the next level. DM to reserve your spot! #Boxing #MMA #Fitness');
    setMediaType('video');
    setOfferType('free_trial');

    // Simulate brief loading for effect
    setTimeout(() => {
      generateDemoPrediction();
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Predictions</h1>
            <p className="text-gray-600 mt-2">AI-powered insights for your Instagram posts</p>
          </div>
          <button
            onClick={handleQuickDemo}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            🥊 Quick Demo: Boxing Gym
          </button>
        </div>

        <div className="flex space-x-4 border-b border-gray-200">
          {['engagement', 'conversion', 'timing', 'offer'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab !== 'timing' && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your Instagram caption..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="carousel">Carousel</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Offer Type (Optional)</label>
              <select
                value={offerType}
                onChange={(e) => setOfferType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">None</option>
                <option value="free_trial">Free Trial</option>
                <option value="discount">Discount</option>
                <option value="bundle">Bundle</option>
                <option value="referral">Referral</option>
              </select>
            </div>

            <button
              onClick={handlePredict}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Get Prediction'}
            </button>
          </div>
        )}

        {activeTab === 'timing' && (
          <div className="bg-white rounded-lg shadow p-6">
            <button
              onClick={handlePredict}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Get Optimal Posting Times'}
            </button>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Prediction Results</h2>

            {activeTab === 'engagement' && result.engagement && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Predicted Likes</p>
                    <p className="text-2xl font-bold text-blue-600">{result.engagement.predicted_likes.toFixed(0)}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Predicted Comments</p>
                    <p className="text-2xl font-bold text-green-600">{result.engagement.predicted_comments.toFixed(0)}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Predicted Shares</p>
                    <p className="text-2xl font-bold text-purple-600">{result.engagement.predicted_shares.toFixed(0)}</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Engagement Rate</p>
                  <p className="text-xl font-bold text-gray-900">{(result.engagement.predicted_engagement_rate * 100).toFixed(2)}%</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Confidence Score</p>
                  <p className="font-semibold text-gray-900">{(result.engagement.confidence_score * 100).toFixed(0)}%</p>
                </div>
              </div>
            )}

            {activeTab === 'conversion' && result.conversion && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Predicted Conversions</p>
                  <p className="text-2xl font-bold text-blue-600">{result.conversion.predicted_conversions.toFixed(0)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Conversion Probability</p>
                  <p className="text-2xl font-bold text-green-600">{(result.conversion.probability * 100).toFixed(1)}%</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Confidence Score</p>
                  <p className="font-semibold text-gray-900">{(result.conversion.confidence_score * 100).toFixed(0)}%</p>
                </div>
              </div>
            )}

            {activeTab === 'timing' && result.timing && (
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Best Day</p>
                  <p className="text-2xl font-bold text-purple-600">{result.timing.best_day}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Best Hour</p>
                  <p className="text-2xl font-bold text-blue-600">{result.timing.best_hour}:00</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Top 5 Optimal Times</p>
                  <div className="space-y-2">
                    {result.timing.optimal_posting_times.slice(0, 5).map((time: any, index: number) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <span>{time.day} at {time.hour}:00</span>
                        <span className="font-semibold">{(time.score * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'offer' && result.offer && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Recommended Offer</p>
                  <p className="text-2xl font-bold text-green-600 capitalize">{result.offer.recommended_offer_type.replace('_', ' ')}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Expected Improvement</p>
                  <p className="text-2xl font-bold text-blue-600">+{result.offer.expected_performance_improvement}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Rationale</p>
                  <p className="text-gray-900">{result.offer.rationale}</p>
                </div>
                {result.offer.suggested_copy && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Suggested Copy</p>
                    <p className="text-gray-900 italic">"{result.offer.suggested_copy}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
