'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { predictionAPI, campaignAPI } from '@/services/api';

interface OfferOption {
  offer_type: string;
  rationale: string;
  suggested_copy: string;
  confidence_score: number;
  tier_predictions: Array<{
    tier: string;
    price: number;
    conversions: number;
    revenue: number;
  }>;
  total_expected_revenue: number;
}

export default function NewCampaignPage() {
  const router = useRouter();
  const [campaignName, setCampaignName] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [offerOptions, setOfferOptions] = useState<OfferOption[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<OfferOption | null>(null);

  const handleGenerateOffers = async () => {
    setGenerating(true);
    try {
      const response = await predictionAPI.getOfferOptions({
        campaign_name: campaignName,
        caption: caption,
        media_type: 'image',
      });
      setOfferOptions(response.offer_options);
    } catch (error) {
      console.error('Failed to generate offers:', error);
      alert('Failed to generate offers. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectOffer = (offer: OfferOption) => {
    setSelectedOffer(offer);
  };

  const handleCreateCampaign = async () => {
    if (!selectedOffer) {
      alert('Please select an offer');
      return;
    }

    setLoading(true);
    try {
      const response = await campaignAPI.createCampaign({
        campaign_name: campaignName,
        selected_offer_type: selectedOffer.offer_type,
        offer_details: { offer_options: offerOptions },
        suggested_copy: selectedOffer.suggested_copy,
      });

      router.push(`/campaigns/${response.campaign_slug}`);
    } catch (error) {
      console.error('Failed to create campaign:', error);
      alert('Failed to create campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const getOfferLabel = (offerType: string) => {
    const labels: Record<string, string> = {
      discount: '20% OFF',
      free_trial: 'FREE TRIAL',
      bundle: 'BUNDLE DEAL',
      referral: 'REFERRAL BONUS',
    };
    return labels[offerType] || offerType.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Campaign</h1>

        {/* Campaign Name Input */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Name
          </label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="e.g., Halloween Sale"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
            Caption (Optional)
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Enter a caption or leave blank for auto-generation"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <button
            onClick={handleGenerateOffers}
            disabled={!campaignName || generating}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {generating ? 'Generating Offers...' : 'Generate Offers'}
          </button>
        </div>

        {/* Offer Options */}
        {offerOptions.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Select an Offer</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {offerOptions.map((offer, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectOffer(offer)}
                  className={`bg-white rounded-lg shadow p-6 cursor-pointer transition-all ${
                    selectedOffer?.offer_type === offer.offer_type
                      ? 'ring-4 ring-blue-500 border-2 border-blue-500'
                      : 'hover:shadow-lg'
                  }`}
                >
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {getOfferLabel(offer.offer_type)}
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    {offer.rationale}
                  </div>

                  <div className="bg-gray-50 rounded p-4 mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Expected Revenue by Tier:
                    </div>
                    {offer.tier_predictions.map((tier, tierIndex) => (
                      <div key={tierIndex} className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">
                          {tier.tier.replace('_', ' ').toUpperCase()}:
                        </span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(tier.revenue)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-green-600">
                        {formatCurrency(offer.total_expected_revenue)}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-2">
                    Confidence: {(offer.confidence_score * 100).toFixed(0)}%
                  </div>

                  <div className="text-sm text-gray-700 bg-gray-100 p-2 rounded">
                    {offer.suggested_copy.substring(0, 100)}...
                  </div>
                </div>
              ))}
            </div>

            {selectedOffer && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Selected: {getOfferLabel(selectedOffer.offer_type)}
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Suggested Copy:
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg text-gray-900">
                    {selectedOffer.suggested_copy}
                  </div>
                </div>
                <button
                  onClick={handleCreateCampaign}
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Campaign...' : 'Create Landing Page'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
