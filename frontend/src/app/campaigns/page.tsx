'use client';

import { useEffect, useState } from 'react';
import { campaignAPI } from '@/services/api';

interface Campaign {
  id: number;
  campaign_name: string;
  campaign_slug: string;
  selected_offer_type: string;
  landing_page_url: string;
  is_active: boolean;
  created_at: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await campaignAPI.listCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <a
            href="/campaigns/new"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create New Campaign
          </a>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading campaigns...</div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-600 mb-4">No campaigns yet</div>
            <a
              href="/campaigns/new"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Your First Campaign
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-xl font-bold text-gray-900 mb-2">
                  {campaign.campaign_name}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {getOfferLabel(campaign.selected_offer_type)}
                </div>
                <div className="text-xs text-gray-500 mb-4">
                  Created: {new Date(campaign.created_at).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <a
                    href={campaign.landing_page_url}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 text-sm"
                  >
                    View Landing Page
                  </a>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                    onClick={() => {
                      if (confirm('Delete this campaign?')) {
                        campaignAPI.deleteCampaign(campaign.campaign_slug).then(() => {
                          loadCampaigns();
                        });
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
