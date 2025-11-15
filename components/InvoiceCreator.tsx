import React from 'react';
import type { InvoiceData } from '../types';
import InvoiceHeader from './InvoiceHeader';
import InvoiceDetails from './InvoiceDetails';
import InvoiceTable from './InvoiceTable';
import InvoiceFooter from './InvoiceFooter';

interface InvoiceCreatorProps {
  initialData: InvoiceData;
}

const InvoiceCreator: React.FC<InvoiceCreatorProps> = ({ initialData }) => {

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
        <div className="printable-area max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-lg rounded-lg border border-gray-200">
            <InvoiceHeader />
            <InvoiceDetails data={initialData} />
            <InvoiceTable 
                items={initialData.lineItems} 
            />
            <InvoiceFooter />
        </div>
        <div className="max-w-4xl mx-auto text-center mt-8 no-print">
            <button 
                onClick={handlePrint} 
                className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors"
            >
                Print / Save as PDF
            </button>
        </div>
    </>
  );
}

export default InvoiceCreator;