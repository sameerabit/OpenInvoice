import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  description,
  footer,
}) => {
  return (
    <div className={`relative bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>




      {(title || description) && (
        <div className="px-6 py-4 border-b border-slate-100 relative z-10">
          {title && <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>}
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
      )}

      <div className="p-6 relative z-10">
        {children}
      </div>

      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-slate-100 relative z-10">
          {footer}
        </div>
      )}


    </div>
  );
};
