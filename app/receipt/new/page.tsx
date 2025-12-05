'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Toast from '@/components/Toast';

interface ReceiptItem {
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
  total: number;
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function NewReceipt() {
  const printRef = useRef<HTMLDivElement>(null);
  const [customers, setCustomers] = useState([]);
  const [stock, setStock] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    vehicleNo: '',
    model: '',
    usedMileage: 0,
    overMileage: 0,
    newMileage: 0,
    newRunning: 0,
    afterChange: 0
  });

  useEffect(() => {
    fetchCustomers();
    fetchStock();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ show: true, message, type });
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : data.customers || []);
    } catch (error) {
      showToast('Failed to fetch customers', 'error');
      setCustomers([]);
    }
  };

  const fetchStock = async () => {
    try {
      const res = await fetch('/api/stock');
      const data = await res.json();
      setStock(Array.isArray(data) ? data : data.stock || []);
    } catch (error) {
      showToast('Failed to fetch stock', 'error');
      setStock([]);
    }
  };

  const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value;
    if (customerId === 'new') {
      setSelectedCustomer(null);
      setFormData({
        ...formData,
        customerName: '',
        customerPhone: '',
        vehicleNo: '',
        model: ''
      });
    } else {
      const customer = customers.find((c: any) => c._id === customerId);
      if (customer) {
        setSelectedCustomer(customer);
        setFormData({
          ...formData,
          customerName: (customer as any).name,
          customerPhone: (customer as any).phone,
          vehicleNo: (customer as any).vehicleNo,
          model: (customer as any).model
        });
      }
    }
  };

  const handleAddItem = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stockId = e.target.value;
    if (!stockId) return;

    const stockItem = stock.find((s: any) => s._id === stockId);
    if (!stockItem) return;

    // Check if item already exists
    const existingItem = items.find(item => item.itemId === stockId);
    if (existingItem) {
      showToast('Item already added! Update quantity if needed.', 'info');
      return;
    }

    const newItem: ReceiptItem = {
      itemId: (stockItem as any)._id,
      itemName: (stockItem as any).itemName,
      quantity: 1,
      price: (stockItem as any).salePrice || (stockItem as any).price,
      total: (stockItem as any).salePrice || (stockItem as any).price
    };

    setItems([...items, newItem]);
    e.target.value = ''; // Reset select
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setItems(items.map(item => 
      item.itemId === itemId 
        ? { ...item, quantity, total: item.price * quantity }
        : item
    ));
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter(item => item.itemId !== itemId));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      showToast('Please add at least one item!', 'error');
      return;
    }

    const subtotal = calculateSubtotal();
    
    try {
      const res = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          customerId: selectedCustomer?._id,
          items: items,
          subtotal: subtotal,
          totalAmount: subtotal
        })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        showToast('Receipt created successfully!', 'success');
        setTimeout(() => handlePrint(), 500);
      } else {
        showToast(data.error || 'Failed to create receipt', 'error');
      }
    } catch (error: any) {
      showToast('Failed to create receipt: ' + error.message, 'error');
    }
  };

  const handlePrint = () => {
    window.print();
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
        <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="text-white hover:text-gray-300 mb-6 inline-block no-print">
          ← Back to Dashboard
        </Link>
        
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg no-print">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">New Receipt</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Selection */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <label className="block text-gray-700 font-medium mb-2">Select Customer</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                onChange={handleCustomerSelect}
              >
                <option value="new">New Customer (Enter Details Below)</option>
                {customers.map((customer: any) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name} - {customer.vehicleNo}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Customer Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Customer Phone *</label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Vehicle No *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.vehicleNo}
                  onChange={(e) => setFormData({...formData, vehicleNo: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Model *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                />
              </div>
            </div>

            {/* Items Section */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Items & Services</h2>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Add Item from Stock</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  onChange={handleAddItem}
                >
                  <option value="">-- Select Item --</option>
                  {stock.map((item: any) => (
                    <option key={item._id} value={item._id}>
                      {item.itemName} - Rs. {item.salePrice || item.price} ({item.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Items Table */}
              {items.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Item</th>
                        <th className="px-4 py-2 text-center">Qty</th>
                        <th className="px-4 py-2 text-right">Price</th>
                        <th className="px-4 py-2 text-right">Total</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.itemId} className="border-b">
                          <td className="px-4 py-2">{item.itemName}</td>
                          <td className="px-4 py-2 text-center">
                            <input
                              type="number"
                              min="1"
                              className="w-20 px-2 py-1 border rounded text-center"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.itemId, parseInt(e.target.value) || 1)}
                            />
                          </td>
                          <td className="px-4 py-2 text-right">Rs. {item.price}</td>
                          <td className="px-4 py-2 text-right font-bold">Rs. {item.total}</td>
                          <td className="px-4 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.itemId)}
                              className="text-red-600 hover:text-red-800"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-bold">
                        <td colSpan={3} className="px-4 py-2 text-right">Subtotal:</td>
                        <td className="px-4 py-2 text-right text-green-600">Rs. {calculateSubtotal()}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Mileage Information */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Used Mileage</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.usedMileage}
                  onChange={(e) => setFormData({...formData, usedMileage: parseInt(e.target.value) || 0})}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Over Mileage</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.overMileage}
                  onChange={(e) => setFormData({...formData, overMileage: parseInt(e.target.value) || 0})}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">New Mileage</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.newMileage}
                  onChange={(e) => setFormData({...formData, newMileage: parseInt(e.target.value) || 0})}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">New Running</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.newRunning}
                  onChange={(e) => setFormData({...formData, newRunning: parseInt(e.target.value) || 0})}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">After Change</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.afterChange}
                  onChange={(e) => setFormData({...formData, afterChange: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 text-lg"
            >
              Create & Print Receipt
            </button>
          </form>
        </div>

        {/* Print Receipt */}
        <div ref={printRef} className="print-only bg-white p-8 max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">THE OIL WORKS</h1>
            <p className="text-sm text-gray-600">Oil Changing Service</p>
            <p className="text-xs text-gray-500 mt-1">{new Date().toLocaleDateString()}</p>
          </div>

          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Customer:</span>
              <span>{formData.customerName}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Phone:</span>
              <span>{formData.customerPhone}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Vehicle:</span>
              <span>{formData.vehicleNo}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Model:</span>
              <span>{formData.model}</span>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-sm mb-4">
            <thead className="border-b-2 border-black">
              <tr>
                <th className="text-left py-1">Item</th>
                <th className="text-center py-1">Qty</th>
                <th className="text-right py-1">Price</th>
                <th className="text-right py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-1">{item.itemName}</td>
                  <td className="text-center py-1">{item.quantity}</td>
                  <td className="text-right py-1">{item.price}</td>
                  <td className="text-right py-1">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-y-1 text-sm mb-4">
            {formData.usedMileage > 0 && (
              <div className="flex justify-between">
                <span>Used Mileage:</span>
                <span>{formData.usedMileage}</span>
              </div>
            )}
            {formData.overMileage > 0 && (
              <div className="flex justify-between">
                <span>Over Mileage:</span>
                <span>{formData.overMileage}</span>
              </div>
            )}
            {formData.newMileage > 0 && (
              <div className="flex justify-between">
                <span>New Mileage:</span>
                <span>{formData.newMileage}</span>
              </div>
            )}
          </div>

          <div className="border-t-2 border-black pt-2 mb-4">
            <div className="flex justify-between text-lg font-bold">
              <span>TOTAL:</span>
              <span>Rs. {calculateSubtotal()}</span>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="font-medium">Thanks For Choosing</p>
            <p className="text-xl font-bold">THE OIL WORKS</p>
            <p className="text-sm mt-2">For Information Call: 03XX-XXXXXXX</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
