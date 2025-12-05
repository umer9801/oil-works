'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';

// Prevent SSR issues
const isBrowser = typeof window !== 'undefined';

export default function Receipts() {
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const res = await fetch('/api/receipts');
      const data = await res.json();
      setReceipts(Array.isArray(data) ? data : data.receipts || []);
    } catch (error) {
      console.error('Failed to fetch receipts:', error);
      setReceipts([]);
    }
  };

  const handleExportExcel = () => {
    // Prepare data for Excel
    const excelData = receipts.map((receipt: any) => ({
      'Date': new Date(receipt.createdAt).toLocaleDateString(),
      'Customer Name': receipt.customerName || 'N/A',
      'Phone': receipt.customerPhone || 'N/A',
      'Vehicle Number': receipt.vehicleNo,
      'Model': receipt.model,
      'Items': receipt.items ? receipt.items.map((item: any) => `${item.itemName} x${item.quantity}`).join(', ') : 'N/A',
      'Subtotal': receipt.subtotal || receipt.totalAmount,
      'Total Amount': receipt.totalAmount
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 12 }, // Date
      { wch: 15 }, // Vehicle Number
      { wch: 15 }, // Model
      { wch: 20 }, // Oil
      { wch: 20 }, // Oil Filter
      { wch: 15 }, // Air Filter
      { wch: 15 }, // A/C Filter
      { wch: 12 }, // Used Mileage
      { wch: 12 }, // Over Mileage
      { wch: 12 }, // New Mileage
      { wch: 12 }, // New Running
      { wch: 12 }, // After Change
      { wch: 12 }  // Total Amount
    ];
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Receipts');
    
    // Generate filename with current date
    const filename = `receipts_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Download
    XLSX.writeFile(wb, filename);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="text-white hover:text-gray-300 mb-6 inline-block">
          ← Back to Dashboard
        </Link>
        
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Receipts History</h1>
            <button
              onClick={handleExportExcel}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              📥 Export Excel
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Vehicle</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Items</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {receipts.map((receipt: any) => (
                  <tr key={receipt._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      {new Date(receipt.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{receipt.customerName || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{receipt.customerPhone || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{receipt.vehicleNo} ({receipt.model})</td>
                    <td className="px-4 py-3 text-sm">
                      {receipt.items && receipt.items.length > 0 ? (
                        <div className="text-xs">
                          {receipt.items.map((item: any, idx: number) => (
                            <div key={idx}>{item.itemName} x{item.quantity}</div>
                          ))}
                        </div>
                      ) : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-green-600">
                      Rs. {receipt.totalAmount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {receipts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No receipts found. Create your first receipt!
              </div>
            )}
          </div>

          {/* Summary Section */}
          {receipts.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Total Receipts</p>
                  <p className="text-2xl font-bold text-gray-800">{receipts.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    Rs. {receipts.reduce((sum: number, r: any) => sum + r.totalAmount, 0)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Average Amount</p>
                  <p className="text-2xl font-bold text-blue-600">
                    Rs. {Math.round(receipts.reduce((sum: number, r: any) => sum + r.totalAmount, 0) / receipts.length)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
