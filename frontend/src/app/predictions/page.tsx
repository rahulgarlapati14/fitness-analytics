'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { predictionAPI } from '@/services/api';

export default function PredictionsPage() {
  const [activeTab, setActiveTab] = useState('engagement');
  const [caption, setCaption] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [offerType, setOfferType] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

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
      setResult(response.data);
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Predictions</h1>
          <p className="text-gray-600 mt-2">AI-powered insights for your Instagram posts</p>
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
            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
