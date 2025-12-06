import React, { useEffect, useState } from 'react';
import { fetchQuotations } from '../api';
import type { QuotationData } from '../types';

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
        <div className="text-gray-500">Loading quotations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quote History</h2>
        <div className="text-sm text-gray-600">
          {filteredQuotations.length} quote{filteredQuotations.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by quote number or customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {filteredQuotations.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {searchTerm ? 'No quotations found matching your search.' : 'No quotations yet.'}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quote #
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
              {filteredQuotations.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {quote.quotationNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(quote.date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>{quote.customerName}</div>
                    {quote.customerAddress && (
                      <div className="text-xs text-gray-500">{quote.customerAddress}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {quote.vehicleRego ? (
                      <div>
                        <div className="font-medium">{quote.vehicleRego}</div>
                        {quote.vehicleDesc && (
                          <div className="text-xs">{quote.vehicleDesc}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    ${calculateTotal(quote).toFixed(2)}
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${quote.status === 'ISSUED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {quote.status || 'DRAFT'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => onViewQuote(quote)}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      View
                    </button>
                    {onEditQuote && (
                        <button
                            onClick={() => onEditQuote(quote)}
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
