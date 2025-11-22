import React, { useState } from 'react';
import type { ServiceOrProduct, Customer, InvoiceData } from './types';
import Sidebar from './components/Sidebar';
import InvoiceCreator from './components/InvoiceCreator';
import ManageCustomers from './components/ManageCustomers';
import ManageServices from './components/ManageServices';
import ManageProducts from './components/ManageProducts';
import CreateSale from './components/CreateSale';

const sampleServices: ServiceOrProduct[] = [
  // Standard maintenance includes basic consumables (engine oil + oil filter)
  { id: 's1', description: 'Standard Maintenance Service', price: 140.00, type: 'service', includedProductIds: ['p1', 'p2'] },
  { id: 's2', description: 'Brake Fluid Flush', price: 85.00, type: 'service' },
  { id: 's3', description: 'Tire Rotation & Balance', price: 50.00, type: 'service' },
  { id: 's4', description: 'Labour (per hour)', price: 60.00, type: 'service' },
];

const sampleProducts: ServiceOrProduct[] = [
  { id: 'p1', description: 'Engine Oil (5L)', price: 45.00, type: 'product' },
  { id: 'p2', description: 'Oil Filter', price: 21.00, type: 'product' },
  { id: 'p3', description: 'Air Filter', price: 18.00, type: 'product' },
  { id: 'p4', description: 'Pollen Filter', price: 25.00, type: 'product' },
  { id: 'p5', description: 'Spark Plug (each)', price: 26.00, type: 'product' },
  { id: 'p6', description: 'Rear Wiper Insert', price: 15.00, type: 'product' },
];

const sampleCustomers: Customer[] = [
  { id: 'c1', name: 'Car2u', address: '34 Boondar Street,\nChigwell\nTAS 7011', vehicles: [{ id: 'v1', rego: 'XYZ-123', odo: '150,000 km', desc: '2018 Toyota Hiace' }] },
  { id: 'c2', name: 'John Smith', address: '123 Main Street,\nAnytown\nUSA 12345', vehicles: [{ id: 'v2', rego: 'ABC-789', odo: '87,654 km', desc: '2020 Honda Civic' }] },
];

export type Page = 'new-sale' | 'invoice' | 'customers' | 'services' | 'products';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('new-sale');
  const [invoiceInitialData, setInvoiceInitialData] = useState<InvoiceData | null>(null);

  const [services, setServices] = useState<ServiceOrProduct[]>(sampleServices);
  const [products, setProducts] = useState<ServiceOrProduct[]>(sampleProducts);
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers);

  const handleCreateInvoice = (data: Omit<InvoiceData, 'invoiceNumber' | 'date'>) => {
    const newInvoiceData: InvoiceData = {
        ...data,
        invoiceNumber: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
        date: new Date().toLocaleDateString('en-GB'),
        lineItems: data.lineItems,
    };
    setInvoiceInitialData(newInvoiceData);
    setActivePage('invoice');
  };

  const handleNavigate = (page: Page) => {
    // When navigating to "New Sale" clear any previous invoice data
    if (page === 'new-sale') {
      setInvoiceInitialData(null);
    }
    setActivePage(page);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'new-sale':
        return <CreateSale customers={customers} onCreateInvoice={handleCreateInvoice} services={services} products={products} />;
      case 'invoice':
        if (!invoiceInitialData) {
            // This handles the case where the user might land on the invoice URL directly
            // or if state is lost. It safely redirects to the start of the process.
            return <CreateSale customers={customers} onCreateInvoice={handleCreateInvoice} services={services} products={products} />;
        }
        return <InvoiceCreator initialData={invoiceInitialData} />;
      case 'customers':
        return <ManageCustomers customers={customers} setCustomers={setCustomers} />;
      case 'services':
        return <ManageServices items={services} setItems={setServices} products={products} />;
      case 'products':
        return <ManageProducts items={products} setItems={setProducts} />;
      default:
        return <CreateSale customers={customers} onCreateInvoice={handleCreateInvoice} services={services} products={products} />;
    }
  };

  return (
    <>
      <Sidebar activePage={activePage} setActivePage={handleNavigate} />
      <main className="flex-1 bg-gray-100 p-4 sm:p-6 md:p-8">
        {renderPage()}
      </main>
    </>
  );
}

export default App;