import React, { useState } from 'react';
import type { Customer } from '../types';

interface ManageCustomersProps {
    customers: Customer[];
    setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const ManageCustomers: React.FC<ManageCustomersProps> = ({ customers, setCustomers }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [rego, setRego] = useState('');
  const [odo, setOdo] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      const newCustomer: Customer = {
        id: crypto.randomUUID(),
        name,
        address,
        vehicleRego: rego,
        vehicleOdo: odo,
        vehicleDesc: desc,
      };
      setCustomers(prev => [...prev, newCustomer]);
      setName('');
      setAddress('');
      setRego('');
      setOdo('');
      setDesc('');
    }
  };

  const handleRemove = (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
        setCustomers(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Manage Customers</h1>

      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Add New Customer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., John Smith" className="form-input" required />
            </div>
            <div>
                <label htmlFor="rego" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Rego (Number Plate)</label>
                <input id="rego" type="text" value={rego} onChange={e => setRego(e.target.value)} placeholder="e.g., ABC-123" className="form-input" />
            </div>
            <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea id="address" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main Street..." rows={3} className="form-input" />
            </div>
            <div>
                <label htmlFor="odo" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Odometer (km)</label>
                <input id="odo" type="text" value={odo} onChange={e => setOdo(e.target.value)} placeholder="e.g., 150,000 km" className="form-input" />
            </div>
            <div>
                <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Description</label>
                <input id="desc" type="text" value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g., 2020 Honda Civic" className="form-input" />
            </div>
        </div>
        <div className="text-right mt-6">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors">
                Add Customer
            </button>
        </div>
      </form>
      <style>{`.form-input { display: block; width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); transition: box-shadow 0.15s ease-in-out, border-color 0.15s ease-in-out; } .form-input:focus { outline: none; border-color: #3B82F6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3); }`}</style>


      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Existing Customers</h2>
        <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="th-cell">Name</th>
                        <th className="th-cell">Address</th>
                        <th className="th-cell">Vehicle Rego</th>
                        <th className="th-cell">Vehicle Details</th>
                        <th className="th-cell text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {customers.map(customer => (
                        <tr key={customer.id}>
                            <td className="td-cell font-medium text-gray-900">{customer.name}</td>
                            <td className="td-cell whitespace-pre-wrap">{customer.address}</td>
                            <td className="td-cell">{customer.vehicleRego}</td>
                            <td className="td-cell">{customer.vehicleDesc} ({customer.vehicleOdo})</td>
                            <td className="td-cell text-center">
                                <button onClick={() => handleRemove(customer.id)} className="text-red-600 hover:text-red-800 transition-colors font-medium">Delete</button>
                            </td>
                        </tr>
                    ))}
                    {customers.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center py-8 text-gray-500">No customers found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <style>{`
                .th-cell { padding: 0.75rem 1.5rem; text-align: left; font-size: 0.75rem; color: #4B5563; text-transform: uppercase; letter-spacing: 0.05em; }
                .td-cell { padding: 1rem 1.5rem; white-space: nowrap; font-size: 0.875rem; color: #374151; }
            `}</style>
        </div>
      </div>
    </div>
  );
};

export default ManageCustomers;
