export interface LineItem {
  id: string;
  description: string;
  // quantity and price are optional for special items (checklists / included products)
  quantity?: number | string;
  price?: number | string;
  // Marks a line that is included as part of a service (cost included in service)
  included?: boolean;
  // id of the service that included this product
  includedBy?: string;
  // flag for the special Standard Maintenance checklist
  isStandardMaintenance?: boolean;
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
  // optional list of product ids that are included with this service
  includedProductIds?: string[];
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
