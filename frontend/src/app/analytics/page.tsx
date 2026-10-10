'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Demo data for analytics
const engagementData = [
  { month: 'Jan', likes: 1200, comments: 85, shares: 32 },
  { month: 'Feb', likes: 1450, comments: 110, shares: 45 },
  { month: 'Mar', likes: 1800, comments: 145, shares: 58 },
  { month: 'Apr', likes: 1650, comments: 125, shares: 52 },
  { month: 'May', likes: 2100, comments: 168, shares: 71 },
  { month: 'Jun', likes: 2450, comments: 195, shares: 85 },
];

const conversionData = [
  { month: 'Jan', rate: 22 },
  { month: 'Feb', rate: 25 },
  { month: 'Mar', rate: 28 },
  { month: 'Apr', rate: 26 },
  { month: 'May', rate: 31 },
  { month: 'Jun', rate: 35 },
];

const offerPerformanceData = [
  { name: 'Free Trial', value: 12, color: '#00C49F' },
  { name: 'Discount', value: 8, color: '#0088FE' },
  { name: 'Bundle', value: 5, color: '#FFBB28' },
  { name: 'Referral', value: 3, color: '#FF8042' },
];

const mediaTypeData = [
  { name: 'Video', engagement: 85 },
  { name: 'Image', engagement: 62 },
  { name: 'Carousel', engagement: 78 },
];

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Detailed performance metrics and trends</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Engagement Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="likes" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="comments" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="shares" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Conversion Rate Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rate" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
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
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={offerPerformanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {offerPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Media Type Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mediaTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="engagement" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
