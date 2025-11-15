import React from 'react';
import type { Page } from '../App';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const NavLink: React.FC<{
  page: Page;
  activePage: Page;
  onClick: (page: Page) => void;
  children: React.ReactNode;
  icon: string;
}> = ({ page, activePage, onClick, children, icon }) => {
  const isActive = activePage === page || (page === 'new-sale' && activePage === 'invoice');
  const baseClasses = "flex items-center px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors duration-200";
  const activeClasses = "bg-blue-600 text-white shadow-lg";
  
  return (
    <a
      href="#"
      className={`${baseClasses} ${isActive ? activeClasses : ''}`}
      onClick={(e) => {
        e.preventDefault();
        onClick(page);
      }}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="mr-3 text-xl">{icon}</span>
      <span className="font-medium">{children}</span>
    </a>
  );
};


const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4 flex flex-col no-print shadow-2xl">
      <div className="text-2xl font-bold mb-8 text-center border-b border-gray-600 pb-4">
        LARA Auto
      </div>
      <nav className="flex flex-col space-y-2">
        <NavLink page="new-sale" activePage={activePage} onClick={setActivePage} icon="🛒">New Sale</NavLink>
        <NavLink page="customers" activePage={activePage} onClick={setActivePage} icon="👥">Customers</NavLink>
        <NavLink page="services" activePage={activePage} onClick={setActivePage} icon="🔧">Services</NavLink>
        <NavLink page="products" activePage={activePage} onClick={setActivePage} icon="📦">Products</NavLink>
      </nav>
      <div className="mt-auto text-center text-gray-400 text-xs">
        <p>&copy; {new Date().getFullYear()} LARA Auto Services</p>
      </div>
    </aside>
  );
};

export default Sidebar;
