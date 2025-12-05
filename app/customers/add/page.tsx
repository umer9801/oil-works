'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Toast from '@/components/Toast';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function AddCustomer() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleNo: '',
    model: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        showToast('Customer added successfully!', 'success');
        setTimeout(() => router.push('/customers'), 1000);
      } else {
        showToast(data.error || 'Failed to add customer', 'error');
      }
    } catch (error: any) {
      showToast('Failed to add customer: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ show: true, message, type });
  };

  return (
    <>
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-white hover:text-gray-300 mb-6 inline-block">
          ← Back to Dashboard
        </Link>
        
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Add New Customer</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Customer Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Vehicle Number</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.vehicleNo}
                onChange={(e) => setFormData({...formData, vehicleNo: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Vehicle Model</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding Customer...' : 'Add Customer'}
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}
