import React from 'react';
import type { Page } from '../App';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  onLogout: () => void;
}

const NavLink: React.FC<{
  page: Page;
  activePage: Page;
  onClick: (page: Page) => void;
  children: React.ReactNode;
  icon: string;
}> = ({ page, activePage, onClick, children, icon }) => {
  const isActive = activePage === page || (page === 'new-sale' && activePage === 'invoice') || (page === 'new-quote' && activePage === 'quote');

  const baseClasses = "group flex items-center px-4 py-3 text-sm font-bold rounded-md transition-all duration-200 ease-in-out uppercase tracking-wide";
  const activeClasses = "bg-blue-600 text-white shadow-lg shadow-blue-500/30";
  const inactiveClasses = "text-slate-600 hover:bg-slate-100 hover:text-blue-600";
  
  return (
    <a
      href="#"
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      onClick={(e) => {
        e.preventDefault();
        onClick(page);
      }}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className={`mr-3 text-lg transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </span>
      <span>{children}</span>
    </a>
  );
};


const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, onLogout }) => {
  return (
    <aside className="w-72 bg-white text-slate-900 min-h-screen flex flex-col no-print shadow-2xl z-50 border-r border-slate-200">
      {/* Brand Header */}


      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/30">
              OI
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-wider">OPEN INVOICE</h1>
            <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">Management System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-2 border-l-2 border-blue-500 pl-3">Sales</div>
        <NavLink page="new-sale" activePage={activePage} onClick={setActivePage} icon="🛒">New Sale</NavLink>
        <NavLink page="draft-sales" activePage={activePage} onClick={setActivePage} icon="✏️">Draft Sales</NavLink>
        <NavLink page="invoices" activePage={activePage} onClick={setActivePage} icon="📄">Invoices</NavLink>

        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mt-6 mb-4 px-2 border-l-2 border-blue-500 pl-3">Quotations</div>
        <NavLink page="new-quote" activePage={activePage} onClick={setActivePage} icon="📝">New Quote</NavLink>
        <NavLink page="draft-quotes" activePage={activePage} onClick={setActivePage} icon="✏️">Draft Quotes</NavLink>
        <NavLink page="quotations" activePage={activePage} onClick={setActivePage} icon="📂">Quotes History</NavLink>

        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mt-8 mb-4 px-2 border-l-2 border-blue-500 pl-3">Management</div>
        <NavLink page="customers" activePage={activePage} onClick={setActivePage} icon="👥">Customers</NavLink>
        <NavLink page="services" activePage={activePage} onClick={setActivePage} icon="🔧">Services</NavLink>
        <NavLink page="products" activePage={activePage} onClick={setActivePage} icon="📦">Products</NavLink>
      </nav>

      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-bold text-red-600 rounded-md hover:bg-red-50 hover:text-red-700 transition-all duration-200 border border-red-200 hover:border-red-300 uppercase tracking-wide"
        >
          <span className="mr-3 text-lg">🚪</span>
          Logout
        </button>
        <p className="mt-4 text-center text-xs text-slate-400 font-bold uppercase tracking-wider">
          &copy; {new Date().getFullYear()} Open Invoice
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
