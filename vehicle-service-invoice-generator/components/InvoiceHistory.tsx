import React, { useEffect, useState } from 'react';
import { fetchInvoices } from '../api';
import type { InvoiceData } from '../types';
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from './ui/Table';

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
        <div className="text-slate-400">Loading invoices...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Invoice History</h2>
        <div className="text-sm text-slate-400">
          {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by invoice number or customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-sm"
        />
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          {searchTerm ? 'No invoices found matching your search.' : 'No invoices yet.'}
        </div>
      ) : (
          <TableContainer>
            <Table>
              <Thead>
                <Tr className="hover:bg-transparent">
                  <Th>
                  Invoice #
                  </Th>
                  <Th>
                  Date
                  </Th>
                  <Th>
                  Customer
                  </Th>
                  <Th>
                  Vehicle
                  </Th>
                  <Th className="text-right">
                  Total
                  </Th>
                  <Th className="text-center">
                  Status
                  </Th>
                  <Th className="text-right">
                  Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
              {filteredInvoices.map((invoice) => (
                <Tr key={invoice.id}>
                  <Td className="font-bold">
                    {invoice.invoiceNumber}
                  </Td>
                  <Td className="text-slate-600">
                    {formatDate(invoice.issuedOn)}
                  </Td>
                  <Td>
                    <div>{invoice.customerName}</div>
                    {invoice.customerAddress && (
                      <div className="text-xs text-slate-400">{invoice.customerAddress}</div>
                    )}
                  </Td>
                  <Td className="text-slate-600">
                    {invoice.vehicleRego ? (
                      <div>
                        <div className="font-medium">{invoice.vehicleRego}</div>
                        {invoice.vehicleDesc && (
                          <div className="text-xs">{invoice.vehicleDesc}</div>
                        )}
                      </div>
                    ) : (
                        <span className="text-slate-500">-</span>
                    )}
                  </Td>
                  <Td className="text-right font-bold text-slate-900">
                    ${calculateTotal(invoice).toFixed(2)}
                  </Td>
                  <Td className="text-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${invoice.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {invoice.status || 'ISSUED'}
                    </span>
                  </Td>
                  <Td className="text-right">
                    <button
                      onClick={() => onViewInvoice(invoice)}
                      className="text-blue-600 hover:text-blue-800 font-semibold uppercase text-xs tracking-wide"
                    >
                      View
                    </button>
                    {onEditInvoice && (
                        <button
                            onClick={() => onEditInvoice(invoice)}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold uppercase text-xs tracking-wide ml-4"
                        >
                            Edit
                        </button>
                    )}
                  </Td>
                </Tr>
              ))}
              </Tbody>
            </Table>
          </TableContainer>
      )}
    </div>
  );
};
