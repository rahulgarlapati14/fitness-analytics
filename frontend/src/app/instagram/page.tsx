'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { instagramAPI } from '@/services/api';
import { InstagramAccount } from '@/types';

export default function InstagramPage() {
  const [accounts, setAccounts] = useState<InstagramAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<number | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const response = await instagramAPI.getAccounts();
      setAccounts(response.data);
    } catch (error) {
      console.error('Failed to load accounts:', error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (accountId: number) => {
    setSyncing(accountId);
    try {
      await instagramAPI.syncPosts(accountId);
      alert('Sync completed successfully!');
      loadAccounts();
    } catch (error) {
      console.error('Sync failed:', error);
      alert('Sync failed. Please try again.');
    } finally {
      setSyncing(null);
    }
  };

  const handleConnect = async () => {
    alert('Instagram integration requires API credentials from Meta Developer Portal. Please configure INSTAGRAM_CLIENT_ID and INSTAGRAM_CLIENT_SECRET in the backend .env file to enable this feature.');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Instagram Integration</h1>
            <p className="text-gray-600 mt-2">Manage your connected Instagram accounts</p>
          </div>
          <button
            onClick={handleConnect}
            className="bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
            title="Requires Instagram API credentials"
          >
            + Connect Account (Not Configured)
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading accounts...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Instagram Accounts Connected</h3>
            <p className="text-gray-600 mb-6">
              Instagram integration requires API credentials from Meta Developer Portal. 
              Please configure INSTAGRAM_CLIENT_ID and INSTAGRAM_CLIENT_SECRET in the backend .env file.
            </p>
            <button
              onClick={handleConnect}
              className="bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
            >
              Connect Instagram (Not Configured)
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {accounts.map((account) => (
              <div key={account.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📸</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">@{account.username}</h3>
                      <p className="text-sm text-gray-600">
                        Last synced: {account.last_synced_at ? new Date(account.last_synced_at).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSync(account.id)}
                    disabled={syncing === account.id}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {syncing === account.id ? 'Syncing...' : 'Sync Posts'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
