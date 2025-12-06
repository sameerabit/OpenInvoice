import React, { useState } from 'react';
import type { ServiceOrProduct } from '../types';
import { createService, updateService, deleteService } from '../api';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';

interface ManageItemsProps {
  items: ServiceOrProduct[];
  onRefresh: () => void;
  products?: ServiceOrProduct[];
}

const ManageServices: React.FC<ManageItemsProps> = ({ items, onRefresh, products = [] }) => {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [checklist, setChecklist] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Edit state
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState<number | ''>('');
  const [editChecklist, setEditChecklist] = useState('');
  const [editSelectedProducts, setEditSelectedProducts] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description && price !== '') {
      try {
        await createService({
          description,
          price: Number(price),
          checklist: checklist || undefined, // Send undefined (or null) if empty
          includedProductIds: selectedProducts,
        });
        onRefresh();
        setDescription('');
        setPrice('');
        setChecklist('');
        setSelectedProducts([]);
        setSearchInput('');
      } catch (error) {
        console.error('Failed to create service:', error);
        alert('Failed to create service');
      }
    }
  };

  const handleRemove = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id);
        onRefresh();
      } catch (error) {
        console.error('Failed to delete service:', error);
        alert('Failed to delete service');
      }
    }
  };

  const startEdit = (service: ServiceOrProduct) => {
    setEditingServiceId(service.id);
    setEditDescription(service.description);
    setEditPrice(service.price);
    setEditChecklist(service.checklist || '');
    setEditSelectedProducts(service.includedProductIds || []);
  };

  const cancelEdit = () => {
    setEditingServiceId(null);
    setEditDescription('');
    setEditPrice('');
    setEditSelectedProducts([]);
  };

  const handleUpdate = async () => {
    if (!editingServiceId || !editDescription || editPrice === '' || editChecklist === '') return;
    try {
      await updateService(editingServiceId, {
        description: editDescription,
        price: Number(editPrice),
        checklist: editChecklist,
        includedProductIds: editSelectedProducts,
      });
      onRefresh();
      cancelEdit();
    } catch (error) {
      console.error('Failed to update service:', error);
      alert('Failed to update service');
    }
  };

  const filteredProducts = products.filter(
    product =>
      !selectedProducts.includes(product.id) &&
      product.description.toLowerCase().includes(searchInput.toLowerCase())
  );

  const toggleProductSelection = (productId: string, isEdit = false) => {
    if (isEdit) {
      setEditSelectedProducts(prev =>
        prev.includes(productId)
          ? prev.filter(id => id !== productId)
          : [...prev, productId]
      );
    } else {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    }
    setSearchInput('');
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Services</h1>
          <p className="mt-1 text-slate-500">Add, edit, or remove services.</p>
        </div>
      </div>

      <Card title="Add New Service">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Input
                id="description"
                label="Service Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Brake Fluid Flush"
                required
              />
            </div>
            <div>
              <Input
                id="price"
                label="Price ($)"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="0.00"
                required
                step="0.01"
                min="0"
              />
            </div>
            <div className="md:col-span-3">
              <label htmlFor="checklist" className="block text-sm font-medium text-slate-700 mb-1">
                Checklist (optional, separate lines with \n)
              </label>
              <textarea
                id="checklist"
                value={checklist}
                onChange={(e) => setChecklist(e.target.value)}
                placeholder="e.g., Check oil level\nCheck tire pressure"
                className="input"
                rows={3}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Assign Products</label>
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
                className="input"
              />
              {showSuggestions && filteredProducts.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredProducts.map(product => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => toggleProductSelection(product.id)}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 text-sm text-slate-700 border-b border-slate-100 last:border-b-0"
                    >
                      {product.description}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedProducts.length > 0 && (
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs font-medium text-slate-500 mb-2">Selected Products:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProducts.map(productId => {
                    const product = products.find(p => p.id === productId);
                    return (
                      <span
                        key={productId}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full"
                      >
                        {product?.description}
                        <button
                          type="button"
                          onClick={() => toggleProductSelection(productId)}
                          className="ml-1 text-primary-600 hover:text-primary-800"
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

          <div className="pt-4 border-t border-slate-200">
            <Button type="submit" className="w-full sm:w-auto">Add Service</Button>
          </div>
        </form>
      </Card>

      <Card title="Existing Services">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-slate-900">{item.description}</td>
                  <td className="py-3 px-4 text-sm text-slate-600 text-right">${item.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(item)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => handleRemove(item.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-400 text-sm">
                    No services found. Add one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {editingServiceId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Edit Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Input
                label="Description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
              <Input
                label="Price"
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="editChecklist" className="block text-sm font-medium text-slate-700 mb-1">
                Checklist (optional)
              </label>
              <textarea
                id="editChecklist"
                value={editChecklist}
                onChange={(e) => setEditChecklist(e.target.value)}
                placeholder="e.g., Check oil level\nCheck tire pressure"
                className="input"
                rows={3}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Included Products</label>
              <div className="flex flex-wrap gap-2">
                {products.map(product => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => toggleProductSelection(product.id, true)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${editSelectedProducts.includes(product.id)
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {product.description}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <Button variant="secondary" onClick={cancelEdit}>Cancel</Button>
              <Button onClick={handleUpdate}>Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;
