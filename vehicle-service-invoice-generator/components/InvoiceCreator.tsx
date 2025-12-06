import React, { useState } from 'react';
import { updateInvoice } from '../api';
import type { InvoiceData, LineItem } from '../types';
import InvoiceHeader from './InvoiceHeader';
import InvoiceDetails from './InvoiceDetails';
import InvoiceTable from './InvoiceTable';
import InvoiceFooter from './InvoiceFooter';

interface InvoiceCreatorProps {
  initialData: InvoiceData;
}

const InvoiceCreator: React.FC<InvoiceCreatorProps> = ({ initialData }) => {
  const [data, setData] = useState<InvoiceData>(initialData);

  const handleDataChange = (field: keyof InvoiceData, value: string) => {
    setData({ ...data, [field]: value });
  };

  const handleItemChange = (id: string, field: keyof LineItem, value: string | number) => {
    const newItems = data.lineItems.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setData({ ...data, lineItems: newItems });
  };

  const handleAddCustomItem = () => {
    const newItem: LineItem = {
      id: crypto.randomUUID(),
      description: 'New Item',
      quantity: 1,
      price: 0,
    };
    setData({ ...data, lineItems: [...data.lineItems, newItem] });
  };

  const handleRemoveItem = (id: string) => {
    // Find the item to remove
    const itemToRemove = data.lineItems.find(item => item.id === id);
    if (!itemToRemove) return;

    let newItems = data.lineItems.filter(item => item.id !== id);

    // If removing a service, also remove its included items
    if (!itemToRemove.included && !itemToRemove.isChecklist) {
      // It's a parent item (service or product)
      // Remove items included by this one
      newItems = newItems.filter(item => item.includedBy !== id);
    }

    setData({ ...data, lineItems: newItems });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = async () => {
    if (!data.id) return;
    try {
      await updateInvoice(data.id, {
        ...data,
        // clean up any types if needed
      });
      alert('Invoice saved successfully');
    } catch (err) {
      console.error("Failed to save invoice", err);
      alert("Failed to save invoice");
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto md:p-8 no-print">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            Status: <span className={`${data.status === 'ISSUED' ? 'text-green-600' : 'text-yellow-600'}`}>{data.status || 'DRAFT'}</span>
          </div>
          <div className="space-x-4">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              <span className="mr-2">💾</span> Save Changes
            </button>
            <button
              onClick={handlePrint} 
              className="px-6 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors inline-flex items-center"
            >
              <span className="mr-2">🖨️</span> Print / Save as PDF
            </button>
          </div>
        </div>
      </div>

      <div id="invoice-preview" className="printable-area max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-lg rounded-lg border border-gray-200 min-h-[29.7cm] relative">
        <InvoiceHeader title="Tax Invoice" />
        <InvoiceDetails data={data} onDataChange={handleDataChange} />
        <InvoiceTable
          items={data.lineItems}
          onItemChange={handleItemChange}
          onAddCustomItem={handleAddCustomItem}
          onRemoveItem={handleRemoveItem}
        />
        <InvoiceFooter />
      </div>

    </>
  );
}

export default InvoiceCreator;