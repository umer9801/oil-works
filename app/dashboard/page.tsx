'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Dashboard() {
  const router = useRouter();
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return;

    // Check authentication
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    // Fetch stock and check for low items
    fetchLowStock();
    
    // Check every 30 seconds
    const interval = setInterval(fetchLowStock, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const fetchLowStock = async () => {
    try {
      const res = await fetch('/api/stock');
      const data = await res.json();
      const lowItems = data.filter((item: any) => item.quantity <= 5);
      setLowStockItems(lowItems);
      
      if (lowItems.length > 0) {
        setShowNotification(true);
      }
    } catch (error) {
      console.error('Failed to fetch stock:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Low Stock Notification */}
        {showNotification && lowStockItems.length > 0 && (
          <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl max-w-md animate-bounce">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg mb-2">⚠️ Low Stock Alert!</h3>
                <p className="text-sm mb-2">{lowStockItems.length} item(s) need restocking:</p>
                <ul className="text-sm space-y-1">
                  {lowStockItems.slice(0, 3).map((item: any) => (
                    <li key={item._id}>• {item.itemName} ({item.quantity} left)</li>
                  ))}
                </ul>
                <Link href="/stock" className="text-sm underline mt-2 inline-block">
                  View Stock →
                </Link>
              </div>
              <button 
                onClick={() => setShowNotification(false)}
                className="text-white hover:text-gray-200 text-2xl leading-none"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 gap-4">
          <div className="text-center md:text-left flex items-center gap-4">
            <Image 
              src="/logo.jpeg" 
              alt="Logo" 
              width={80} 
              height={80}
              className="rounded-full"
            />
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                THE OIL WORKS
              </h1>
              <p className="text-gray-400 text-sm md:text-base">Point of Sale System</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Low Stock Warning Banner */}
        {lowStockItems.length > 0 && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div>
                <strong className="font-bold">⚠️ Low Stock Alert:</strong>
                <span className="ml-2">{lowStockItems.length} item(s) have 5 or less quantity!</span>
              </div>
              <Link href="/stock" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm">
                Check Stock
              </Link>
            </div>
          </div>
        )}

        {/* Main Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* New Receipt */}
          <Link href="/receipt/new">
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer group">
              <div className="text-5xl md:text-6xl mb-4 group-hover:scale-110 transition-transform">
                📝
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                New Receipt
              </h2>
              <p className="text-gray-600 text-sm md:text-base">Create new service receipt</p>
            </div>
          </Link>

          {/* Add Customer */}
          <Link href="/customers/add">
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer group">
              <div className="text-5xl md:text-6xl mb-4 group-hover:scale-110 transition-transform">
                👤
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                Add Customer
              </h2>
              <p className="text-gray-600 text-sm md:text-base">Register new customer</p>
            </div>
          </Link>

          {/* View Customers */}
          <Link href="/customers">
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer group">
              <div className="text-5xl md:text-6xl mb-4 group-hover:scale-110 transition-transform">
                👥
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                Customers
              </h2>
              <p className="text-gray-600 text-sm md:text-base">View all customers</p>
            </div>
          </Link>

          {/* Manage Stock */}
          <Link href="/stock">
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer group relative">
              {lowStockItems.length > 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {lowStockItems.length}
                </div>
              )}
              <div className="text-5xl md:text-6xl mb-4 group-hover:scale-110 transition-transform">
                📦
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                Manage Stock
              </h2>
              <p className="text-gray-600 text-sm md:text-base">Add & view inventory</p>
            </div>
          </Link>

          {/* Receipts History */}
          <Link href="/receipts">
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer group">
              <div className="text-5xl md:text-6xl mb-4 group-hover:scale-110 transition-transform">
                📋
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                Receipts
              </h2>
              <p className="text-gray-600 text-sm md:text-base">View all receipts</p>
            </div>
          </Link>

          {/* Reports */}
          <Link href="/reports">
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer group">
              <div className="text-5xl md:text-6xl mb-4 group-hover:scale-110 transition-transform">
                📊
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                Reports
              </h2>
              <p className="text-gray-600 text-sm md:text-base">Profit/Loss analysis</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
