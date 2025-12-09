
import React from 'react';

const InvoiceFooter: React.FC = () => {
  return (
    <div className="text-xs pt-8 border-t mt-8">
      <h4 className="font-bold text-sm mb-2">Electronic Funds Transfer details</h4>
      <p><span className="font-semibold">Bank:</span> </p>
      <p><span className="font-semibold">Bank Name:</span> </p>
      <p><span className="font-semibold">Account No:</span> </p>
    </div>
  );
};

export default InvoiceFooter;