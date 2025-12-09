import React, { useState } from 'react';
import type { Customer, Vehicle } from '../types';
import { createCustomer, updateCustomer, deleteCustomer, addVehicle, updateVehicle, deleteVehicle, CustomerPayload } from '../api';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from './ui/Table';

interface ManageCustomersProps {
    customers: Customer[];
    onRefresh: () => void;
    onEditCustomer?: (customer: Customer) => void;
}

const ManageCustomers: React.FC<ManageCustomersProps> = ({ customers, onRefresh, onEditCustomer }) => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name) {
            const payload: CustomerPayload = {
                name,
                address,
                vehicles: []
            };

            if (rego || odo || desc) {
                payload.vehicles?.push({
                    rego,
                    odo,
                    desc
                });
            }

            try {
                await createCustomer(payload);
                onRefresh();
                setName('');
                setAddress('');
                setRego('');
                setOdo('');
                setDesc('');
            } catch (error) {
                console.error('Failed to create customer:', error);
                alert('Failed to create customer');
            }
        }
    };

    const handleRemove = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await deleteCustomer(id);
                onRefresh();
            } catch (error) {
                console.error('Failed to delete customer:', error);
                alert('Failed to delete customer');
            }
        }
    };

    const handleAddVehicle = async () => {
        if (!addVehicleCustomerId) return alert('Select a customer to add vehicle to');
        try {
            await addVehicle(addVehicleCustomerId, { rego: addRego, odo: addOdo, desc: addDesc });
            onRefresh();
            setAddVehicleCustomerId('');
            setAddRego('');
            setAddOdo('');
            setAddDesc('');
        } catch (error) {
            console.error('Failed to add vehicle:', error);
            alert('Failed to add vehicle');
        }
    };

    const handleRemoveVehicle = async (customerId: string, vehicleId: string) => {
        if (!window.confirm('Delete this vehicle?')) return;
        try {
            await deleteVehicle(customerId, vehicleId);
            onRefresh();
        } catch (error) {
            console.error('Failed to delete vehicle:', error);
            alert('Failed to delete vehicle');
        }
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

    const saveCustomerEdits = async () => {
        if (!editingCustomerId) return;
        try {
            await updateCustomer(editingCustomerId, { name: editName, address: editAddress });
            onRefresh();
            setEditingCustomerId('');
        } catch (error) {
            console.error('Failed to update customer:', error);
            alert('Failed to update customer');
        }
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

    const saveVehicleEdits = async () => {
        if (!editingCustomerId || !editingVehicleId) return;
        try {
            await updateVehicle(editingCustomerId, editingVehicleId, { rego: editVehicleRego, odo: editVehicleOdo, desc: editVehicleDesc });
            onRefresh();
            setEditingVehicleId('');
        } catch (error) {
            console.error('Failed to update vehicle:', error);
            alert('Failed to update vehicle');
        }
    };

    const addVehicleToEditingCustomer = async () => {
        if (!editingCustomerId) return alert('No customer selected for adding vehicle');
        try {
            await addVehicle(editingCustomerId, { rego: addRego, odo: addOdo, desc: addDesc });
            onRefresh();
            setAddRego(''); setAddOdo(''); setAddDesc('');
        } catch (error) {
            console.error('Failed to add vehicle:', error);
            alert('Failed to add vehicle');
        }
    };



    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-slate-900">Manage Customers</h1>

            <Card title="Add New Customer">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Customer Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g., John Smith"
                            required
                        />
                        <Input
                            label="Vehicle Rego (Number Plate)"
                            value={rego}
                            onChange={e => setRego(e.target.value)}
                            placeholder="e.g., ABC-123"
                        />
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Address</label>
                            <textarea
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                placeholder="123 Main Street..."
                                rows={3}
                                className="block w-full rounded-lg shadow-sm py-2.5 px-3 text-base bg-white text-slate-900 placeholder-slate-400 border border-slate-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 focus:outline-none transition-colors duration-200"
                            />
                        </div>
                        <Input
                            label="Vehicle Odometer (km)"
                            value={odo}
                            onChange={e => setOdo(e.target.value)}
                            placeholder="e.g., 150,000 km"
                        />
                        <Input
                            label="Vehicle Description"
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            placeholder="e.g., 2020 Honda Civic"
                        />
                    </div>
                    <div className="flex justify-end pt-4 border-t border-yellow-500/20">
                        <Button type="submit">
                            Add Customer
                        </Button>
                    </div>
                </form>
            </Card>

            <TableContainer>
                <div className="px-6 py-4 border-b border-slate-100 bg-gray-50">
                    <h2 className="text-lg font-bold text-slate-900">Existing Customers</h2>
                </div>

                <Table>
                    <Thead>
                        <Tr className="hover:bg-transparent">
                            <Th>Name</Th>
                            <Th>Address</Th>
                            <Th className="text-center">Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {customers.map(customer => (
                            <Tr key={customer.id}>
                                <Td className="font-bold">{customer.name}</Td>
                                <Td className="whitespace-pre-wrap max-w-xs truncate">{customer.address}</Td>
                                <Td className="text-center">
                                    <div className="space-x-4">
                                        {onEditCustomer && (
                                            <button onClick={() => onEditCustomer(customer)} className="text-yellow-400 hover:text-yellow-300 font-bold uppercase text-xs tracking-wide">Edit</button>
                                        )}
                                        <div className="inline-block">
                                            {/* Seperate Edit button for in-place edit */}
                                            <button onClick={() => startEditCustomer(customer)} className="text-orange-400 hover:text-orange-300 font-bold uppercase text-xs tracking-wide mr-4">Quick Edit</button>
                                            <button onClick={() => handleRemove(customer.id)} className="text-red-500 hover:text-red-400 font-bold uppercase text-xs tracking-wide">Delete</button>
                                        </div>
                                    </div>
                                </Td>
                            </Tr>
                        ))}
                        {customers.length === 0 && (
                            <Tr className="hover:bg-transparent">
                                <Td colSpan={3} className="text-center py-12 text-slate-500">No customers found.</Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </TableContainer>

            {editingCustomerId && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="w-full max-w-2xl">
                        <Card title="Edit Customer">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input label="Name" value={editName} onChange={e => setEditName(e.target.value)} />
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Address</label>
                                        <textarea
                                            value={editAddress}
                                            onChange={e => setEditAddress(e.target.value)}
                                            className="block w-full rounded-lg shadow-sm py-2.5 px-3 text-base bg-white text-slate-900 placeholder-slate-400 border border-slate-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-1 focus:outline-none transition-colors duration-200"
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <h4 className="text-lg font-bold text-slate-800 uppercase tracking-wide mb-4">Vehicles</h4>
                                    <div className="space-y-3 mb-6">
                                        {(() => {
                                            const c = customers.find(x => x.id === editingCustomerId);
                                            if (!c || (c.vehicles || []).length === 0) return <div className="text-sm text-slate-500 italic">No vehicles</div>;
                                            return (c.vehicles || []).map(v => (
                                                <div key={v.id} className="p-3 bg-white rounded border border-gray-200 flex items-center justify-between shadow-sm">
                                                    <div>
                                                        <div className="font-medium text-slate-900">{v.desc || 'Vehicle'}</div>
                                                        <div className="text-sm text-slate-500">{v.rego} • {v.odo}</div>
                                                    </div>
                                                    <div className="space-x-3">
                                                        <button onClick={() => startEditVehicle(c.id, v)} className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase">Edit</button>
                                                        <button onClick={() => handleRemoveVehicle(c.id, v.id)} className="text-xs font-bold text-red-600 hover:text-red-700 uppercase">Delete</button>
                                                    </div>
                                                </div>
                                            ));
                                        })()}
                                    </div>

                                    {editingVehicleId && (
                                        <div className="bg-gray-50 p-4 rounded-lg border border-slate-200 mb-6">
                                            <h5 className="font-bold text-slate-900 mb-3 text-sm">Edit Vehicle</h5>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <Input value={editVehicleRego} onChange={e => setEditVehicleRego(e.target.value)} placeholder="Rego" />
                                                <Input value={editVehicleOdo} onChange={e => setEditVehicleOdo(e.target.value)} placeholder="Odo" />
                                                <Input value={editVehicleDesc} onChange={e => setEditVehicleDesc(e.target.value)} placeholder="Desc" />
                                            </div>
                                            <div className="mt-3 flex justify-end space-x-2">
                                                <Button variant="secondary" onClick={() => setEditingVehicleId('')} size="sm">Cancel</Button>
                                                <Button onClick={saveVehicleEdits} size="sm">Save Vehicle</Button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-gray-50 p-4 rounded-lg border border-slate-200">
                                        <h5 className="font-bold text-slate-900 mb-3 text-sm">Add Vehicle</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <Input value={addRego} onChange={e => setAddRego(e.target.value)} placeholder="Rego" />
                                            <Input value={addOdo} onChange={e => setAddOdo(e.target.value)} placeholder="Odo" />
                                            <Input value={addDesc} onChange={e => setAddDesc(e.target.value)} placeholder="Desc" />
                                        </div>
                                        <div className="mt-3 flex justify-end">
                                            <Button onClick={addVehicleToEditingCustomer} size="sm">Add Vehicle</Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                    <Button variant="secondary" onClick={cancelEdit}>Cancel</Button>
                                    <Button onClick={saveCustomerEdits}>Save Changes</Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCustomers;

