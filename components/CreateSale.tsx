import React, { useState, useEffect } from 'react';
import type { Customer, InvoiceData, LineItem, ServiceOrProduct } from '../types';
import AddItemModal from './AddItemModal';

interface CreateSaleProps {
    customers: Customer[];
    services: ServiceOrProduct[];
    products: ServiceOrProduct[];
    onCreateInvoice: (data: Omit<InvoiceData, 'invoiceNumber' | 'date'>) => void;
}

type LocalCustomerDetails = {
    name: string;
    address: string;
    vehicleRego: string;
    vehicleOdo: string;
    vehicleDesc: string;
};

const emptyCustomer: LocalCustomerDetails = {
    name: '',
    address: '',
    vehicleRego: '',
    vehicleOdo: '',
    vehicleDesc: '',
};

const CreateSale: React.FC<CreateSaleProps> = ({ customers, services, products, onCreateInvoice }) => {
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const [customerDetails, setCustomerDetails] = useState(emptyCustomer);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
    const [lineItems, setLineItems] = useState<LineItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    useEffect(() => {
        if (selectedCustomerId) {
            const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
            if (selectedCustomer) {
                const firstVehicle = (selectedCustomer.vehicles && selectedCustomer.vehicles[0]) || null;
                setSelectedVehicleId(firstVehicle ? firstVehicle.id : '');
                setCustomerDetails({
                    name: selectedCustomer.name,
                    address: selectedCustomer.address,
                    vehicleRego: firstVehicle ? firstVehicle.rego : '',
                    vehicleOdo: firstVehicle ? firstVehicle.odo : '',
                    vehicleDesc: firstVehicle ? firstVehicle.desc : '',
                });
            }
        } else {
            setCustomerDetails(emptyCustomer);
            setSelectedVehicleId('');
        }
    }, [selectedCustomerId, customers]);

    useEffect(() => {
        if (!selectedCustomerId) return;
        const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
        if (!selectedCustomer) return;
        const vehicle = (selectedCustomer.vehicles || []).find(v => v.id === selectedVehicleId);
        if (vehicle) {
            setCustomerDetails(prev => ({ ...prev, vehicleRego: vehicle.rego, vehicleOdo: vehicle.odo, vehicleDesc: vehicle.desc }));
        }
    }, [selectedVehicleId, selectedCustomerId, customers]);

    const handleInputChange = (field: keyof typeof emptyCustomer, value: string) => {
        setCustomerDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleItemChange = (id: string, field: keyof LineItem, value: string | number) => {
        setLineItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleAddCustomItem = () => {
        const newItem: LineItem = {
          id: crypto.randomUUID(),
          description: '',
          quantity: 1,
          price: 0,
        };
        setLineItems(prev => [...prev, newItem]);
    };

    const handleAddItemsFromList = (itemsToAdd: ServiceOrProduct[]) => {
        const newItems: LineItem[] = itemsToAdd.map(item => {
            // Special handling for Standard Maintenance Service
            if (item.description === 'Standard Maintenance Service') {
                const standardMaintenanceChecklist = `Standard Maintenance Service\n✓ Checked and topped up all fluids\n✓ Checked lights, indicators and their operation\n✓ Checked front and rear brake shoes/pads\n✓ Checked steering and suspension systems\n✓ Checked windscreen wipers and washers\n✓ Checked the air filter\n✓ Inspected the vehicle for safety issues\n✓ Checked all external engine belts and hoses\n✓ Checked tyres and pressures`;
                return {
                    id: crypto.randomUUID(),
                    description: standardMaintenanceChecklist,
                    quantity: 1,
                    price: item.price,
                    isStandardMaintenance: true,
                } as any;
            }
            return {
                id: crypto.randomUUID(),
                description: item.description,
                quantity: 1,
                price: item.price,
            };
        });
        setLineItems(prev => [...prev, ...newItems]);
    };

    const handleRemoveItem = (id: string) => {
        setLineItems(prev => prev.filter(item => item.id !== id));
    };

    const handleDescriptionChange = (id: string, value: string, textarea: HTMLTextAreaElement) => {
        handleItemChange(id, 'description', value);
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerDetails.name) {
            alert('Customer Name is required.');
            return;
        }
        onCreateInvoice({
            customerName: customerDetails.name,
            customerAddress: customerDetails.address,
            vehicleRego: customerDetails.vehicleRego,
            vehicleOdo: customerDetails.vehicleOdo,
            vehicleDesc: customerDetails.vehicleDesc,
            lineItems: lineItems,
        });
    };

    const grandTotal = lineItems.reduce((total, item) => {
        const quantity = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        return total + (quantity * price);
    }, 0);
    
    return (
        <>
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-2 text-gray-800">New Sale</h1>
                <p className="mb-6 text-gray-500">Select an existing customer or enter details for a new one.</p>
                
                <div className="mb-6">
                    <label htmlFor="customer-select" className="block text-sm font-medium text-gray-700 mb-1">Select Existing Customer</label>
                    <select 
                        id="customer-select" 
                        value={selectedCustomerId} 
                        onChange={e => setSelectedCustomerId(e.target.value)}
                        className="form-input"
                    >
                        <option value="">-- New Customer --</option>
                        {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>
                                {customer.name} - {(customer.vehicles || [])[0]?.rego || 'no vehicle'}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedCustomerId && (
                    <div className="mb-6">
                        <label htmlFor="vehicle-select" className="block text-sm font-medium text-gray-700 mb-1">Select Vehicle</label>
                        <select id="vehicle-select" value={selectedVehicleId} onChange={e => setSelectedVehicleId(e.target.value)} className="form-input">
                            <option value="">-- Enter vehicle manually --</option>
                            {(() => {
                                const cust = customers.find(c => c.id === selectedCustomerId);
                                return (cust?.vehicles || []).map(v => (
                                    <option key={v.id} value={v.id}>{v.rego} — {v.desc}</option>
                                ));
                            })()}
                        </select>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-700 border-t pt-6">Customer & Vehicle Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                            <input id="name" type="text" value={customerDetails.name} onChange={e => handleInputChange('name', e.target.value)} placeholder="e.g., John Smith" className="form-input" required />
                        </div>
                         <div>
                            <label htmlFor="rego" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Rego (Number Plate)</label>
                            <input id="rego" type="text" value={customerDetails.vehicleRego} onChange={e => handleInputChange('vehicleRego', e.target.value)} placeholder="e.g., ABC-123" className="form-input" />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea id="address" value={customerDetails.address} onChange={e => handleInputChange('address', e.target.value)} placeholder="123 Main Street..." rows={3} className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="odo" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Odometer (km)</label>
                            <input id="odo" type="text" value={customerDetails.vehicleOdo} onChange={e => handleInputChange('vehicleOdo', e.target.value)} placeholder="e.g., 150,000 km" className="form-input" />
                        </div>
                        <div>
                            <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Description</label>
                            <input id="desc" type="text" value={customerDetails.vehicleDesc} onChange={e => handleInputChange('vehicleDesc', e.target.value)} placeholder="e.g., 2020 Honda Civic" className="form-input" />
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Invoice Items</h2>
                        <table className="w-full border-collapse border border-gray-300 mb-4">
                            <thead>
                                <tr className="bg-gray-100 text-sm font-semibold">
                                    <th className="border p-2 text-left">DESCRIPTION</th>
                                    <th className="border p-2 text-center w-20">QTY</th>
                                    <th className="border p-2 text-center w-28">PRICE ($)</th>
                                    <th className="border p-2 text-center w-28">SUBTOTAL</th>
                                    <th className="w-8"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {lineItems.map((item) => (
                                <tr key={item.id} className="text-sm">
                                    <td className="border p-2 align-top">
                                    <textarea
                                        value={item.description}
                                        onChange={(e) => handleDescriptionChange(item.id, e.target.value, e.currentTarget)}
                                        className="w-full p-0 m-0 bg-transparent border-none focus:ring-0 resize-none"
                                        rows={item.description.split('\n').length || 1}
                                    />
                                    </td>
                                    <td className="border p-2 align-top">
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value === '' ? '' : parseFloat(e.target.value))}
                                        className="w-full p-0 m-0 text-center bg-transparent border-none focus:ring-0"
                                        aria-label="Quantity"
                                    />
                                    </td>
                                    <td className="border p-2 align-top">
                                    <input
                                        type="number"
                                        value={item.price}
                                        onChange={(e) => handleItemChange(item.id, 'price', e.target.value === '' ? '' : parseFloat(e.target.value))}
                                        className="w-full p-0 m-0 text-center bg-transparent border-none focus:ring-0"
                                        aria-label="Price"
                                    />
                                    </td>
                                    <td className="border p-2 text-center align-top">
                                    {(Number(item.quantity) * Number(item.price) || 0).toFixed(2)}
                                    </td>
                                    <td className="p-1 text-center align-middle">
                                    <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700 opacity-50 hover:opacity-100 transition-opacity" aria-label="Remove item">
                                        &#x2715;
                                    </button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex flex-wrap items-center mt-4 space-x-0 sm:space-x-4 space-y-2 sm:space-y-0">
                            <button type="button" onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                                + Add Item from List
                            </button>
                            <button type="button" onClick={handleAddCustomItem} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                                + Add Custom Line
                            </button>
                        </div>

                         <div className="flex justify-end mt-4">
                            <div className="w-full sm:w-1/2 md:w-1/3">
                                <div className="flex justify-between items-center border-t-2 border-b-2 border-gray-400 py-2">
                                    <span className="font-bold text-lg">GRAND TOTAL</span>
                                    <span className="font-bold text-lg">$ {grandTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                    
                    <div className="text-right pt-4 border-t mt-6">
                        <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors text-lg">
                            Create Invoice
                        </button>
                    </div>
                </form>
                <style>{`.form-input { display: block; width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); transition: box-shadow 0.15s ease-in-out, border-color 0.15s ease-in-out; } .form-input:focus { outline: none; border-color: #4F46E5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3); }`}</style>

            </div>
            {isModalOpen && (
                <AddItemModal 
                    services={services}
                    products={products}
                    onClose={() => setIsModalOpen(false)}
                    onAddItems={handleAddItemsFromList}
                />
            )}
        </>
    );
};

export default CreateSale;