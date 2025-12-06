import React from 'react';
import type { InvoiceData } from '../types';

interface InvoiceDetailsProps {
  data: InvoiceData;
  onDataChange?: (field: keyof InvoiceData, value: string) => void;
}

const DetailLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="font-semibold text-gray-700">{children}</span>
);

const EditableInput: React.FC<{ value: string; onChange?: (value:string) => void, ariaLabel?: string }> = ({ value, onChange, ariaLabel }) => {
    if (!onChange) {
        return <span className="w-full p-1 -m-1 block">{value}</span>;
    }
    return (
     <input
        type="text"
        className="w-full p-1 -m-1 bg-transparent border-none focus:ring-1 focus:ring-blue-500 focus:bg-white rounded-md transition-all no-print:hover:bg-gray-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
    />
)};

const EditableTextarea: React.FC<{ value: string; onChange?: (value:string) => void, ariaLabel?: string }> = ({ value, onChange, ariaLabel }) => {
    if (!onChange) {
        return <div className="w-full p-1 -m-1 whitespace-pre-wrap">{value}</div>;
    }
    return (
    <textarea
        className="w-full p-1 -m-1 bg-transparent border-none focus:ring-1 focus:ring-blue-500 focus:bg-white rounded-md transition-all no-print:hover:bg-gray-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        aria-label={ariaLabel}
    />
)};

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ data, onDataChange }) => {
  return (
    <div className="flex justify-between mb-8 text-sm">
      {/* Left side - Customer Information */}
      <div className="w-1/2">
        <div className="grid grid-cols-[80px_1fr] gap-x-2 items-start">
          <DetailLabel>Issued to:</DetailLabel>
          <div>
            <EditableInput value={data.customerName} onChange={onDataChange ? (val) => onDataChange('customerName', val) : undefined} ariaLabel="Customer name" />
            <EditableTextarea value={data.customerAddress} onChange={onDataChange ? (val) => onDataChange('customerAddress', val) : undefined} ariaLabel="Customer address" />
          </div>
        </div>
      </div>

      {/* Right side - Invoice & Vehicle Details */}
      <div className="w-1/2">
        <div className="grid grid-cols-[80px_1fr] gap-x-2 gap-y-1 ml-auto max-w-sm">
          <DetailLabel>Date:</DetailLabel>
          <EditableInput value={data.date} onChange={onDataChange ? (val) => onDataChange('date', val) : undefined} ariaLabel="Invoice date" />
          
          <DetailLabel>INV No:</DetailLabel>
          <EditableInput value={data.invoiceNumber} onChange={onDataChange ? (val) => onDataChange('invoiceNumber', val) : undefined} ariaLabel="Invoice number" />
          
          <DetailLabel>Rego:</DetailLabel>
          <EditableInput value={data.vehicleRego} onChange={onDataChange ? (val) => onDataChange('vehicleRego', val) : undefined} ariaLabel="Vehicle registration" />
          
          <DetailLabel>Odo:</DetailLabel>
          <EditableInput value={data.vehicleOdo} onChange={onDataChange ? (val) => onDataChange('vehicleOdo', val) : undefined} ariaLabel="Vehicle odometer" />
          
          <DetailLabel>Desc:</DetailLabel>
          <EditableInput value={data.vehicleDesc} onChange={onDataChange ? (val) => onDataChange('vehicleDesc', val) : undefined} ariaLabel="Vehicle description" />
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;