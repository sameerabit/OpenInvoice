import React, { useState } from 'react';
import type { Customer, Vehicle } from '../types';

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

    // for adding vehicles to existing customers
    const [addVehicleCustomerId, setAddVehicleCustomerId] = useState<string>('');
    const [addRego, setAddRego] = useState('');
    const [addOdo, setAddOdo] = useState('');
    const [addDesc, setAddDesc] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
        const newCustomer: Customer = {
            id: crypto.randomUUID(),
            name,
            address,
            vehicles: [
                {
                    id: crypto.randomUUID(),
                    rego,
                    odo,
                    desc,
                } as Vehicle,
            ],
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

    const handleAddVehicle = () => {
        if (!addVehicleCustomerId) return alert('Select a customer to add vehicle to');
        setCustomers(prev => prev.map(c => {
            if (c.id !== addVehicleCustomerId) return c;
            const newVehicle: Vehicle = { id: crypto.randomUUID(), rego: addRego, odo: addOdo, desc: addDesc };
            return { ...c, vehicles: [...(c.vehicles || []), newVehicle] };
        }));
        setAddVehicleCustomerId('');
        setAddRego('');
        setAddOdo('');
        setAddDesc('');
    };

    const handleRemoveVehicle = (customerId: string, vehicleId: string) => {
        if (!window.confirm('Delete this vehicle?')) return;
        setCustomers(prev => prev.map(c => {
            if (c.id !== customerId) return c;
            return { ...c, vehicles: (c.vehicles || []).filter(v => v.id !== vehicleId) };
        }));
    };

    // Editing customer + vehicles
    const [editingCustomerId, setEditingCustomerId] = useState<string>('');
    const [editName, setEditName] = useState('');
    const [editAddress, setEditAddress] = useState('');

    const [editingVehicleId, setEditingVehicleId] = useState<string>('');
    const [editVehicleRego, setEditVehicleRego] = useState('');
    const [editVehicleOdo, setEditVehicleOdo] = useState('');
    const [editVehicleDesc, setEditVehicleDesc] = useState('');

    const startEditCustomer = (customer: Customer) => {
        setEditingCustomerId(customer.id);
        setEditName(customer.name);
        setEditAddress(customer.address);
        // reset vehicle edit state
        setEditingVehicleId('');
        setEditVehicleRego('');
        setEditVehicleOdo('');
        setEditVehicleDesc('');
    };

    const saveCustomerEdits = () => {
        if (!editingCustomerId) return;
        setCustomers(prev => prev.map(c => c.id === editingCustomerId ? { ...c, name: editName, address: editAddress } : c));
        setEditingCustomerId('');
    };

    const cancelEdit = () => {
        setEditingCustomerId('');
        setEditingVehicleId('');
    };

    const startEditVehicle = (customerId: string, vehicle: Vehicle) => {
        setEditingCustomerId(customerId);
        setEditingVehicleId(vehicle.id);
        setEditVehicleRego(vehicle.rego);
        setEditVehicleOdo(vehicle.odo);
        setEditVehicleDesc(vehicle.desc);
    };

    const saveVehicleEdits = () => {
        if (!editingCustomerId || !editingVehicleId) return;
        setCustomers(prev => prev.map(c => {
            if (c.id !== editingCustomerId) return c;
            return {
                ...c,
                vehicles: (c.vehicles || []).map(v => v.id === editingVehicleId ? { ...v, rego: editVehicleRego, odo: editVehicleOdo, desc: editVehicleDesc } : v)
            };
        }));
        setEditingVehicleId('');
    };

    const addVehicleToEditingCustomer = () => {
        if (!editingCustomerId) return alert('No customer selected for adding vehicle');
        const newVehicle: Vehicle = { id: crypto.randomUUID(), rego: addRego || editVehicleRego, odo: addOdo || editVehicleOdo, desc: addDesc || editVehicleDesc };
        setCustomers(prev => prev.map(c => c.id === editingCustomerId ? { ...c, vehicles: [...(c.vehicles || []), newVehicle] } : c));
        setAddRego(''); setAddOdo(''); setAddDesc('');
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
                                                <td className="td-cell">{(customer.vehicles || []).map(v => v.rego).join(', ')}</td>
                                                <td className="td-cell">
                                                    {(customer.vehicles || []).length === 0 ? (
                                                        <span className="text-gray-500">No vehicles</span>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {(customer.vehicles || []).map(v => (
                                                                <div key={v.id} className="flex items-center justify-between">
                                                                    <div>
                                                                        <div className="font-medium">{v.desc || 'Vehicle'}</div>
                                                                        <div className="text-sm text-gray-600">{v.rego} • {v.odo}</div>
                                                                    </div>
                                                                    <div>
                                                                        <button onClick={() => startEditVehicle(customer.id, v)} className="text-indigo-600 hover:text-indigo-800 mr-3">Edit</button>
                                                                        <button onClick={() => handleRemoveVehicle(customer.id, v.id)} className="text-red-600 hover:text-red-800 transition-colors">Remove</button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="td-cell text-center">
                                                    <div className="space-x-2">
                                                        <button onClick={() => startEditCustomer(customer)} className="text-indigo-600 hover:text-indigo-800">Edit</button>
                                                        <button onClick={() => handleRemove(customer.id)} className="text-red-600 hover:text-red-800 transition-colors font-medium">Delete</button>
                                                    </div>
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

                  <div className="mt-6">
                      {editingCustomerId ? (
                          <div className="p-4 bg-white border rounded-lg">
                              <h3 className="text-lg font-semibold mb-3">Edit Customer</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                      <input value={editName} onChange={e => setEditName(e.target.value)} className="form-input" />
                                  </div>
                                  <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                      <input value={editAddress} onChange={e => setEditAddress(e.target.value)} className="form-input" />
                                  </div>
                              </div>

                              <div className="mt-4">
                                  <h4 className="font-semibold mb-2">Vehicles</h4>
                                  <div className="space-y-3">
                                      {(() => {
                                          const c = customers.find(x => x.id === editingCustomerId);
                                          if (!c || (c.vehicles || []).length === 0) return <div className="text-sm text-gray-500">No vehicles</div>;
                                          return (c.vehicles || []).map(v => (
                                              <div key={v.id} className="p-2 border rounded flex items-center justify-between">
                                                  <div>
                                                      <div className="font-medium">{v.desc || 'Vehicle'}</div>
                                                      <div className="text-sm text-gray-600">{v.rego} • {v.odo}</div>
                                                  </div>
                                                  <div className="space-x-2">
                                                      <button onClick={() => startEditVehicle(c.id, v)} className="text-indigo-600 hover:text-indigo-800">Edit</button>
                                                      <button onClick={() => handleRemoveVehicle(c.id, v.id)} className="text-red-600 hover:text-red-800">Delete</button>
                                                  </div>
                                              </div>
                                          ));
                                      })()}
                                  </div>

                                  {editingVehicleId && (
                                      <div className="mt-4 p-3 border rounded bg-gray-50">
                                          <h5 className="font-semibold mb-2">Edit Vehicle</h5>
                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                              <input value={editVehicleRego} onChange={e => setEditVehicleRego(e.target.value)} placeholder="Rego" className="form-input" />
                                              <input value={editVehicleOdo} onChange={e => setEditVehicleOdo(e.target.value)} placeholder="Odo" className="form-input" />
                                              <input value={editVehicleDesc} onChange={e => setEditVehicleDesc(e.target.value)} placeholder="Desc" className="form-input" />
                                          </div>
                                          <div className="mt-3 space-x-2 text-right">
                                              <button onClick={() => setEditingVehicleId('')} className="px-3 py-1 border rounded">Cancel</button>
                                              <button onClick={saveVehicleEdits} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
                                          </div>
                                      </div>
                                  )}

                                  <div className="mt-4 p-3 border rounded bg-gray-50">
                                      <h5 className="font-semibold mb-2">Add Vehicle</h5>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                          <input value={addRego} onChange={e => setAddRego(e.target.value)} placeholder="Rego" className="form-input" />
                                          <input value={addOdo} onChange={e => setAddOdo(e.target.value)} placeholder="Odo" className="form-input" />
                                          <input value={addDesc} onChange={e => setAddDesc(e.target.value)} placeholder="Desc" className="form-input" />
                                      </div>
                                      <div className="mt-3 text-right">
                                          <button onClick={addVehicleToEditingCustomer} className="px-4 py-2 bg-green-600 text-white rounded">Add Vehicle</button>
                                      </div>
                                  </div>
                              </div>

                              <div className="mt-4 flex justify-end space-x-2">
                                  <button onClick={cancelEdit} className="px-4 py-2 border rounded">Cancel</button>
                                  <button onClick={saveCustomerEdits} className="px-4 py-2 bg-blue-600 text-white rounded">Save Customer</button>
                              </div>
                          </div>
                      ) : null}
                  </div>
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
