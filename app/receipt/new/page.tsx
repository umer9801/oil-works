'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewReceipt() {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    vehicleNo: '',
    model: '',
    oil: '',
    oilFilter: '',
    airFilter: 'Not Changed',
    acFilter: 'Not Changed',
    usedMileage: 0,
    overMileage: 0,
    newMileage: 0,
    newRunning: 0,
    afterChange: 0,
    totalAmount: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Receipt created successfully!');
        handlePrint();
      }
    } catch (error) {
      alert('Failed to create receipt');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-white hover:text-gray-300 mb-6 inline-block no-print">
          ← Back to Dashboard
        </Link>
        
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg no-print">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">New Receipt</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Vehicle No</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.vehicleNo}
                  onChange={(e) => setFormData({...formData, vehicleNo: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Model</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Oil</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.oil}
                  onChange={(e) => setFormData({...formData, oil: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Oil Filter</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.oilFilter}
                  onChange={(e) => setFormData({...formData, oilFilter: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Air Filter</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.airFilter}
                  onChange={(e) => setFormData({...formData, airFilter: e.target.value})}
                >
                  <option value="Changed">Changed</option>
                  <option value="Not Changed">Not Changed</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">A/C Filter</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.acFilter}
                  onChange={(e) => setFormData({...formData, acFilter: e.target.value})}
                >
                  <option value="Changed">Changed</option>
                  <option value="Not Changed">Not Changed</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Used Mileage</label>
                <input
                  type="number"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.usedMileage}
                  onChange={(e) => setFormData({...formData, usedMileage: parseInt(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Over Mileage</label>
                <input
                  type="number"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.overMileage}
                  onChange={(e) => setFormData({...formData, overMileage: parseInt(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">New Mileage</label>
                <input
                  type="number"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.newMileage}
                  onChange={(e) => setFormData({...formData, newMileage: parseInt(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">New Running</label>
                <input
                  type="number"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.newRunning}
                  onChange={(e) => setFormData({...formData, newRunning: parseInt(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">After Change</label>
                <input
                  type="number"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.afterChange}
                  onChange={(e) => setFormData({...formData, afterChange: parseInt(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Total Amount</label>
                <input
                  type="number"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({...formData, totalAmount: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
              >
                Create & Print Receipt
              </button>
            </div>
          </form>
        </div>

        {/* Print Receipt */}
        <div ref={printRef} className="print-only bg-white p-8 max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">THE OIL WORKS</h1>
            <p className="text-sm text-gray-600">Oil Changing Service</p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Vehicle No:</span>
              <span>{formData.vehicleNo}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Model:</span>
              <span>{formData.model}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Oil:</span>
              <span>{formData.oil}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Oil Filter:</span>
              <span>{formData.oilFilter}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Air Filter:</span>
              <span>{formData.airFilter}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">A/C Filter:</span>
              <span>{formData.acFilter}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Used Mileage:</span>
              <span>{formData.usedMileage}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Over Mileage:</span>
              <span>{formData.overMileage}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">New Mileage:</span>
              <span>{formData.newMileage}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">New Running:</span>
              <span>{formData.newRunning}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">After Change:</span>
              <span>{formData.afterChange}</span>
            </div>
            <div className="flex justify-between border-b-2 border-black pb-1 pt-2">
              <span className="font-bold">Total Amount Paid:</span>
              <span className="font-bold">Rs. {formData.totalAmount}</span>
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
  );
}
