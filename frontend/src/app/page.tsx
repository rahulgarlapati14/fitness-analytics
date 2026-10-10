export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Fitness Analytics Platform
          </h1>
          <p className="text-xl text-gray-600">
            AI-Powered Instagram Insights for Gym Owners
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Engagement Prediction</h3>
            <p className="text-gray-600">
              Predict likes, comments, and shares before you post
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Lead Conversion</h3>
            <p className="text-gray-600">
              Estimate membership sign-ups from your posts
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">⏰</div>
            <h3 className="text-xl font-semibold mb-2">Optimal Timing</h3>
            <p className="text-gray-600">
              Find the best times to reach your audience
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">🎁</div>
            <h3 className="text-xl font-semibold mb-2">Offer Recommendations</h3>
            <p className="text-gray-600">
              AI-suggested promotional offers and copy
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">📈</div>
            <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600">
              Track performance over time with detailed insights
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">Mobile Friendly</h3>
            <p className="text-gray-600">
              Access insights anywhere, anytime
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </main>
  )
}
