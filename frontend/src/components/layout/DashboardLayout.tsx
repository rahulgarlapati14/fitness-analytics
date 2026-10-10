'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../store';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    logout();
    window.location.href = '/login';
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/predictions', label: 'Predictions', icon: '🎯' },
    { href: '/instagram', label: 'Instagram', icon: '📱' },
    { href: '/analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Fitness Analytics</h1>
        <button className="text-gray-600">☰</button>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen p-6 flex-shrink-0">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Fitness Analytics</h1>
          <p className="text-sm text-gray-600 mt-1">{user?.gym_name}</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="mr-3">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Mobile header with user info */}
          <div className="lg:hidden mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.gym_name}</h2>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
