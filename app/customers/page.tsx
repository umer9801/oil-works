'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import * as XLSX from 'xlsx';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    vehicleNo: '',
    model: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const res = await fetch('/api/customers');
    const data = await res.json();
    setCustomers(data);
  };

  const handleEdit = (customer: any) => {
    setEditingId(customer._id);
    setEditForm({
      name: customer.name,
      phone: customer.phone,
      vehicleNo: customer.vehicleNo,
      model: customer.model
    });
  };

  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch('/api/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editForm })
      });
      if (res.ok) {
        alert('Customer updated successfully!');
        setEditingId(null);
        fetchCustomers();
      }
    } catch (error) {
      alert('Failed to update customer');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const res = await fetch(`/api/customers?id=${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          alert('Customer deleted successfully!');
          fetchCustomers();
        }
      } catch (error) {
        alert('Failed to delete customer');
      }
    }
  };

  const handleExportExcel = () => {
    // Prepare data for Excel
    const excelData = customers.map((customer: any) => ({
      'Name': customer.name,
      'Phone': customer.phone,
      'Vehicle Number': customer.vehicleNo,
      'Model': customer.model,
      'Date Added': new Date(customer.createdAt).toLocaleDateString()
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customers');
    
    // Generate filename with current date
    const filename = `customers_${new Date().toISOString().split('T')[0]}.xlsx`;
    
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Customers</h1>
            <div className="flex gap-2">
              <button
                onClick={handleExportExcel}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                📥 Export Excel
              </button>
              <Link href="/customers/add">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  + Add Customer
                </button>
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Vehicle No</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Model</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((customer: any) => (
                  <tr key={customer._id} className="hover:bg-gray-50">
                    {editingId === customer._id ? (
                      <>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded"
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded"
                            value={editForm.vehicleNo}
                            onChange={(e) => setEditForm({...editForm, vehicleNo: e.target.value})}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded"
                            value={editForm.model}
                            onChange={(e) => setEditForm({...editForm, model: e.target.value})}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdate(customer._id)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                              ✓ Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                            >
                              ✕ Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-sm">{customer.name}</td>
                        <td className="px-4 py-3 text-sm">{customer.phone}</td>
                        <td className="px-4 py-3 text-sm">{customer.vehicleNo}</td>
                        <td className="px-4 py-3 text-sm">{customer.model}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(customer)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDelete(customer._id, customer.name)}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            
            {customers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No customers found. Add your first customer!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
