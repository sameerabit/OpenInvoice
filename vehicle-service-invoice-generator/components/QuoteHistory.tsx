import React, { useEffect, useState } from 'react';
import { fetchQuotations } from '../api';
import type { QuotationData } from '../types';
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from './ui/Table';
interface QuoteHistoryProps {
  onViewQuote: (quote: QuotationData) => void;
  filterStatus?: string;
  onEditQuote?: (quote: QuotationData) => void; 
}

export const QuoteHistory: React.FC<QuoteHistoryProps> = ({ onViewQuote, filterStatus, onEditQuote }) => {
  const [quotations, setQuotations] = useState<QuotationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = async () => {
    try {
      setLoading(true);
      const data = await fetchQuotations();
      setQuotations(data);
    } catch (error) {
      console.error('Failed to load quotations:', error);
      alert('Failed to load quotations');
    } finally {
      setLoading(false);
    }
  };

  const filteredQuotations = quotations.filter(quote => {
    const matchesSearch = quote.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus) {
         // Same logic as invoices?
         if (filterStatus === 'ISSUED') { // Quotes might use different status? 'ACCEPTED'?
              // For now simpler: match exactly or exclude draft.
             return matchesSearch && quote.status !== 'DRAFT';
         }
         return matchesSearch && (quote.status || 'DRAFT') === filterStatus; 
    }
    return matchesSearch;
  });

  const calculateTotal = (quote: QuotationData): number => {
    return quote.lineItems.reduce((sum, item) => {
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
        <div className="text-slate-400">Loading quotations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Quote History</h2>
        <div className="text-sm text-slate-400">
          {filteredQuotations.length} quote{filteredQuotations.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by quote number or customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-sm"
        />
      </div>

      {filteredQuotations.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          {searchTerm ? 'No quotations found matching your search.' : 'No quotations yet.'}
        </div>
      ) : (
          <TableContainer>
            <Table>
              <Thead>
                <Tr className="hover:bg-transparent">
                  <Th>Quote #</Th>
                  <Th>Date</Th>
                  <Th>Customer</Th>
                  <Th>Vehicle</Th>
                  <Th className="text-right">Total</Th>
                  <Th className="text-center">Status</Th>
                  <Th className="text-right">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
              {filteredQuotations.map((quote) => (
                <Tr key={quote.id}>
                  <Td className="font-bold text-slate-900">
                    {quote.quotationNumber}
                  </Td>
                  <Td className="text-slate-600">
                    {formatDate(quote.date)}
                  </Td>
                  <Td>
                    <div className="text-slate-900">{quote.customerName}</div>
                    {quote.customerAddress && (
                      <div className="text-xs text-slate-500">{quote.customerAddress}</div>
                    )}
                  </Td>
                  <Td className="text-slate-600">
                    {quote.vehicleRego ? (
                      <div>
                        <div className="font-medium text-slate-900">{quote.vehicleRego}</div>
                        {quote.vehicleDesc && (
                          <div className="text-xs text-slate-500">{quote.vehicleDesc}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </Td>
                  <Td className="text-right font-bold text-slate-900">
                    ${calculateTotal(quote).toFixed(2)}
                  </Td>
                  <Td className="text-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${quote.status === 'ISSUED' || quote.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {quote.status || 'DRAFT'}
                    </span>
                  </Td>
                  <Td className="text-right">
                    <button
                      onClick={() => onViewQuote(quote)}
                      className="text-blue-600 hover:text-blue-800 font-semibold uppercase text-xs tracking-wide"
                    >
                      View
                    </button>
                    {onEditQuote && (
                        <button
                            onClick={() => onEditQuote(quote)}
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
