
import React from 'react';

interface InvoiceHeaderProps {
  title?: string;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ title = 'Invoice' }) => {
  return (
    <div className="flex justify-between items-start mb-8">
      <div className="flex items-center space-x-4">
        <img
          src="/assets/lara-logo.jpg"
          alt="LARA Auto Services Logo"
          className="w-32 h-32 object-contain"
        />
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-blue-700">LARA AUTO SERVICES</h1>
          <div className="text-xs text-gray-600 mt-2">
            <p>ABN 634 2523 5350</p>
            <p>Phone: 0451 537 662</p>
          </div>
        </div>
      </div>
      <div className="text-right">
        <h2 className="text-5xl md:text-6xl font-sans font-bold uppercase tracking-wider">{title}</h2>
      </div>
    </div>
  );
};

export default InvoiceHeader;