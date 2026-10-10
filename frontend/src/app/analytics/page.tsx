'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Detailed performance metrics and trends</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Engagement Over Time</h2>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Chart placeholder - Use Recharts here</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Conversion Rate</h2>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Chart placeholder - Use Recharts here</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Performing Posts</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Summer promo post</p>
                  <p className="text-sm text-gray-600">3,450 likes • 280 comments</p>
                </div>
                <span className="text-green-600 font-semibold">+25%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">New class announcement</p>
                  <p className="text-sm text-gray-600">2,890 likes • 195 comments</p>
                </div>
                <span className="text-green-600 font-semibold">+18%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Member testimonial</p>
                  <p className="text-sm text-gray-600">2,100 likes • 165 comments</p>
                </div>
                <span className="text-green-600 font-semibold">+15%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Offer Performance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Free Trial</p>
                  <p className="text-sm text-gray-600">12 conversions • 28% rate</p>
                </div>
                <span className="text-green-600 font-semibold">Best</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Discount (20%)</p>
                  <p className="text-sm text-gray-600">8 conversions • 19% rate</p>
                </div>
                <span className="text-blue-600 font-semibold">Good</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Bundle Deal</p>
                  <p className="text-sm text-gray-600">5 conversions • 12% rate</p>
                </div>
                <span className="text-yellow-600 font-semibold">Avg</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
