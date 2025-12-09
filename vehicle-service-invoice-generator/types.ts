export interface LineItem {
  id: string;
  description: string;
  quantity?: number;
  price?: number;
  included?: boolean;
  includedBy?: string;
  isChecklist?: boolean;
}

export interface InvoiceData {
  id?: string;
  customerId?: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerAddress?: string;
  vehicleRego?: string;
  vehicleOdo?: string;
  vehicleDesc?: string;
  lineItems: LineItem[];
  status?: string;
}

export interface QuotationData {
  id?: string;
  customerId?: string;
  quotationNumber: string;
  date: string;
  customerName: string;
  customerAddress?: string;
  vehicleRego?: string;
  vehicleOdo?: string;
  vehicleDesc?: string;
  lineItems: LineItem[];
  status?: string;
}

export interface ServiceOrProduct {
  id: string;
  description: string;
  price: number;
  type: 'service' | 'product';
  // optional list of product ids that are included with this service
  includedProductIds?: string[];
  // optional checklist for services (newline-separated items)
  checklist?: string;
}

export interface Vehicle {
  id: string;
  rego?: string;
  odo?: string;
  desc?: string;
}

export interface Customer {
  id: string;
  name: string;
  address?: string;
  vehicles: Vehicle[];
}

export interface InvoiceItem {
  id: string;
  type: 'service' | 'product';
  description: string;
  price: number;
  quantity: number;
  included?: boolean;
  includedBy?: string;
  isChecklist?: boolean;
  includedProductIds?: string[];
}
