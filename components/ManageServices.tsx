import React, { useState } from 'react';
import type { ServiceOrProduct } from '../types';

interface ManageItemsProps {
  items: ServiceOrProduct[];
  setItems: React.Dispatch<React.SetStateAction<ServiceOrProduct[]>>;
  products?: ServiceOrProduct[];
}

const ManageServices: React.FC<ManageItemsProps> = ({ items, setItems, products = [] }) => {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description && price !== '') {
      const newItem: ServiceOrProduct = {
        id: crypto.randomUUID(),
        description,
        price: Number(price),
        type: 'service',
        includedProductIds: selectedProducts, // Add selected products
      };
      setItems(prev => [...prev, newItem]);
      setDescription('');
      setPrice('');
      setSelectedProducts([]); // Reset selected products
      setSearchInput('');
    }
  };

  const handleRemove = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const filteredProducts = products.filter(
    product =>
      !selectedProducts.includes(product.id) &&
      product.description.toLowerCase().includes(searchInput.toLowerCase())
  );

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    setSearchInput('');
    setShowSuggestions(false);
  };

  const getSelectedProductNames = () => {
    return selectedProducts
      .map(id => products.find(p => p.id === id)?.description)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Manage Services</h1>

      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Service Description</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Brake Fluid Flush"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
              placeholder="e.g., 85.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Assign Products</label>
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search and select products..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showSuggestions && filteredProducts.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {filteredProducts.map(product => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => toggleProductSelection(product.id)}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm text-gray-700 border-b border-gray-100 last:border-b-0"
                  >
                    {product.description}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedProducts.length > 0 && (
            <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs font-medium text-gray-700 mb-2">Selected Products:</p>
              <div className="flex flex-wrap gap-2">
                {selectedProducts.map(productId => {
                  const product = products.find(p => p.id === productId);
                  return (
                    <span
                      key={productId}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs rounded-full"
                    >
                      {product?.description}
                      <button
                        type="button"
                        onClick={() => toggleProductSelection(productId)}
                        className="ml-1 text-white hover:text-blue-100"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="text-right">
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors">
            Add Service
          </button>
        </div>
      </form>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Existing Services</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map(item => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <button onClick={() => handleRemove(item.id)} className="text-red-600 hover:text-red-800 transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageServices;
