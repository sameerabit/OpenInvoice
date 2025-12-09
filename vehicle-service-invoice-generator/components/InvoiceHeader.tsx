
import React from 'react';

interface InvoiceHeaderProps {
  title?: string;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ title = 'Invoice' }) => {
  return (
    <div className="flex justify-between items-start mb-8">
      <div className="flex items-center space-x-4">
        <div className="h-20 w-20 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-3xl font-black text-white">OI</span>
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-tight">OPEN INVOICE</h1>
          <div className="text-xs text-slate-500 mt-2 font-medium">
            <p className="uppercase tracking-wider">Management System</p>
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