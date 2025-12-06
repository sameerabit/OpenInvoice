
import React from 'react';

const InvoiceFooter: React.FC = () => {
  return (
    <div className="text-xs pt-8 border-t mt-8">
      <h4 className="font-bold text-sm mb-2">Electronic Funds Transfer details</h4>
      <p><span className="font-semibold">Bank:</span> Commonwealth</p>
      <p><span className="font-semibold">Bank Name:</span> LARA Auto Services BSB: 067-873</p>
      <p><span className="font-semibold">Account No:</span> 15241388</p>
    </div>
  );
};

export default InvoiceFooter;