'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your Instagram performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm text-gray-600">Total Posts</p>
            <p className="text-2xl font-bold text-gray-900">124</p>
            <p className="text-sm text-green-600 mt-2">+12% this month</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">❤️</div>
            <p className="text-sm text-gray-600">Avg. Likes</p>
            <p className="text-2xl font-bold text-gray-900">2,450</p>
            <p className="text-sm text-green-600 mt-2">+8% this month</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">💬</div>
            <p className="text-sm text-gray-600">Avg. Comments</p>
            <p className="text-2xl font-bold text-gray-900">185</p>
            <p className="text-sm text-green-600 mt-2">+15% this month</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-sm text-gray-600">Conversions</p>
            <p className="text-2xl font-bold text-gray-900">48</p>
            <p className="text-sm text-green-600 mt-2">+22% this month</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Predictions</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Engagement Prediction</p>
                <p className="text-sm text-gray-600">Caption: "New class schedule..."</p>
              </div>
              <div className="text-right">
                <p className="text-green-600 font-semibold">92% confidence</p>
                <p className="text-sm text-gray-600">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Offer Recommendation</p>
                <p className="text-sm text-gray-600">Recommended: Free Trial</p>
              </div>
              <div className="text-right">
                <p className="text-blue-600 font-semibold">85% confidence</p>
                <p className="text-sm text-gray-600">5 hours ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Timing Analysis</p>
                <p className="text-sm text-gray-600">Best time: Friday 6 PM</p>
              </div>
              <div className="text-right">
                <p className="text-purple-600 font-semibold">78% confidence</p>
                <p className="text-sm text-gray-600">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="/predictions" className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-colors block cursor-pointer">
            <div className="text-2xl mb-2">🎯</div>
            <p className="font-semibold">New Prediction</p>
            <p className="text-sm opacity-90">Predict post performance</p>
          </a>

          <a href="/instagram" className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition-colors block cursor-pointer">
            <div className="text-2xl mb-2">📱</div>
            <p className="font-semibold">Sync Instagram</p>
            <p className="text-sm opacity-90">Update your posts</p>
          </a>

          <a href="/predictions" className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors block cursor-pointer">
            <div className="text-2xl mb-2">🎁</div>
            <p className="font-semibold">Get Offer Ideas</p>
            <p className="text-sm opacity-90">AI-generated offers</p>
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
