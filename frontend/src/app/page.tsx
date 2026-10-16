'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 via-green-100 to-orange-100 flex flex-col items-center justify-center p-6">
      {/* Top Icons */}
      <div className="flex justify-between w-full max-w-sm mb-12">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>

      {/* Main Text */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Hi Peter,
        </h1>
        <p className="text-xl text-gray-600">
          How can I help you today?
        </p>
      </div>

      {/* Circular Buttons */}
      <div className="relative w-64 h-32 mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-4">
            {/* Convert Button - Links to Campaigns */}
            <button 
              onClick={() => router.push('/campaigns')}
              className="w-20 h-20 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center hover:shadow-xl transition-shadow cursor-pointer"
            >
              <svg className="w-8 h-8 text-teal-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="text-xs text-gray-700 font-medium">Convert</span>
            </button>

            {/* Scan Button - Links to Predictions */}
            <button 
              onClick={() => router.push('/predictions')}
              className="w-20 h-20 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center hover:shadow-xl transition-shadow cursor-pointer"
            >
              <svg className="w-8 h-8 text-green-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs text-gray-700 font-medium">Scan</span>
            </button>

            {/* Edit Button - Links to Analytics */}
            <button 
              onClick={() => router.push('/analytics')}
              className="w-20 h-20 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center hover:shadow-xl transition-shadow cursor-pointer"
            >
              <svg className="w-8 h-8 text-orange-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-xs text-gray-700 font-medium">Edit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Icon */}
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
        <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}
