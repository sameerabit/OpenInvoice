import api from './client';
import type { Customer, InvoiceData, LineItem, QuotationData, ServiceOrProduct, Vehicle } from '../types';

export type LookupsResponse = {
  customers: Customer[];
  services: ServiceOrProduct[];
  products: ServiceOrProduct[];
};

export type CustomerPayload = {
  name: string;
  address?: string;
  vehicles?: Array<Pick<Vehicle, 'rego' | 'odo' | 'desc'>>;
};

export type VehiclePayload = Pick<Vehicle, 'rego' | 'odo' | 'desc'>;

export type ServicePayload = {
  description: string;
  price: number;
  checklist?: string;
  includedProductIds?: string[];
};

export type ProductPayload = {
  description: string;
  price: number;
};

export type InvoicePayload = {
  customerId?: string;
  customerName: string;
  customerAddress?: string;
  vehicleRego?: string;
  vehicleOdo?: string;
  vehicleDesc?: string;
  lineItems: LineItem[];
  date?: string;
};

export type UpdateServicePayload = {
  description?: string;
  price?: number;
  includedProductIds?: string[];
};

export const fetchLookups = async (): Promise<LookupsResponse> => {
  const { data } = await api.get('/lookups');
  return data;
};

export const createCustomer = async (payload: CustomerPayload) => {
  const { data } = await api.post('/customers', payload);
  return data as Customer;
};

export const updateCustomer = async (id: string, payload: Partial<CustomerPayload>) => {
  const { data } = await api.patch(`/customers/${id}`, payload);
  return data as Customer;
};

export const deleteCustomer = async (id: string) => {
  await api.delete(`/customers/${id}`);
};

export const addVehicle = async (customerId: string, payload: VehiclePayload) => {
  const { data } = await api.post(`/customers/${customerId}/vehicles`, payload);
  return data as Vehicle;
};

export const updateVehicle = async (customerId: string, vehicleId: string, payload: VehiclePayload) => {
  const { data } = await api.patch(`/customers/${customerId}/vehicles/${vehicleId}`, payload);
  return data as Vehicle;
};

export const deleteVehicle = async (customerId: string, vehicleId: string) => {
  await api.delete(`/customers/${customerId}/vehicles/${vehicleId}`);
};

export const createService = async (payload: ServicePayload) => {
  const { data } = await api.post('/services', payload);
  return data as ServiceOrProduct;
};

export const updateService = async (id: string, payload: UpdateServicePayload) => {
   const { data } = await api.patch(`/services/${id}`, payload);
   return data as ServiceOrProduct;
};

export const deleteService = async (id: string) => {
   await api.delete(`/services/${id}`);
};

export const createProduct = async (payload: ProductPayload) => {
  const { data } = await api.post('/products', payload);
  return data as ServiceOrProduct;
};

export const deleteProduct = async (id: string) => {
  await api.delete(`/products/${id}`);
};

export const fetchInvoices = async (): Promise<InvoiceData[]> => {
  const { data } = await api.get('/invoices');
  return data;
};

export const createInvoice = async (payload: InvoicePayload) => {
  const { data } = await api.post('/invoices', payload);
  return data as InvoiceData;
};

export const updateInvoice = async (id: string, payload: InvoicePayload) => {
  const { data } = await api.put(`/invoices/${id}`, payload);
  return data as InvoiceData;
};

export const fetchQuotations = async (): Promise<QuotationData[]> => {
  const { data } = await api.get('/quotations');
  return data;
};

export const createQuotation = async (payload: InvoicePayload) => {
  const { data } = await api.post('/quotations', payload);
  return data as QuotationData;
};

export const updateQuotation = async (id: string, payload: InvoicePayload) => {
  const { data } = await api.put(`/quotations/${id}`, payload);
  return data as QuotationData;
};

