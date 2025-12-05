'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// Prevent SSR issues
const isBrowser = typeof window !== 'undefined';

export default function Reports() {
  const [receipts, setReceipts] = useState([]);
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [receiptsRes, stockRes] = await Promise.all([
        fetch('/api/receipts'),
        fetch('/api/stock')
      ]);
      const receiptsData = await receiptsRes.json();
      const stockData = await stockRes.json();
      setReceipts(Array.isArray(receiptsData) ? receiptsData : receiptsData.receipts || []);
      setStock(Array.isArray(stockData) ? stockData : stockData.stock || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setReceipts([]);
      setStock([]);
      setLoading(false);
    }
  };

  const calculateTotalRevenue = () => {
    return receipts.reduce((sum: number, r: any) => sum + (r.totalAmount || 0), 0);
  };

  const calculateTotalCost = () => {
    let totalCost = 0;
    receipts.forEach((receipt: any) => {
      if (receipt.items && receipt.items.length > 0) {
        receipt.items.forEach((item: any) => {
          totalCost += (item.costPrice || 0) * (item.quantity || 0);
        });
      }
    });
    return totalCost;
  };

  const calculateProfit = () => {
    return calculateTotalRevenue() - calculateTotalCost();
  };

  const calculateStockValue = () => {
    return stock.reduce((sum: number, item: any) => {
      const cost = item.costPrice || item.price || 0;
      return sum + (cost * item.quantity);
    }, 0);
  };

  const getTopSellingItems = () => {
    const itemSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};
    
    receipts.forEach((receipt: any) => {
      if (receipt.items) {
        receipt.items.forEach((item: any) => {
          if (!itemSales[item.itemName]) {
            itemSales[item.itemName] = { name: item.itemName, quantity: 0, revenue: 0 };
          }
          itemSales[item.itemName].quantity += item.quantity;
          itemSales[item.itemName].revenue += item.total;
        });
      }
    });

    return Object.values(itemSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const totalRevenue = calculateTotalRevenue();
  const totalCost = calculateTotalCost();
  const profit = calculateProfit();
  const stockValue = calculateStockValue();
  const profitMargin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/dashboard" className="text-white hover:text-gray-300 mb-6 inline-block">
          ← Back to Dashboard
        </Link>
        
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Business Reports</h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
              <p className="text-sm opacity-90 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold">Rs. {totalRevenue.toLocaleString()}</p>
              <p className="text-xs mt-2 opacity-75">{receipts.length} receipts</p>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
              <p className="text-sm opacity-90 mb-1">Total Cost</p>
              <p className="text-3xl font-bold">Rs. {totalCost.toLocaleString()}</p>
              <p className="text-xs mt-2 opacity-75">Items sold</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <p className="text-sm opacity-90 mb-1">Net Profit</p>
              <p className="text-3xl font-bold">Rs. {profit.toLocaleString()}</p>
              <p className="text-xs mt-2 opacity-75">{profitMargin}% margin</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <p className="text-sm opacity-90 mb-1">Stock Value</p>
              <p className="text-3xl font-bold">Rs. {stockValue.toLocaleString()}</p>
              <p className="text-xs mt-2 opacity-75">{stock.length} items</p>
            </div>
          </div>

          {/* Profit/Loss Analysis */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Profit/Loss Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                <p className="text-sm text-gray-600 mb-1">Revenue</p>
                <p className="text-2xl font-bold text-green-600">Rs. {totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-l-4 border-red-500">
                <p className="text-sm text-gray-600 mb-1">Cost</p>
                <p className="text-2xl font-bold text-red-600">Rs. {totalCost.toLocaleString()}</p>
              </div>
              <div className={`bg-white p-4 rounded-lg border-l-4 ${profit >= 0 ? 'border-blue-500' : 'border-orange-500'}`}>
                <p className="text-sm text-gray-600 mb-1">{profit >= 0 ? 'Profit' : 'Loss'}</p>
                <p className={`text-2xl font-bold ${profit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  Rs. {Math.abs(profit).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Top Selling Items */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Top Selling Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rank</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item Name</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Quantity Sold</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Revenue</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getTopSellingItems().map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-green-600">
                        Rs. {item.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stock Status */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Stock Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Items</p>
                <p className="text-2xl font-bold text-gray-800">{stock.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Low Stock Items</p>
                <p className="text-2xl font-bold text-red-600">
                  {stock.filter((item: any) => item.quantity <= 5).length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Stock Value</p>
                <p className="text-2xl font-bold text-purple-600">Rs. {stockValue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Business Summary</h3>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="text-gray-600">Total Transactions:</span>
                <span className="font-bold">{receipts.length}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Average Transaction Value:</span>
                <span className="font-bold">
                  Rs. {receipts.length > 0 ? Math.round(totalRevenue / receipts.length).toLocaleString() : 0}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Profit Margin:</span>
                <span className="font-bold text-blue-600">{profitMargin}%</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {profit >= 0 ? '✓ Profitable' : '⚠ Loss'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
