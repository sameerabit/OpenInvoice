import React from 'react';
import type { LineItem } from '../types';

interface InvoiceTableProps {
  items: LineItem[];
  onItemChange?: (id: string, field: keyof LineItem, value: string | number) => void;
  onAddCustomItem?: () => void;
  onOpenAddItemModal?: () => void;
  onRemoveItem?: (id: string) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ items, onItemChange, onAddCustomItem, onOpenAddItemModal, onRemoveItem }) => {

  const handleDescriptionChange = (id: string, value: string, textarea: HTMLTextAreaElement) => {
    if (onItemChange) {
      onItemChange(id, 'description', value);
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Helper to get parent service description
  const getParentServiceDescription = (item: LineItem) => {
    if ((item as any).includedBy) {
      const parentService = items.find(i => i.id === (item as any).includedBy);
      if (parentService) {
        return parentService.description.split('\n')[0]; // Get first line
      }
    }
    return null;
  };

  const grandTotal = items.reduce((total, item) => {
    const quantity = Number(item.quantity) || 0;
    const price = Number(item.price) || 0;
    return total + (quantity * price);
  }, 0);

  return (
    <div className="mb-8">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-sm font-semibold">
            <th className="border border-gray-300 p-2 text-center w-12">NO</th>
            <th className="border border-gray-300 p-2 text-left">DESCRIPTION</th>
            <th className="border border-gray-300 p-2 text-center w-20">QTY</th>
            <th className="border border-gray-300 p-2 text-center w-28">PRICE ($)</th>
            <th className="border border-gray-300 p-2 text-center w-28">SUBTOTAL</th>
            {onRemoveItem && <th className="w-8 no-print"></th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const isSpecial = Boolean((item as any).included || (item as any).isChecklist);
            const isIncluded = Boolean((item as any).included);
            const isChecklist = Boolean((item as any).isChecklist);
            const quantity = Number(item.quantity) || 0;
            const price = Number(item.price) || 0;
            const subtotal = quantity * price;

            return (
              <tr key={item.id} className={`text-sm ${isIncluded ? 'bg-blue-50' : ''} ${isChecklist ? 'bg-gray-50' : ''}`}>
                <td className="border-x border-gray-300 p-2 text-center align-top">
                  {!isIncluded && !isChecklist ? index + 1 : ''}
                </td>
                <td className="border-x border-gray-300 p-2 align-top">
                  <div className={isIncluded ? 'pl-4' : isChecklist ? 'ml-4 pl-2 border-l-2 border-gray-400' : ''}>
                    {onItemChange ? (
                      <textarea
                        value={item.description}
                        onChange={(e) => handleDescriptionChange(item.id, e.target.value, e.currentTarget)}
                        className={`w-full p-0 m-0 bg-transparent border-none focus:ring-0 resize-none ${isChecklist ? 'text-gray-600 text-xs' : ''}`}
                        rows={item.description.split('\n').length || 1}
                      />
                    ) : (
                        <div className={`whitespace-pre-wrap ${isChecklist ? 'text-gray-600 text-xs' : ''}`}>{item.description}</div>
                    )}
                  </div>
                </td>
                <td className="border-x border-gray-300 p-2 align-top text-center">
                  {isSpecial ? (
                    <span>&nbsp;</span>
                  ) : onItemChange ? (
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => onItemChange(item.id, 'quantity', e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full p-0 m-0 text-center bg-transparent border-none focus:ring-0"
                      aria-label="Quantity"
                    />
                  ) : (
                    <span>{item.quantity}</span>
                  )}
                </td>
                <td className="border-x border-gray-300 p-2 align-top text-center">
                  {isSpecial ? (
                    <span>&nbsp;</span>
                  ) : onItemChange ? (
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => onItemChange(item.id, 'price', e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full p-0 m-0 text-center bg-transparent border-none focus:ring-0"
                      aria-label="Price"
                    />
                  ) : (
                     <span>{Number(item.price).toFixed(2)}</span>
                  )}
                </td>
                <td className="border-x border-gray-300 p-2 text-center align-top">
                  {!isSpecial && subtotal > 0 ? subtotal.toFixed(2) : ''}
                </td>
                {onRemoveItem && (
                  <td className="border-r border-gray-300 p-1 text-center align-middle no-print">
                    <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-700 opacity-50 hover:opacity-100 transition-opacity" aria-label="Remove item">
                      &#x2715;
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {onOpenAddItemModal && onAddCustomItem && (
        <div className="flex flex-wrap items-center mt-4 space-x-0 sm:space-x-4 space-y-2 sm:space-y-0 no-print">
          <button onClick={onOpenAddItemModal} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
              + Add Item from List
          </button>

          <button onClick={onAddCustomItem} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              + Add Custom Line
          </button>
        </div>
      )}

      <div className="flex justify-end mt-4">
        <div className="w-full sm:w-1/2 md:w-1/3">
            <div className="flex justify-between items-center border-t-2 border-b-2 border-gray-400 py-2">
                <span className="font-bold text-lg">GRAND TOTAL</span>
                <span className="font-bold text-lg">$ {grandTotal.toFixed(2)}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTable;