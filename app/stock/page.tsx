'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Toast from '@/components/Toast';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function Stock() {
  const [stock, setStock] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: 0,
    costPrice: 0,
    salePrice: 0,
    category: 'oil'
  });
  const [editForm, setEditForm] = useState({
    itemName: '',
    quantity: 0,
    costPrice: 0,
    salePrice: 0,
    category: 'oil'
  });

  useEffect(() => {
    fetchStock();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ show: true, message, type });
  };

  const fetchStock = async () => {
    try {
      const res = await fetch('/api/stock', { cache: 'no-store' });
      const data = await res.json();
      setStock(Array.isArray(data) ? data : data.stock || []);
    } catch (error) {
      console.error('Failed to fetch stock:', error);
      setStock([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        showToast('Stock added successfully!', 'success');
        setShowForm(false);
        setFormData({ itemName: '', quantity: 0, costPrice: 0, salePrice: 0, category: 'oil' });
        fetchStock();
      } else {
        showToast(data.error || 'Failed to add stock', 'error');
      }
    } catch (error: any) {
      showToast('Failed to add stock: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setEditForm({
      itemName: item.itemName,
      quantity: item.quantity,
      costPrice: item.costPrice || item.price || 0,
      salePrice: item.salePrice || item.price || 0,
      category: item.category
    });
  };

  const handleUpdate = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/stock', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editForm })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        showToast('Stock updated successfully!', 'success');
        setEditingId(null);
        fetchStock();
      } else {
        showToast(data.error || 'Failed to update stock', 'error');
      }
    } catch (error: any) {
      showToast('Failed to update stock: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, itemName: string) => {
    if (confirm(`Are you sure you want to delete ${itemName}?`)) {
      setLoading(true);
      try {
        const res = await fetch(`/api/stock?id=${id}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        
        if (res.ok && data.success) {
          showToast('Stock deleted successfully!', 'success');
          fetchStock();
        } else {
          showToast(data.error || 'Failed to delete stock', 'error');
        }
      } catch (error: any) {
        showToast('Failed to delete stock: ' + error.message, 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const getLowStockItems = () => stock.filter((item: any) => item.quantity <= 5);

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
              <button 
                type="submit" 
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add Stock'}
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stock.map((item: any) => (
                  <tr key={item._id} className={item.quantity <= 5 ? 'bg-red-50' : 'hover:bg-gray-50'}>
                    {editingId === item._id ? (
                      <>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded text-sm"
                            value={editForm.itemName}
                            onChange={(e) => setEditForm({...editForm, itemName: e.target.value})}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            className="w-full px-2 py-1 border rounded text-sm"
                            value={editForm.category}
                            onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                          >
                            <option value="oil">Oil</option>
                            <option value="oil-filter">Oil Filter</option>
                            <option value="air-filter">Air Filter</option>
                            <option value="ac-filter">A/C Filter</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            className="w-full px-2 py-1 border rounded text-sm"
                            value={editForm.costPrice}
                            onChange={(e) => setEditForm({...editForm, costPrice: parseInt(e.target.value)})}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            className="w-full px-2 py-1 border rounded text-sm"
                            value={editForm.salePrice}
                            onChange={(e) => setEditForm({...editForm, salePrice: parseInt(e.target.value)})}
                          />
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-blue-600">
                          Rs. {editForm.salePrice - editForm.costPrice}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            className="w-full px-2 py-1 border rounded text-sm"
                            value={editForm.quantity}
                            onChange={(e) => setEditForm({...editForm, quantity: parseInt(e.target.value)})}
                          />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {editForm.quantity <= 5 ? (
                            <span className="text-red-600 font-medium">⚠️ Low</span>
                          ) : (
                            <span className="text-green-600">✓ OK</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleUpdate(item._id)}
                              disabled={loading}
                              className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 disabled:bg-gray-400"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              disabled={loading}
                              className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700 disabled:bg-gray-400"
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
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
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEdit(item)}
                              disabled={loading}
                              className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 disabled:bg-gray-400"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(item._id, item.itemName)}
                              disabled={loading}
                              className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 disabled:bg-gray-400"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            
            {stock.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No stock items found. Add your first item!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
