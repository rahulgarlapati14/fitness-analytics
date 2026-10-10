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
      if (response) {
        setAccounts(response.data);
      }
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
    try {
      const response = await instagramAPI.getAuthUrl();
      window.location.href = response.data.auth_url;
    } catch (error: any) {
      console.error('Failed to get auth URL:', error);
      const errorMessage = error.response?.data?.detail;
      if (errorMessage && typeof errorMessage === 'string') {
        alert(errorMessage);
      } else {
        alert('Instagram integration requires API credentials. Please check INSTAGRAM_SETUP.md for instructions on setting up Instagram Basic Display API.');
      }
    }
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
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            + Connect Instagram Account
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
              Connect your Instagram account to start analyzing your posts. 
              See <a href="/INSTAGRAM_SETUP.md" className="text-blue-600 hover:underline" target="_blank">INSTAGRAM_SETUP.md</a> for setup instructions.
            </p>
            <button
              onClick={handleConnect}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Connect Instagram Account
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
