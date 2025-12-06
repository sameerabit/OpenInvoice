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

  const baseClasses = "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out";
  const activeClasses = "bg-primary-600 text-white shadow-md";
  const inactiveClasses = "text-slate-300 hover:bg-slate-800 hover:text-white";
  
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
    <aside className="w-72 bg-slate-900 text-white min-h-screen flex flex-col no-print shadow-2xl z-50">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden bg-white">
            <img
              src="/assets/lara-logo.jpg"
              alt="LARA Auto Services"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">LARA Auto</h1>
            <p className="text-xs text-slate-400 font-medium">Service Center</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Sales</div>
        <NavLink page="new-sale" activePage={activePage} onClick={setActivePage} icon="🛒">New Sale</NavLink>
        <NavLink page="draft-sales" activePage={activePage} onClick={setActivePage} icon="✏️">Draft Sales</NavLink>
        <NavLink page="invoices" activePage={activePage} onClick={setActivePage} icon="📄">Invoices</NavLink>

        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-4 mb-4 px-2">Quotations</div>
        <NavLink page="new-quote" activePage={activePage} onClick={setActivePage} icon="📝">New Quote</NavLink>
        <NavLink page="draft-quotes" activePage={activePage} onClick={setActivePage} icon="✏️">Draft Quotes</NavLink>
        <NavLink page="quotations" activePage={activePage} onClick={setActivePage} icon="📂">Quotes History</NavLink>

        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-4 px-2">Management</div>
        <NavLink page="customers" activePage={activePage} onClick={setActivePage} icon="👥">Customers</NavLink>
        <NavLink page="services" activePage={activePage} onClick={setActivePage} icon="🔧">Services</NavLink>
        <NavLink page="products" activePage={activePage} onClick={setActivePage} icon="📦">Products</NavLink>
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-300 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200"
        >
          <span className="mr-3">🚪</span>
          Logout
        </button>
        <p className="mt-4 text-center text-xs text-slate-600 font-medium">
          &copy; {new Date().getFullYear()} LARA Auto Services
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
