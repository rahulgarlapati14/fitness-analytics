'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { campaignAPI } from '@/services/api';

interface Campaign {
  id: number;
  campaign_name: string;
  campaign_slug: string;
  selected_offer_type: string;
  landing_page_url: string;
  created_at: string;
  [key: string]: any;
}

export default function CampaignLandingPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadCampaign();
  }, [slug]);

  const loadCampaign = async () => {
    try {
      const data = await campaignAPI.getCampaign(slug);
      setCampaign(data);
    } catch (error) {
      console.error('Failed to load campaign:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Campaign not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {campaign.campaign_name}
          </h1>
          <div className="text-3xl font-bold text-blue-600 mb-4">
            {getOfferLabel(campaign.selected_offer_type)}
          </div>
          <p className="text-xl text-gray-700">
            Limited time offer - Don't miss out!
          </p>
        </div>

        {/* CTA Button */}
        <div className="text-center mb-16">
          <button className="px-12 py-4 bg-blue-600 text-white text-xl font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
            Claim Offer Now
          </button>
        </div>

        {/* Subscription Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Day Pass */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Day Pass</h3>
            <div className="text-4xl font-bold text-blue-600 mb-4">$15</div>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>✓ Full gym access</li>
              <li>✓ All equipment</li>
              <li>✓ 24/7 access</li>
              <li>✓ Locker access</li>
            </ul>
            <button className="w-full px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium">
              Get Day Pass
            </button>
          </div>

          {/* Monthly Pass */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center border-4 border-blue-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
              POPULAR
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Monthly Pass</h3>
            <div className="text-4xl font-bold text-blue-600 mb-4">$50<span className="text-lg text-gray-600">/month</span></div>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>✓ Full gym access</li>
              <li>✓ All equipment</li>
              <li>✓ 24/7 access</li>
              <li>✓ Locker access</li>
              <li>✓ Group classes</li>
              <li>✓ Personal trainer discount</li>
            </ul>
            <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Get Monthly Pass
            </button>
          </div>

          {/* 3-Month Pass */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">3-Month Pass</h3>
            <div className="text-4xl font-bold text-blue-600 mb-4">$120<span className="text-lg text-gray-600">/3 months</span></div>
            <div className="text-sm text-green-600 mb-4 font-medium">
              Save $30 compared to monthly!
            </div>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li>✓ Full gym access</li>
              <li>✓ All equipment</li>
              <li>✓ 24/7 access</li>
              <li>✓ Locker access</li>
              <li>✓ Group classes</li>
              <li>✓ Personal trainer discount</li>
              <li>✓ Nutrition consultation</li>
            </ul>
            <button className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              Get 3-Month Pass
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm">
          <p>Offer valid for a limited time. Terms and conditions apply.</p>
        </div>
      </div>
    </div>
  );
}
