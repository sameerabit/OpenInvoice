export interface LineItem {
  id: string;
  description: string;
  quantity: number | string;
  price: number | string;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerAddress: string;
  vehicleRego: string;
  vehicleOdo: string;
  vehicleDesc: string;
  lineItems: LineItem[];
}

export interface ServiceOrProduct {
  id: string;
  description: string;
  price: number;
  type: 'service' | 'product';
}

export interface Vehicle {
  id: string;
  rego: string;
  odo: string;
  desc: string;
}

export interface Customer {
    id: string;
    name: string;
    address: string;
  // allow multiple vehicles per customer
  vehicles: Vehicle[];
}
