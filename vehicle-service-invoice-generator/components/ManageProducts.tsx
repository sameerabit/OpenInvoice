import React, { useState } from 'react';
import type { ServiceOrProduct } from '../types';
import { createProduct, deleteProduct } from '../api';

interface ManageItemsProps {
  items: ServiceOrProduct[];
  onRefresh: () => void;
}

const ManageProducts: React.FC<ManageItemsProps> = ({ items, onRefresh }) => {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description && price !== '') {
      try {
        await createProduct({
          description,
          price: Number(price),
        });
        onRefresh();
        setDescription('');
        setPrice('');
      } catch (error) {
        console.error('Failed to create product:', error);
        alert('Failed to create product');
      }
    }
  };
  
  const handleRemove = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        onRefresh();
      } catch (error) {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product');
      }
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">Manage Products</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Engine Oil (5L)"
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
            placeholder="e.g., 45.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            step="0.01"
            min="0"
          />
        </div>
        <div className="md:col-span-3 text-right">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition-colors">
                Add Product
            </button>
        </div>
      </form>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Products</h2>
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

export default ManageProducts;
