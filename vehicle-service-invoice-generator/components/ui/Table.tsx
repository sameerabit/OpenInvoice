import React from 'react';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
    children: React.ReactNode;
}

export const TableContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white rounded-lg shadow ring-1 ring-slate-900/5 overflow-hidden ${className}`}>
        {children}
    </div>
);

export const Table: React.FC<TableProps> = ({ children, className = '', ...props }) => (
    <div className="overflow-x-auto">
        <table className={`min-w-full divide-y divide-slate-200 ${className}`} {...props}>
            {children}
        </table>
    </div>
);

export const Thead: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <thead className={`bg-gray-50 ${className}`}>
        {children}
    </thead>
);

export const Tbody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <tbody className={`bg-white divide-y divide-slate-200 ${className}`}>
        {children}
    </tbody>
);

export const Tr: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ children, className = '', ...props }) => (
    <tr className={`hover:bg-gray-50 transition-colors ${className}`} {...props}>
        {children}
    </tr>
);

export const Th: React.FC<React.ThHTMLAttributes<HTMLTableHeaderCellElement>> = ({ children, className = '', ...props }) => (
    <th 
        className={`px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider ${className}`}
        {...props}
    >
        {children}
    </th>
);

export const Td: React.FC<React.TdHTMLAttributes<HTMLTableDataCellElement>> = ({ children, className = '', ...props }) => (
    <td 
        className={`px-6 py-4 whitespace-nowrap text-sm text-slate-900 ${className}`}
        {...props}
    >
        {children}
    </td>
);
