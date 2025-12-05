'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// Prevent SSR issues
const isBrowser = typeof window !== 'undefined';

export default function Stock() {
  const [stock, setStock] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: 0,
    costPrice: 0,
    salePrice: 0,
    category: 'oil'
  });

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const res = await fetch('/api/stock');
      const data = await res.json();
      setStock(Array.isArray(data) ? data : data.stock || []);
    } catch (error) {
      console.error('Failed to fetch stock:', error);
      setStock([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        alert('Stock added successfully!');
        setShowForm(false);
        setFormData({ itemName: '', quantity: 0, costPrice: 0, salePrice: 0, category: 'oil' });
        fetchStock();
      } else {
        alert(data.error || 'Failed to add stock');
      }
    } catch (error: any) {
      console.error('Error adding stock:', error);
      alert('Failed to add stock: ' + error.message);
    }
  };

  const getLowStockItems = () => stock.filter((item: any) => item.quantity <= 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="text-white hover:text-gray-300 mb-6 inline-block">
          ← Back to Dashboard
        </Link>
        
        {getLowStockItems().length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <strong>⚠️ Low Stock Alert:</strong> {getLowStockItems().length} item(s) have 5 or less quantity!
          </div>
        )}

        <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Stock Management</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {showForm ? 'Cancel' : '+ Add Stock'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Item Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={formData.itemName}
                    onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Quantity</label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Cost Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({...formData, costPrice: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Sale Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({...formData, salePrice: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Category</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="oil">Oil</option>
                    <option value="oil-filter">Oil Filter</option>
                    <option value="air-filter">Air Filter</option>
                    <option value="ac-filter">A/C Filter</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                Add Stock
              </button>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cost</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Sale Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Profit</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stock.map((item: any) => (
                  <tr key={item._id} className={item.quantity <= 5 ? 'bg-red-50' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-3 text-sm">{item.itemName}</td>
                    <td className="px-4 py-3 text-sm capitalize">{item.category.replace('-', ' ')}</td>
                    <td className="px-4 py-3 text-sm">Rs. {item.costPrice || item.price || 0}</td>
                    <td className="px-4 py-3 text-sm font-bold text-green-600">Rs. {item.salePrice || item.price || 0}</td>
                    <td className="px-4 py-3 text-sm font-bold text-blue-600">
                      Rs. {(item.salePrice || item.price || 0) - (item.costPrice || item.price || 0)}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm">
                      {item.quantity <= 5 ? (
                        <span className="text-red-600 font-medium">⚠️ Low Stock</span>
                      ) : (
                        <span className="text-green-600">✓ In Stock</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
