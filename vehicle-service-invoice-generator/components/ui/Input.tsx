import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          block w-full rounded-lg shadow-sm py-2.5 px-3 text-base
          bg-white text-slate-900 placeholder-slate-400
          border
          ${error 
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
          : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
          }
          focus:ring-1 focus:outline-none
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200
          transition-colors duration-200
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-400 font-medium">{error}</p>
      )}
    </div>
  );
};
