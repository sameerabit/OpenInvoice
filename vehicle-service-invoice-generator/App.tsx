import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { Customer, InvoiceData, ServiceOrProduct } from './types';
import Sidebar from './components/Sidebar';
import InvoiceCreator from './components/InvoiceCreator';
import ManageCustomers from './components/ManageCustomers';
import ManageServices from './components/ManageServices';
import ManageProducts from './components/ManageProducts';
import CreateSale from './components/CreateSale';
import EditCustomer from './components/EditCustomer';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { createInvoice, updateInvoice, fetchLookups, InvoicePayload, updateQuotation } from './api';

import { InvoiceHistory } from './components/InvoiceHistory';

import { QuoteHistory } from './components/QuoteHistory';
import CreateQuote from './components/CreateQuote';
import QuoteCreator from './components/QuoteCreator';



export type Page = 'new-sale' | 'edit-sale' | 'draft-sales' | 'invoice' | 'invoices' | 'customers' | 'edit-customer' | 'services' | 'products' | 'new-quote' | 'edit-quote' | 'draft-quotes' | 'quotations' | 'quote';

const AppContent: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [activePage, setActivePage] = useState<Page>('new-sale');
  const [invoiceInitialData, setInvoiceInitialData] = useState<InvoiceData | null>(null);
  const [quoteInitialData, setQuoteInitialData] = useState<any | null>(null); // Use correct type if available, using any for quick fix or use QuotationData
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [services, setServices] = useState<ServiceOrProduct[]>([]);
  const [products, setProducts] = useState<ServiceOrProduct[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New state for handling public navigation
  const [showLogin, setShowLogin] = useState(false);

  const loadLookups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLookups();
      setCustomers(data.customers);
      setServices(data.services);
      setProducts(data.products);
    } catch (err) {
      console.error(err);
      setError('Unable to load data from the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadLookups();
      setShowLogin(false); // Reset login state when authenticated
    } else {
      setCustomers([]);
      setServices([]);
      setProducts([]);
      setInvoiceInitialData(null);
    }
  }, [isAuthenticated, loadLookups]);

  const handleCreateInvoice = useCallback(async (payload: InvoicePayload) => {
    const createdInvoice = await createInvoice(payload);
    await loadLookups(); // Refresh customer/vehicle lists
    setInvoiceInitialData(createdInvoice);
    if (createdInvoice.status === 'DRAFT') {
      setActivePage('edit-sale');
    } else {
      setActivePage('invoice');
    }
  }, [loadLookups]);

  const handleUpdateInvoice = useCallback(async (id: string, payload: InvoicePayload) => {
    const updatedInvoice = await updateInvoice(id, payload);
    await loadLookups(); // Refresh customer/vehicle lists
    setInvoiceInitialData(updatedInvoice);
    if (updatedInvoice.status === 'DRAFT') {
      setActivePage('draft-sales');
    } else {
      setActivePage('invoice');
    }
  }, [loadLookups]);

  const handleCreateQuote = useCallback(async (payload: any) => {
    const createdQuote = await import('./api').then(m => m.createQuotation(payload));
    await loadLookups(); // Refresh customer/vehicle lists
    setQuoteInitialData(createdQuote);
    if (createdQuote.status === 'DRAFT') {
      setActivePage('edit-quote');
    } else {
      setActivePage('quote');
    }
  }, [loadLookups]);

  const handleUpdateQuote = useCallback(async (id: string, payload: InvoicePayload) => {
    const updatedQuote = await updateQuotation(id, payload);
    await loadLookups(); // Refresh customer/vehicle lists
    setQuoteInitialData(updatedQuote);
    if (updatedQuote.status === 'DRAFT') {
      setActivePage('draft-quotes');
    } else {
      setActivePage('quote');
    }
  }, [loadLookups]);

  const handleNavigate = (page: Page) => {
    if (page === 'new-sale') {
      setInvoiceInitialData(null);
    }
    if (page === 'edit-sale' && !invoiceInitialData) {
      // Should usually not happen via direct nav, but if so, redirect
      setActivePage('invoices');
      return;
    }
    if (page === 'new-quote') {
      setQuoteInitialData(null);
    }
    if (page === 'edit-quote' && !quoteInitialData) {
      setActivePage('quotations');
      return;
    }
    setActivePage(page);
  };

  const renderPage = useMemo(() => {
    switch (activePage) {
      case 'new-sale':
        return (
          <CreateSale
            customers={customers}
            services={services}
            products={products}
            onCreateInvoice={handleCreateInvoice}
          />
        );
      case 'edit-sale':
        return (
          <CreateSale
            customers={customers}
            services={services}
            products={products}
            onCreateInvoice={handleCreateInvoice} // Fallback
            onUpdateInvoice={handleUpdateInvoice}
            initialData={invoiceInitialData}
          />
        );
      case 'invoice':
        if (!invoiceInitialData) {
          return (
            <CreateSale
              customers={customers}
              services={services}
              products={products}
              onCreateInvoice={handleCreateInvoice}
            />
          );
        }
        return <InvoiceCreator initialData={invoiceInitialData} />;
      case 'customers':
        return <ManageCustomers customers={customers} onRefresh={loadLookups} onEditCustomer={(customer) => {
          setSelectedCustomer(customer);
          setActivePage('edit-customer');
        }} />;
      case 'edit-customer':
        if (!selectedCustomer) {
          setActivePage('customers');
          return null;
        }
        return (
          <EditCustomer
            customer={selectedCustomer}
            onSave={async () => {
              await loadLookups();
              setActivePage('customers');
            }}
            onCancel={() => setActivePage('customers')}
          />
        );
      case 'services':
        return <ManageServices items={services} products={products} onRefresh={loadLookups} />;
      case 'invoices':
        return (
          <InvoiceHistory
            // 'invoices' page now shows only Issued invoices
            filterStatus="ISSUED"
            onViewInvoice={(invoice) => {
              setInvoiceInitialData(invoice);
              setActivePage('invoice');
            }}
          />
        );
      case 'draft-sales':
        return (
          <InvoiceHistory
            filterStatus="DRAFT"
            onViewInvoice={(invoice) => {
              setInvoiceInitialData(invoice);
              setActivePage('edit-sale');
            }}
            onEditInvoice={(invoice) => {
              setInvoiceInitialData(invoice);
              setActivePage('edit-sale');
            }}
          />
        );
      case 'products':
        return <ManageProducts items={products} onRefresh={loadLookups} />;
      case 'new-quote':
        return (
          <CreateQuote
            customers={customers}
            services={services}
            products={products}
            onCreateQuote={handleCreateQuote}
          />
        );
      case 'edit-quote':
        return (
          <CreateQuote
            customers={customers}
            services={services}
            products={products}
            onCreateQuote={handleCreateQuote}
            onUpdateQuote={handleUpdateQuote}
            initialData={quoteInitialData}
          />
        );
      case 'quotations':
        return (
          <QuoteHistory
            // 'quotations' can show All or just Issued? User said "Quotations" in menu.
            // Let's show All excluding drafts maybe? Or Just issued.
            // "Draft Quotations" links to drafts.
            // Let's make "Quotes History" show everything for now, or Issued.
            // User plan said "Quotations (Links to Quotes filtered by ISSUED)".
            // But usually history implies all. Let's filter ISSUED to be clean.
            filterStatus="ISSUED"
            onViewQuote={(quote) => {
              setQuoteInitialData(quote);
              setActivePage('quote');
            }}
          />
        );
      case 'draft-quotes':
        return (
          <QuoteHistory
            filterStatus="DRAFT"
            onViewQuote={(quote) => {
              setQuoteInitialData(quote);
              setActivePage('edit-quote');
            }}
            onEditQuote={(quote) => {
              setQuoteInitialData(quote);
              setActivePage('edit-quote');
            }}
          />
        );
      case 'quote':
        if (!quoteInitialData) {
          return (
            <CreateQuote
              customers={customers}
              services={services}
              products={products}
              onCreateQuote={handleCreateQuote}
            />
          );
        }
        return <QuoteCreator initialData={quoteInitialData} />;
      default:
        return null;
    }
  }, [activePage, customers, services, products, invoiceInitialData, handleCreateInvoice, loadLookups]);

  if (!isAuthenticated) {
    if (showLogin) {
      return <Login />;
    }
    return <LandingPage onLoginClick={() => setShowLogin(true)} />;
    }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activePage={activePage} setActivePage={handleNavigate} onLogout={logout} />
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-red-100">
              <p className="text-red-600 mb-4 font-medium">{error}</p>
              <button
                type="button"
                onClick={loadLookups}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="animate-fade-in">
              {renderPage}
            </div>
          )}
        </div>
      </main>
    </div>
  );
  };

// Wrap AppContent with AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;