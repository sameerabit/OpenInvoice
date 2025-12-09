import React, { useState, useEffect } from 'react';
import type { Customer, ServiceOrProduct, InvoiceItem, Vehicle } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from './ui/Table';

interface CreateQuoteProps {
  customers: Customer[];
  services: ServiceOrProduct[];
  products: ServiceOrProduct[];
  onCreateQuote: (payload: any) => void;
  onUpdateQuote?: (id: string, payload: any) => void;
  initialData?: any;
}

const CreateQuote: React.FC<CreateQuoteProps> = ({ customers, services, products, onCreateQuote, onUpdateQuote, initialData }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [lineItems, setLineItems] = useState<InvoiceItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  // New Customer State
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');

  // New Vehicle State
  const [isNewVehicle, setIsNewVehicle] = useState(false);
  const [newVehicleMake, setNewVehicleMake] = useState('');
  const [newVehicleModel, setNewVehicleModel] = useState('');
  const [newVehicleYear, setNewVehicleYear] = useState<number>(new Date().getFullYear());
  const [newVehicleLicense, setNewVehicleLicense] = useState('');
  const [newVehicleVin, setNewVehicleVin] = useState('');

  // Initial Data Population
  useEffect(() => {
    if (initialData) {
      if (initialData.customerId) {
        setSelectedCustomerId(initialData.customerId);

        // Try to match vehicle
        const customer = customers.find(c => c.id === initialData.customerId);
        if (customer && initialData.vehicleRego) {
          const vehicle = customer.vehicles.find(v => v.rego === initialData.vehicleRego);
          if (vehicle) {
            setSelectedVehicleId(vehicle.id);
          }
        }
      } else {
        // If no customer ID (e.g. ad-hoc or deleted), maybe switch to "New Customer" mode 
        if (initialData.customerName) {
          setIsNewCustomer(true);
          setNewCustomerName(initialData.customerName);
          setNewCustomerAddress(initialData.customerAddress || '');
        }
      }

      // Map line items
      const mappedItems: InvoiceItem[] = initialData.lineItems.map((item: any) => ({
        ...item,
        type: item.price === 0 && item.included ? 'product' : 'service', 
      }));
      setLineItems(mappedItems);
    }
  }, [initialData, customers]);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const customerVehicles = selectedCustomer?.vehicles || [];

  const handleAddItem = (item: InvoiceItem) => {
    const newItems = [...lineItems, item];

    // If it's a service, check for included products and checklist
    if (item.type === 'service') {
      const service = services.find(s => s.id === item.id);
      if (service) {
        // Add included products
        if (service.includedProductIds && service.includedProductIds.length > 0) {
          service.includedProductIds.forEach(productId => {
            const product = products.find(p => p.id === productId);
            if (product) {
              newItems.push({
                id: product.id,
                type: 'product',
                description: product.description,
                price: 0, // Included items are free
                quantity: 1,
                included: true,
                includedBy: service.id
              });
            }
          });
        }

        // Add checklist items
        if (service.checklist) {
          const checklistItems = service.checklist.split('\n').filter(line => line.trim() !== '');
          checklistItems.forEach(line => {
            newItems.push({
              id: `checklist-${Date.now()}-${Math.random()}`, // Temporary ID
              type: 'service', // Treat as service item for now
              description: line.trim(),
              price: 0,
              quantity: 1,
              isChecklist: true,
              includedBy: service.id
            });
          });
        }
      }
    }

    setLineItems(newItems);
    setShowAddItemModal(false);
  };

  const handleRemoveItem = (index: number) => {
    const itemToRemove = lineItems[index];
    const newItems = [...lineItems];
    newItems.splice(index, 1);

    // If removing a service, also remove its included items
    if (itemToRemove.type === 'service' && !itemToRemove.included && !itemToRemove.isChecklist) {
      const remainingItems = newItems.filter(item => item.includedBy !== itemToRemove.id);
      setLineItems(remainingItems);
    } else {
      setLineItems(newItems);
    }
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // Assuming 10% tax for now
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = async (actionStatus: 'DRAFT' | 'ISSUED') => {
    setIsSubmitting(true);

    const payload = {
      customerId: isNewCustomer ? null : selectedCustomerId,
      customerName: isNewCustomer ? newCustomerName : selectedCustomer?.name,
      customerAddress: isNewCustomer ? newCustomerAddress : selectedCustomer?.address,
      vehicleRego: isNewVehicle ? newVehicleLicense : (selectedVehicleId ? customerVehicles.find(v => v.id === selectedVehicleId)?.rego : null),
      vehicleOdo: isNewVehicle ? null : (selectedVehicleId ? customerVehicles.find(v => v.id === selectedVehicleId)?.odo : null),
      vehicleDesc: isNewVehicle ? `${newVehicleYear} ${newVehicleMake} ${newVehicleModel}` : (selectedVehicleId ? customerVehicles.find(v => v.id === selectedVehicleId)?.desc : null),
      date: new Date().toISOString().split('T')[0], // Today's date
      status: actionStatus,
      lineItems: lineItems.map(item => ({
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        included: item.included,
        includedBy: item.includedBy,
        isChecklist: item.isChecklist
      }))
    };

    try {
      if (initialData && initialData.id && onUpdateQuote) {
        await onUpdateQuote(initialData.id, payload);
        alert(`Quote ${actionStatus === 'DRAFT' ? 'updated' : 'issued'} successfully`);
      } else {
        await onCreateQuote(payload);
        alert(`Quote ${actionStatus === 'DRAFT' ? 'saved as draft' : 'created and issued'} successfully`);
      }
    } catch (error: any) {
      console.error('Error creating quotation:', error);
      if (error.response) {
        console.error('Error response data:', JSON.stringify(error.response.data, null, 2));
        console.error('Error response status:', error.response.status);
      }
      alert('Failed to create quote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl"> {/* Left aligned container */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{initialData ? 'Edit Quote' : 'New Quote'}</h1>
          <p className="mt-1 text-slate-500">{initialData ? 'Update existing quote details.' : 'Create a new quotation for a customer.'}</p>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Section */}
          <Card title="Customer Details">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary-600"
                    checked={!isNewCustomer}
                    onChange={() => setIsNewCustomer(false)}
                  />
                  <span className="ml-2">Existing Customer</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary-600"
                    checked={isNewCustomer}
                    onChange={() => {
                      setIsNewCustomer(true);
                      setSelectedCustomerId('');
                      setSelectedVehicleId('');
                    }}
                  />
                  <span className="ml-2">New Customer</span>
                </label>
              </div>

              {!isNewCustomer ? (
                <div>
                  <label htmlFor="customer-select" className="block text-sm font-medium text-slate-700 mb-1">Select Customer</label>
                  <select
                    id="customer-select"
                    className="input"
                    value={selectedCustomerId}
                    onChange={(e) => {
                      setSelectedCustomerId(e.target.value);
                      setSelectedVehicleId('');
                    }}
                    required={!isNewCustomer}
                  >
                    <option value="">-- Select Customer --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-4">
                  <Input id="new-customer-name" label="Full Name" value={newCustomerName} onChange={(e) => setNewCustomerName(e.target.value)} required={isNewCustomer} />
                  <Input id="new-customer-email" label="Email" type="email" value={newCustomerEmail} onChange={(e) => setNewCustomerEmail(e.target.value)} />
                  <Input id="new-customer-phone" label="Phone" type="tel" value={newCustomerPhone} onChange={(e) => setNewCustomerPhone(e.target.value)} />
                  <Input id="new-customer-address" label="Address" value={newCustomerAddress} onChange={(e) => setNewCustomerAddress(e.target.value)} />
                </div>
              )}
            </div>
          </Card>

          {/* Vehicle Section */}
          <Card title="Vehicle Details">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary-600"
                    checked={!isNewVehicle}
                    onChange={() => setIsNewVehicle(false)}
                    disabled={isNewCustomer}
                  />
                  <span className={`ml-2 ${isNewCustomer ? 'text-slate-300' : ''}`}>Existing Vehicle</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-primary-600"
                    checked={isNewVehicle}
                    onChange={() => setIsNewVehicle(true)}
                  />
                  <span className="ml-2">New Vehicle</span>
                </label>
              </div>

              {!isNewVehicle && !isNewCustomer ? (
                <div>
                  <label htmlFor="vehicle-select" className="block text-sm font-medium text-slate-700 mb-1">Select Vehicle</label>
                  <select
                    id="vehicle-select"
                    className="input"
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    required={!isNewVehicle && !isNewCustomer}
                    disabled={!selectedCustomerId}
                  >
                    <option value="">-- Select Vehicle --</option>
                    {customerVehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.desc} ({v.rego})</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input id="new-vehicle-make" label="Make" value={newVehicleMake} onChange={(e) => setNewVehicleMake(e.target.value)} required={isNewVehicle} placeholder="e.g. Toyota" />
                    <Input id="new-vehicle-model" label="Model" value={newVehicleModel} onChange={(e) => setNewVehicleModel(e.target.value)} required={isNewVehicle} placeholder="e.g. Camry" />
                  </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input id="new-vehicle-year" label="Year" type="number" value={newVehicleYear} onChange={(e) => setNewVehicleYear(parseInt(e.target.value))} required={isNewVehicle} />
                      <Input id="new-vehicle-license" label="License Plate" value={newVehicleLicense} onChange={(e) => setNewVehicleLicense(e.target.value)} required={isNewVehicle} />
                    </div>
                    <Input id="new-vehicle-vin" label="VIN (Optional)" value={newVehicleVin} onChange={(e) => setNewVehicleVin(e.target.value)} />
                  </div>
              )}
            </div>
          </Card>
        </div>

        {/* Line Items Section */}
        <Card title="Quote Items">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={() => setShowAddItemModal(true)} variant="secondary">
                + Add Item
              </Button>
            </div>

            <TableContainer className="border rounded-lg border-slate-200">
              <Table className="w-full text-left">
                <Thead className="bg-gray-50 text-slate-500 font-medium text-xs uppercase">
                  <Tr className="hover:bg-transparent">
                    <Th className="px-4 py-3">Description</Th>
                    <Th className="px-4 py-3 text-center w-24">Qty</Th>
                    <Th className="px-4 py-3 text-right w-32">Price</Th>
                    <Th className="px-4 py-3 text-right w-32">Total</Th>
                    <Th className="px-4 py-3 w-16"></Th>
                  </Tr>
                </Thead>
                <Tbody className="divide-y divide-gray-200">
                  {lineItems.map((item, index) => (
                    <Tr key={index} className={`hover:bg-gray-50 ${item.included || item.isChecklist ? 'bg-gray-50/50' : ''}`}>
                      <Td className="px-4 py-3 text-sm text-slate-900">
                        <div className={item.included || item.isChecklist ? 'pl-4' : ''}>
                          {item.description}
                          {item.isChecklist && <span className="ml-2 text-xs text-slate-500">(Checklist)</span>}
                        </div>
                      </Td>
                      <Td className="px-4 py-3 text-sm text-center">{item.quantity}</Td>
                      <Td className="px-4 py-3 text-sm text-right">${item.price.toFixed(2)}</Td>
                      <Td className="px-4 py-3 text-sm text-right font-medium">${(item.price * item.quantity).toFixed(2)}</Td>
                      <Td className="px-4 py-3 text-center">
                        {!item.included && !item.isChecklist && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="text-slate-300 hover:text-red-600 transition-colors"
                          >
                            &times;
                          </button>
                        )}
                      </Td>
                    </Tr>
                  ))}
                  {lineItems.length === 0 && (
                    <Tr className="hover:bg-transparent">
                      <Td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-sm">
                        No items added yet. Click "Add Item" to start.
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>

            <div className="flex justify-end">
              <div className="w-full sm:w-1/3 space-y-2">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Tax (10%):</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Submit Button - Left Aligned */}
        <div className="pt-4 border-t border-slate-200 flex justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto min-w-[150px]"
            isLoading={isSubmitting}
            disabled={lineItems.length === 0}
            onClick={() => handleSubmit('DRAFT')}
          >
            Save Draft
          </Button>
          <Button
            type="button"
            size="lg"
            className="w-full sm:w-auto min-w-[200px]"
            isLoading={isSubmitting}
            disabled={lineItems.length === 0}
            onClick={() => handleSubmit('ISSUED')}
          >
            {initialData && initialData.status === 'ISSUED' ? 'Update Quote' : 'Issue Quote'}
          </Button>
        </div>
      </form>

      {/* Add Item Modal */}
      {showAddItemModal && (
        <AddItemModal
          services={services}
          products={products}
          onClose={() => setShowAddItemModal(false)}
          onAdd={handleAddItem}
        />
      )}
    </div>
  );
};

// Simple Modal Component for adding items
const AddItemModal: React.FC<{
  services: ServiceOrProduct[];
  products: ServiceOrProduct[];
  onClose: () => void;
  onAdd: (item: InvoiceItem) => void;
}> = ({ services, products, onClose, onAdd }) => {
  const [type, setType] = useState<'service' | 'product'>('service');
  const [selectedId, setSelectedId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const items = type === 'service' ? services : products;
  const selectedItem = items.find(i => i.id === selectedId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      onAdd({
        id: selectedItem.id,
        type,
        description: selectedItem.description,
        price: selectedItem.price,
        quantity
      });
    }
  };

  return (
    <div id="add-item-modal" className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md" title="Add Line Item">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4 mb-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-primary-600"
                checked={type === 'service'}
                onChange={() => { setType('service'); setSelectedId(''); setQuantity(1); }}
              />
              <span className="ml-2">Service</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-primary-600"
                checked={type === 'product'}
                onChange={() => { setType('product'); setSelectedId(''); setQuantity(1); }}
              />
              <span className="ml-2">Product</span>
            </label>
          </div>

          <div>
            <label htmlFor="modal-select-item" className="block text-sm font-medium text-slate-700 mb-1">Select {type === 'service' ? 'Service' : 'Product'}</label>
            <select
              id="modal-select-item"
              className="input"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              required
            >
              <option value="">-- Select --</option>
              {items.map(item => (
                <option key={item.id} value={item.id}>
                  {item.description} - ${item.price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {type === 'product' && (
            <div>
              <label htmlFor="modal-quantity" className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
              <input
                id="modal-quantity"
                type="number"
                className="input"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                min="1"
                required
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={!selectedId}>Add Item</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateQuote;
