import React, { useState, useEffect } from 'react';
import type { Customer } from '../types';
import { updateCustomer, addVehicle, updateVehicle, deleteVehicle } from '../api';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';

interface EditCustomerProps {
  customer: Customer;
  onSave: () => void;
  onCancel: () => void;
}

const EditCustomer: React.FC<EditCustomerProps> = ({ customer, onSave, onCancel }) => {
  const [name, setName] = useState(customer.name);
  const [address, setAddress] = useState(customer.address);
  
  // Add vehicle state
  const [addRego, setAddRego] = useState('');
  const [addOdo, setAddOdo] = useState('');
  const [addDesc, setAddDesc] = useState('');
  
  // Edit vehicle state
  const [editingVehicleId, setEditingVehicleId] = useState<string>('');
  const [editVehicleRego, setEditVehicleRego] = useState('');
  const [editVehicleOdo, setEditVehicleOdo] = useState('');
  const [editVehicleDesc, setEditVehicleDesc] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateCustomer(customer.id, { name, address });
      alert('Customer updated successfully');
      onSave();
    } catch (error) {
      console.error('Failed to update customer:', error);
      alert('Failed to update customer');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddVehicle = async () => {
    if (!addRego && !addDesc) {
      alert('Please provide at least a registration or description');
      return;
    }
    try {
      await addVehicle(customer.id, { rego: addRego, odo: addOdo, desc: addDesc });
      setAddRego('');
      setAddOdo('');
      setAddDesc('');
      alert('Vehicle added successfully');
      onSave(); // Refresh
    } catch (error) {
      console.error('Failed to add vehicle:', error);
      alert('Failed to add vehicle');
    }
  };

  const startEditVehicle = (vehicleId: string) => {
    const vehicle = customer.vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setEditingVehicleId(vehicleId);
      setEditVehicleRego(vehicle.rego);
      setEditVehicleOdo(vehicle.odo);
      setEditVehicleDesc(vehicle.desc);
    }
  };

  const handleSaveVehicle = async () => {
    if (!editingVehicleId) return;
    try {
      await updateVehicle(customer.id, editingVehicleId, {
        rego: editVehicleRego,
        odo: editVehicleOdo,
        desc: editVehicleDesc
      });
      setEditingVehicleId('');
      alert('Vehicle updated successfully');
      onSave(); // Refresh
    } catch (error) {
      console.error('Failed to update vehicle:', error);
      alert('Failed to update vehicle');
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await deleteVehicle(customer.id, vehicleId);
      alert('Vehicle deleted successfully');
      onSave(); // Refresh
    } catch (error) {
      console.error('Failed to delete vehicle:', error);
      alert('Failed to delete vehicle');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Edit Customer</h1>
          <p className="mt-1 text-slate-400">Update customer details and manage vehicles</p>
        </div>
      </div>

      {/* Customer Details */}
      <Card title="Customer Information">
        <div className="space-y-4">
          <Input
            id="customer-name"
            label="Customer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div>
            <label htmlFor="customer-address" className="block text-sm font-medium text-slate-700 mb-1">
              Address
            </label>
            <textarea
              id="customer-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="input w-full"
            />
          </div>
        </div>
      </Card>

      {/* Vehicles */}
      <Card title="Vehicles">
        <div className="space-y-4">
          {customer.vehicles.length === 0 ? (
            <p className="text-slate-500 text-sm">No vehicles added yet</p>
          ) : (
            <div className="space-y-3">
              {customer.vehicles.map((vehicle) => (
                <div key={vehicle.id} className="p-4 border border-yellow-500/20 rounded-lg bg-slate-800/50">
                  {editingVehicleId === vehicle.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          id="edit-rego"
                          label="Registration"
                          value={editVehicleRego}
                          onChange={(e) => setEditVehicleRego(e.target.value)}
                        />
                        <Input
                          id="edit-odo"
                          label="Odometer"
                          value={editVehicleOdo}
                          onChange={(e) => setEditVehicleOdo(e.target.value)}
                        />
                        <Input
                          id="edit-desc"
                          label="Description"
                          value={editVehicleDesc}
                          onChange={(e) => setEditVehicleDesc(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="secondary" onClick={() => setEditingVehicleId('')}>
                          Cancel
                        </Button>
                        <Button onClick={handleSaveVehicle}>Save Vehicle</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                          <div className="font-medium text-slate-200">{vehicle.desc || 'Vehicle'}</div>
                          <div className="text-sm text-slate-400">
                          {vehicle.rego} {vehicle.odo && `• ${vehicle.odo}`}
                        </div>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => startEditVehicle(vehicle.id)}
                            className="text-yellow-400 hover:text-yellow-300 font-bold uppercase text-xs tracking-wide"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle.id)}
                            className="text-red-500 hover:text-red-400 font-bold uppercase text-xs tracking-wide"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add Vehicle Form */}
          <div className="mt-6 p-4 bg-slate-800/80 rounded-lg border border-yellow-500/20">
            <h3 className="font-bold text-yellow-400 mb-3 uppercase tracking-wide">Add New Vehicle</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                id="add-rego"
                label="Registration"
                value={addRego}
                onChange={(e) => setAddRego(e.target.value)}
                placeholder="e.g., ABC-123"
              />
              <Input
                id="add-odo"
                label="Odometer"
                value={addOdo}
                onChange={(e) => setAddOdo(e.target.value)}
                placeholder="e.g., 150,000 km"
              />
              <Input
                id="add-desc"
                label="Description"
                value={addDesc}
                onChange={(e) => setAddDesc(e.target.value)}
                placeholder="e.g., 2020 Honda Civic"
              />
            </div>
            <div className="mt-3 flex justify-end">
              <Button type="button" onClick={handleAddVehicle}>
                Add Vehicle
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-yellow-500/20">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} isLoading={isSaving}>
          Save Customer
        </Button>
      </div>
    </div>
  );
};

export default EditCustomer;
