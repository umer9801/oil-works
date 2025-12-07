'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cookieAuth = document.cookie.includes('oil_works_auth=true');
    const localAuth = localStorage.getItem('isLoggedIn') === 'true';
    const isLoggedIn = cookieAuth || localAuth;
    
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    fetchLowStock();
    const interval = setInterval(fetchLowStock, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const fetchLowStock = async () => {
    try {
      const res = await fetch('/api/stock');
      const data = await res.json();
      const lowItems = data.filter((item: any) => item.quantity <= 5);
      setLowStockItems(lowItems);
    } catch (error) {
      console.error('Failed to fetch stock:', error);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      document.cookie = 'oil_works_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      localStorage.removeItem('isLoggedIn');
      router.push('/login');
    }
  };

  const menuItems = [
    {
      title: 'New Receipt',
      description: 'Create new customer receipt',
      icon: '📝',
      href: '/receipt/new',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Receipts History',
      description: 'View all receipts',
      icon: '📋',
      href: '/receipts',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Stock Management',
      description: 'Manage inventory',
      icon: '📦',
      href: '/stock',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'Customers',
      description: 'Manage customers',
      icon: '👥',
      href: '/customers',
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      title: 'Add Customer',
      description: 'Register new customer',
      icon: '➕',
      href: '/customers/add',
      color: 'from-teal-500 to-green-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700'
    },
    {
      title: 'Reports',
      description: 'View profit & analytics',
      icon: '📊',
      href: '/reports',
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl shadow-lg border border-white/30">
                <img 
                  src="/logo.jpeg" 
                  alt="The Oil Works Logo" 
                  className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover"
                  onError={(e) => {
                    // Fallback to icon if logo not found
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.innerHTML = '<svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>';
                    }
                  }}
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  The Oil Works
                </h1>
                <p className="text-blue-200 text-xs md:text-sm">Professional POS System</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500/90 backdrop-blur-sm text-white px-4 md:px-6 py-2 md:py-3 rounded-xl hover:bg-red-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 text-sm md:text-base"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Low Stock Alert - Always Visible */}
        <div className={`mb-8 backdrop-blur-sm border rounded-2xl p-6 shadow-xl ${
          lowStockItems.length > 0 
            ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/30' 
            : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${lowStockItems.length > 0 ? 'bg-red-500' : 'bg-green-500'}`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {lowStockItems.length > 0 ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
            </div>
            <div className="flex-1">
              {lowStockItems.length > 0 ? (
                <>
                  <h3 className="text-xl font-bold text-white mb-2">⚠️ Low Stock Alert</h3>
                  <p className="text-red-100 mb-3">
                    {lowStockItems.length} item(s) are running low (≤5 units)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {lowStockItems.slice(0, 5).map((item: any) => (
                      <span key={item._id} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-sm text-white border border-white/30">
                        {item.itemName} ({item.quantity} left)
                      </span>
                    ))}
                    {lowStockItems.length > 5 && (
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-sm text-white border border-white/30">
                        +{lowStockItems.length - 5} more
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-white mb-2">✓ Stock Status</h3>
                  <p className="text-green-100">
                    All items are well stocked. No low stock alerts at this time.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Welcome Back! 👋
          </h2>
          <p className="text-blue-200 text-lg">
            Select an option below to get started
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <div className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className={`bg-gradient-to-br ${item.color} p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {item.description}
                    </p>
                  </div>
                  <svg className="w-6 h-6 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-lg border border-green-500/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-green-500 p-3 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-green-100 text-sm">System Status</p>
                <p className="text-white text-xl font-bold">Online</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-lg border border-blue-500/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Last Updated</p>
                <p className="text-white text-xl font-bold">Just Now</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500 p-3 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-purple-100 text-sm">Performance</p>
                <p className="text-white text-xl font-bold">Excellent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 The Oil Works. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
