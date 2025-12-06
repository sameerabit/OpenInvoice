import React, { useEffect, useState } from 'react';
import { fetchInvoices } from '../api';
import type { InvoiceData } from '../types';

interface InvoiceHistoryProps {
  onViewInvoice: (invoice: InvoiceData) => void;
  onEditInvoice?: (invoice: InvoiceData) => void;
  filterStatus?: string; // e.g. 'DRAFT' or 'ISSUED'
}

export const InvoiceHistory: React.FC<InvoiceHistoryProps> = ({ onViewInvoice, onEditInvoice, filterStatus }) => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await fetchInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Failed to load invoices:', error);
      alert('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
     const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
     
     if (filterStatus) {
         if (filterStatus === 'ISSUED') {
             // For 'ISSUED', we might want to include anything NOT Draft? Or strictly 'ISSUED'?
             // Backend defaults to DRAFT. Issued ones have 'ISSUED'.
             // Let's assume strict match for now or NOT DRAFT.
             return matchesSearch && invoice.status !== 'DRAFT'; 
         }
         return matchesSearch && invoice.status === filterStatus;
     }
     
     return matchesSearch;
  });

  const calculateTotal = (invoice: InvoiceData): number => {
    return invoice.lineItems.reduce((sum, item) => {
      if (item.included) return sum;
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading invoices...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Invoice History</h2>
        <div className="text-sm text-gray-600">
          {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by invoice number or customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {searchTerm ? 'No invoices found matching your search.' : 'No invoices yet.'}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(invoice.issuedOn)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>{invoice.customerName}</div>
                    {invoice.customerAddress && (
                      <div className="text-xs text-gray-500">{invoice.customerAddress}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {invoice.vehicleRego ? (
                      <div>
                        <div className="font-medium">{invoice.vehicleRego}</div>
                        {invoice.vehicleDesc && (
                          <div className="text-xs">{invoice.vehicleDesc}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    ${calculateTotal(invoice).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${invoice.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {invoice.status || 'ISSUED'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => onViewInvoice(invoice)}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      View
                    </button>
                    {onEditInvoice && (
                        <button
                            onClick={() => onEditInvoice(invoice)}
                            className="text-indigo-600 hover:text-indigo-900 font-medium ml-4"
                        >
                            Edit
                        </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
