'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Toast from '@/components/Toast';
import PageHeader from '@/components/PageHeader';

interface Payment {
  _id: string;
  amount: number;
  date: string;
  note?: string;
}

interface Loan {
  _id: string;
  customerName: string;
  customerPhone: string;
  vehicleNo?: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  payments: Payment[];
  status: 'pending' | 'partial' | 'paid';
  description?: string;
  createdAt: string;
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function Loans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [expandedLoanId, setExpandedLoanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'info' });
  const [filterStatus, setFilterStatus] = useState('all');
  const [editData, setEditData] = useState({
    totalAmount: '',
    description: ''
  });
  
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    customerPhone: '',
    vehicleNo: '',
    totalAmount: '',
    description: ''
  });
  
  const [paymentData, setPaymentData] = useState({
    paymentAmount: '',
    paymentNote: ''
  });

  useEffect(() => {
    fetchLoans();
    fetchCustomers();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ show: true, message, type });
  };

  const fetchLoans = async () => {
    try {
      const res = await fetch('/api/loans', { cache: 'no-store' });
      const data = await res.json();
      setLoans(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast('Failed to fetch loans', 'error');
      setLoans([]);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : data.customers || []);
    } catch (error) {
      setCustomers([]);
    }
  };

  const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value;
    if (customerId === 'new') {
      setFormData({
        ...formData,
        customerId: '',
        customerName: '',
        customerPhone: '',
        vehicleNo: ''
      });
    } else {
      const customer = customers.find((c: any) => c._id === customerId);
      if (customer) {
        setFormData({
          ...formData,
          customerId: (customer as any)._id,
          customerName: (customer as any).name,
          customerPhone: (customer as any).phone,
          vehicleNo: (customer as any).vehicleNo
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = {
        ...formData,
        totalAmount: parseFloat(formData.totalAmount)
      };

      const res = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        showToast('Loan added successfully!', 'success');
        setShowForm(false);
        setFormData({ customerId: '', customerName: '', customerPhone: '', vehicleNo: '', totalAmount: '', description: '' });
        fetchLoans();
      } else {
        showToast(data.error || 'Failed to add loan', 'error');
      }
    } catch (error: any) {
      showToast('Failed to add loan: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/loans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedLoan._id,
          paymentAmount: parseFloat(paymentData.paymentAmount),
          paymentNote: paymentData.paymentNote
        })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        showToast('Payment added successfully!', 'success');
        setShowPaymentModal(false);
        setSelectedLoan(null);
        setPaymentData({ paymentAmount: '', paymentNote: '' });
        fetchLoans();
      } else {
        showToast(data.error || 'Failed to add payment', 'error');
      }
    } catch (error: any) {
      showToast('Failed to add payment: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditLoan = (loan: Loan) => {
    setSelectedLoan(loan);
    setEditData({
      totalAmount: loan.totalAmount.toString(),
      description: loan.description || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan) return;
    
    setLoading(true);
    try {
      const newTotal = parseFloat(editData.totalAmount);
      const newRemaining = newTotal - selectedLoan.paidAmount;
      
      const res = await fetch('/api/loans', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedLoan._id,
          totalAmount: newTotal,
          remainingAmount: newRemaining > 0 ? newRemaining : 0,
          description: editData.description,
          status: newRemaining <= 0 ? 'paid' : selectedLoan.paidAmount > 0 ? 'partial' : 'pending'
        })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        showToast('Loan updated successfully!', 'success');
        setShowEditModal(false);
        setSelectedLoan(null);
        setEditData({ totalAmount: '', description: '' });
        fetchLoans();
      } else {
        showToast(data.error || 'Failed to update loan', 'error');
      }
    } catch (error: any) {
      showToast('Failed to update loan: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, customerName: string) => {
    if (confirm(`Are you sure you want to delete loan for ${customerName}?`)) {
      setLoading(true);
      try {
        const res = await fetch(`/api/loans?id=${id}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        
        if (res.ok && data.success) {
          showToast('Loan deleted successfully!', 'success');
          fetchLoans();
        } else {
          showToast(data.error || 'Failed to delete loan', 'error');
        }
      } catch (error: any) {
        showToast('Failed to delete loan: ' + error.message, 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const getFilteredLoans = () => {
    if (filterStatus === 'all') return loans;
    return loans.filter(loan => loan.status === filterStatus);
  };

  const getTotalStats = () => {
    const total = loans.reduce((sum, loan) => sum + loan.totalAmount, 0);
    const paid = loans.reduce((sum, loan) => sum + loan.paidAmount, 0);
    const remaining = loans.reduce((sum, loan) => sum + loan.remainingAmount, 0);
    return { total, paid, remaining };
  };

  const stats = getTotalStats();
  const filteredLoans = getFilteredLoans();

  const exportToExcel = () => {
    // Create Excel data
    const excelData = loans.map(loan => ({
      'Customer Name': loan.customerName,
      'Phone': loan.customerPhone,
      'Vehicle': loan.vehicleNo || '-',
      'Total Amount': loan.totalAmount,
      'Paid Amount': loan.paidAmount,
      'Remaining Amount': loan.remainingAmount,
      'Status': loan.status.toUpperCase(),
      'Description': loan.description || '-',
      'Created Date': new Date(loan.createdAt).toLocaleDateString('en-PK'),
      'Payments Count': loan.payments.length,
      'Payment History': loan.payments.map(p => 
        `Rs.${p.amount} on ${new Date(p.date).toLocaleDateString('en-PK')}${p.note ? ` (${p.note})` : ''}`
      ).join(' | ')
    }));

    // Convert to CSV
    const headers = Object.keys(excelData[0] || {});
    const csvContent = [
      headers.join(','),
      ...excelData.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row];
          // Escape commas and quotes
          return typeof value === 'string' && (value.includes(',') || value.includes('"'))
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        }).join(',')
      )
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `loans_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    showToast('Loans exported successfully!', 'success');
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

      {/* Edit Loan Modal */}
      {showEditModal && selectedLoan && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
                <span className="text-3xl">✏️</span>
              </div>
              <h3 className="text-3xl font-bold text-white">Edit Loan</h3>
            </div>
            
            <div className="mb-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-5 rounded-2xl border border-blue-400/30">
              <p className="text-sm text-blue-200 mb-1">Customer</p>
              <p className="text-lg font-bold text-white">{selectedLoan.customerName}</p>
              <p className="text-sm text-blue-300 mt-2">{selectedLoan.customerPhone}</p>
            </div>

            <form onSubmit={handleUpdateLoan} className="space-y-5">
              <div>
                <label className="block text-white font-bold mb-3">Total Loan Amount (Rs.) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white text-lg font-bold placeholder-white/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all backdrop-blur-sm"
                  value={editData.totalAmount}
                  onChange={(e) => setEditData({...editData, totalAmount: e.target.value})}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Paid: Rs. {selectedLoan.paidAmount} | New Remaining: Rs. {Math.max(0, parseFloat(editData.totalAmount || '0') - selectedLoan.paidAmount)}
                </p>
              </div>

              <div>
                <label className="block text-white font-bold mb-3">Description</label>
                <textarea
                  className="w-full px-5 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all backdrop-blur-sm"
                  value={editData.description}
                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                  placeholder="Update description..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-4 rounded-xl hover:from-purple-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 font-bold text-lg shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105"
                >
                  {loading ? 'Updating...' : 'Update Loan'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedLoan(null);
                    setEditData({ totalAmount: '', description: '' });
                  }}
                  className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-4 rounded-xl hover:from-gray-700 hover:to-gray-800 font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105"
                >
                  ✕ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal - Premium Design */}
      {showPaymentModal && selectedLoan && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 transform transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl shadow-lg">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-3xl font-bold text-white">Add Payment</h3>
            </div>
            
            <div className="mb-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-5 rounded-2xl border border-blue-400/30 backdrop-blur-sm">
              <p className="text-sm text-blue-200 mb-1">Customer</p>
              <p className="text-lg font-bold text-white mb-3">{selectedLoan.customerName}</p>
              <p className="text-sm text-blue-200 mb-1">Phone</p>
              <p className="text-md font-semibold text-white mb-3">{selectedLoan.customerPhone}</p>
              <div className="border-t border-white/20 pt-3 mt-3">
                <p className="text-sm text-red-200 mb-1">Remaining Amount</p>
                <p className="text-3xl text-red-400 font-bold">Rs. {selectedLoan.remainingAmount.toLocaleString()}</p>
              </div>
            </div>

            <form onSubmit={handleAddPayment} className="space-y-5">
              <div>
                <label className="block text-white font-bold mb-3 flex items-center gap-2">
                  <span className="text-lg">💵</span> Payment Amount (Rs.) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={selectedLoan.remainingAmount}
                  className="w-full px-5 py-4 bg-white/10 border-2 border-white/20 rounded-xl text-white text-lg font-bold placeholder-white/50 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all backdrop-blur-sm"
                  value={paymentData.paymentAmount}
                  onChange={(e) => setPaymentData({...paymentData, paymentAmount: e.target.value})}
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-white font-bold mb-3 flex items-center gap-2">
                  <span className="text-lg">📝</span> Note (Optional)
                </label>
                <textarea
                  className="w-full px-5 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all backdrop-blur-sm"
                  value={paymentData.paymentNote}
                  onChange={(e) => setPaymentData({...paymentData, paymentNote: e.target.value})}
                  placeholder="Add note..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 font-bold text-lg shadow-lg shadow-green-500/50 hover:shadow-green-500/70 transition-all duration-300 hover:scale-105"
                >
                  {loading ? 'Adding...' : 'Add Payment'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedLoan(null);
                    setPaymentData({ paymentAmount: '', paymentNote: '' });
                  }}
                  className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-4 rounded-xl hover:from-gray-700 hover:to-gray-800 font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105"
                >
                  ✕ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <PageHeader title="Loan Management" />

          {/* Stats Cards - Premium Design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="group relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-blue-300 font-medium">Total Loans</p>
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <span className="text-2xl">💳</span>
                  </div>
                </div>
                <p className="text-4xl font-bold text-white mb-1">Rs. {stats.total.toFixed(0)}</p>
                <p className="text-xs text-blue-200">{loans.length} active loans</p>
              </div>
            </div>
            
            <div className="group relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:shadow-green-500/20 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-green-300 font-medium">Paid Amount</p>
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
                <p className="text-4xl font-bold text-white mb-1">Rs. {stats.paid.toFixed(0)}</p>
                <p className="text-xs text-green-200">{((stats.paid / stats.total) * 100 || 0).toFixed(1)}% recovered</p>
              </div>
            </div>
            
            <div className="group relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:shadow-red-500/20 transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-red-300 font-medium">Remaining</p>
                  <div className="bg-red-500/20 p-2 rounded-lg">
                    <span className="text-2xl">⏳</span>
                  </div>
                </div>
                <p className="text-4xl font-bold text-white mb-1">Rs. {stats.remaining.toFixed(0)}</p>
                <p className="text-xs text-red-200">{loans.filter(l => l.status !== 'paid').length} pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                    filterStatus === 'all' 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 scale-105' 
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  All <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">{loans.length}</span>
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                    filterStatus === 'pending' 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/50 scale-105' 
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  Pending <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">{loans.filter(l => l.status === 'pending').length}</span>
                </button>
                <button
                  onClick={() => setFilterStatus('partial')}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                    filterStatus === 'partial' 
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/50 scale-105' 
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  Partial <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">{loans.filter(l => l.status === 'partial').length}</span>
                </button>
                <button
                  onClick={() => setFilterStatus('paid')}
                  className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                    filterStatus === 'paid' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50 scale-105' 
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  Paid <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">{loans.filter(l => l.status === 'paid').length}</span>
                </button>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={exportToExcel}
                  disabled={loans.length === 0}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-700 font-medium shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Export Excel
                </button>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 font-medium shadow-lg shadow-green-500/50 hover:shadow-green-500/70 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <span className="text-xl">{showForm ? '✕' : '+'}</span>
                  {showForm ? 'Cancel' : 'Add Loan'}
                </button>
              </div>
            </div>

            {/* Add Loan Form */}
            {showForm && (
              <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl p-8 rounded-2xl mb-6 space-y-6 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">New Loan</h3>
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                    <span className="text-lg">👤</span> Select Customer
                  </label>
                  <select
                    className="w-full px-5 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all backdrop-blur-sm"
                    onChange={handleCustomerSelect}
                  >
                    <option value="new" className="bg-gray-800">New Customer (Enter Details Below)</option>
                    {customers.map((customer: any) => (
                      <option key={customer._id} value={customer._id} className="bg-gray-800">
                        {customer.name} - {customer.phone}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-semibold mb-3">Customer Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-5 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all backdrop-blur-sm"
                      value={formData.customerName}
                      onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                      placeholder="Enter name"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-3">Phone *</label>
                    <input
                      type="tel"
                      required
                      className="w-full px-5 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all backdrop-blur-sm"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                      placeholder="Enter phone"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-3">Vehicle No</label>
                    <input
                      type="text"
                      className="w-full px-5 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all backdrop-blur-sm"
                      value={formData.vehicleNo}
                      onChange={(e) => setFormData({...formData, vehicleNo: e.target.value})}
                      placeholder="Enter vehicle no"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-3">Loan Amount (Rs.) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="w-full px-5 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all backdrop-blur-sm"
                      value={formData.totalAmount}
                      onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                      placeholder="Enter amount"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-3">Description</label>
                  <textarea
                    className="w-full px-5 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all backdrop-blur-sm"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Add description..."
                    rows={3}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-bold text-lg shadow-lg shadow-green-500/50 hover:shadow-green-500/70 transition-all duration-300 hover:scale-105"
                >
                  {loading ? 'Adding...' : 'Add Loan'}
                </button>
              </form>
            )}

            {/* Loans Table - Desktop */}
            <div className="hidden lg:block overflow-x-auto rounded-xl">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Vehicle</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-white">Total</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-white">Paid</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-white">Remaining</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-white">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredLoans.map((loan) => (
                    <>
                      <tr key={loan._id} className="hover:bg-white/10 text-white transition-all duration-200 group">
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setExpandedLoanId(expandedLoanId === loan._id ? null : loan._id)}
                              className="text-white hover:text-blue-400 transition-colors"
                            >
                              {expandedLoanId === loan._id ? '▼' : '▶'}
                            </button>
                            <span className="font-semibold">{loan.customerName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-blue-300">{loan.customerPhone}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{loan.vehicleNo || '-'}</td>
                        <td className="px-6 py-4 text-sm text-right font-bold text-blue-300">Rs. {loan.totalAmount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-right font-bold text-green-400">Rs. {loan.paidAmount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-right font-bold text-red-400">Rs. {loan.remainingAmount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-center">
                          {loan.status === 'paid' && (
                            <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-green-500/50">
                              Paid
                            </span>
                          )}
                          {loan.status === 'partial' && (
                            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-yellow-500/50">
                              Partial
                            </span>
                          )}
                          {loan.status === 'pending' && (
                            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-red-500/50">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-center flex-wrap">
                            {loan.status !== 'paid' && (
                              <button
                                onClick={() => {
                                  setSelectedLoan(loan);
                                  setShowPaymentModal(true);
                                }}
                                disabled={loading}
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
                              >
                                Pay
                              </button>
                            )}
                            <button
                              onClick={() => handleEditLoan(loan)}
                              disabled={loading}
                              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(loan._id, loan.customerName)}
                              disabled={loading}
                              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:from-red-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedLoanId === loan._id && (
                        <tr className="bg-white/5">
                          <td colSpan={8} className="px-6 py-4">
                            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-white/10">
                              <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                <span className="text-lg">📜</span> Payment History ({loan.payments.length} payments)
                              </h4>
                              {loan.payments.length > 0 ? (
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                  {loan.payments.slice().reverse().map((payment, index) => (
                                    <div key={payment._id} className="bg-white/10 rounded-lg p-3 flex justify-between items-center">
                                      <div>
                                        <p className="text-white font-semibold">Rs. {payment.amount.toLocaleString()}</p>
                                        <p className="text-xs text-gray-400">{new Date(payment.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                        {payment.note && <p className="text-xs text-blue-300 mt-1">📝 {payment.note}</p>}
                                      </div>
                                      <span className="text-green-400 text-xl">✓</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-400 text-sm">No payments yet</p>
                              )}
                              {loan.description && (
                                <div className="mt-3 pt-3 border-t border-white/10">
                                  <p className="text-xs text-gray-400">Description:</p>
                                  <p className="text-sm text-white">{loan.description}</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
              
              {filteredLoans.length === 0 && (
                <div className="text-center py-8 text-white">
                  No loans found. Add your first loan!
                </div>
              )}
            </div>

            {/* Loans Cards - Mobile */}
            <div className="lg:hidden space-y-4">
              {filteredLoans.map((loan) => (
                <div key={loan._id} className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <button
                          onClick={() => setExpandedLoanId(expandedLoanId === loan._id ? null : loan._id)}
                          className="text-white hover:text-blue-400 transition-colors"
                        >
                          {expandedLoanId === loan._id ? '▼' : '▶'}
                        </button>
                        <h3 className="text-lg font-bold text-white">{loan.customerName}</h3>
                      </div>
                      <p className="text-sm text-blue-300 ml-6">{loan.customerPhone}</p>
                      {loan.vehicleNo && <p className="text-xs text-gray-400 mt-1 ml-6">🚗 {loan.vehicleNo}</p>}
                    </div>
                    <div>
                      {loan.status === 'paid' && (
                        <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          ✓ Paid
                        </span>
                      )}
                      {loan.status === 'partial' && (
                        <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          ⏳ Partial
                        </span>
                      )}
                      {loan.status === 'pending' && (
                        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          ⚠️ Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-blue-500/20 rounded-xl p-3 border border-blue-400/30">
                      <p className="text-xs text-blue-200 mb-1">Total</p>
                      <p className="text-sm font-bold text-white">Rs. {loan.totalAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-500/20 rounded-xl p-3 border border-green-400/30">
                      <p className="text-xs text-green-200 mb-1">Paid</p>
                      <p className="text-sm font-bold text-white">Rs. {loan.paidAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-red-500/20 rounded-xl p-3 border border-red-400/30">
                      <p className="text-xs text-red-200 mb-1">Remaining</p>
                      <p className="text-sm font-bold text-white">Rs. {loan.remainingAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  {expandedLoanId === loan._id && (
                    <div className="mb-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-white/10">
                      <h4 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                        <span>📜</span> Payment History ({loan.payments.length})
                      </h4>
                      {loan.payments.length > 0 ? (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {loan.payments.slice().reverse().map((payment) => (
                            <div key={payment._id} className="bg-white/10 rounded-lg p-3 flex justify-between items-center">
                              <div>
                                <p className="text-white font-semibold text-sm">Rs. {payment.amount.toLocaleString()}</p>
                                <p className="text-xs text-gray-400">{new Date(payment.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                {payment.note && <p className="text-xs text-blue-300 mt-1">📝 {payment.note}</p>}
                              </div>
                              <span className="text-green-400">✓</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-xs">No payments yet</p>
                      )}
                      {loan.description && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          <p className="text-xs text-gray-400">Description:</p>
                          <p className="text-xs text-white">{loan.description}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {loan.status !== 'paid' && (
                      <button
                        onClick={() => {
                          setSelectedLoan(loan);
                          setShowPaymentModal(true);
                        }}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-xl text-sm font-bold hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 shadow-lg transition-all duration-300"
                      >
                        Pay
                      </button>
                    )}
                    <button
                      onClick={() => handleEditLoan(loan)}
                      disabled={loading}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl text-sm font-bold hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 shadow-lg transition-all duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(loan._id, loan.customerName)}
                      disabled={loading}
                      className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-3 rounded-xl text-sm font-bold hover:from-red-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 shadow-lg transition-all duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              
              {filteredLoans.length === 0 && (
                <div className="text-center py-12 text-white bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-2xl mb-2">💰</p>
                  <p className="text-lg font-semibold">No loans found</p>
                  <p className="text-sm text-gray-400 mt-1">Add your first loan to get started!</p>
                </div>
              )}
            </div>
          </div>

          <Link href="/dashboard" className="inline-block mt-6 text-white hover:text-gray-300">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}
