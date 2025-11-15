
import React from 'react';

const InvoiceHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-serif text-blue-700">LARA AUTO SERVICES</h1>
        <div className="text-xs text-gray-600 mt-2">
            <p>ABN 634 2523 5350</p>
            <p>Phone: 0451 537 662</p>
        </div>
      </div>
      <div className="text-right">
        <h2 className="text-5xl md:text-6xl font-sans font-bold uppercase tracking-wider">Invoice</h2>
      </div>
    </div>
  );
};

export default InvoiceHeader;