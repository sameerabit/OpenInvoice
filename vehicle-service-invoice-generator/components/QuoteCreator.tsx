import React, { useState } from 'react';
import { updateQuotation } from '../api';


import InvoiceHeader from './InvoiceHeader';
import QuoteDetails from './QuoteDetails';
import InvoiceTable from './InvoiceTable';
import InvoiceFooter from './InvoiceFooter';
import type { QuotationData, LineItem } from '../types';

interface QuoteCreatorProps {
  initialData: QuotationData;
}

const QuoteCreator: React.FC<QuoteCreatorProps> = ({ initialData }) => {
  const [data, setData] = useState<QuotationData>(initialData);

  const handleDataChange = (field: keyof QuotationData, value: string) => {
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
          await updateQuotation(data.id, data);
          alert('Quotation saved successfully');
      } catch (err) {
          console.error("Failed to save quotation", err);
          alert("Failed to save quotation");
      }
  };



  return (
    <div className="max-w-4xl mx-auto">
        {/* Actions Bar */}
      <div className="mb-6 flex justify-between items-center no-print bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <div className="text-sm text-slate-500">
            Previewing Quote: <span className="font-bold text-slate-900">{data.quotationNumber}</span>
            <span className={`ml-4 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${data.status === 'ISSUED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {data.status || 'DRAFT'}
            </span>
        </div>
        <div className="space-x-4">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <span className="mr-2">💾</span> Save Changes
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors inline-flex items-center"
          >
            <span className="mr-2">🖨️</span> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Quote Preview */}
      <div id="invoice-preview" className="bg-white p-8 shadow-lg min-h-[29.7cm] relative"> {/* A4 approx height */}
        <InvoiceHeader title="Quotation" />
        
        <div className="mt-8">
            <QuoteDetails data={data} onDataChange={handleDataChange} />
        </div>

        <InvoiceTable
          items={data.lineItems}
          onItemChange={handleItemChange}
          onAddCustomItem={handleAddCustomItem}
          // Assuming we reuse InvoiceTable logic for displaying items.
          // Note: InvoiceTable uses specific "Invoice" terminology?
          // Looking at InvoiceTable code (viewed earlier), it seems generic enough 
          // (NO, DESCRIPTION, QTY, PRICE, SUBTOTAL).
          // We might want to pass onItemChange to handle updates.
          onRemoveItem={handleRemoveItem}
        />

        <InvoiceFooter />
      </div>
    </div>
  );
};

export default QuoteCreator;
