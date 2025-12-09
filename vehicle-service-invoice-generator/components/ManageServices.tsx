import React, { useState } from 'react';
import type { ServiceOrProduct } from '../types';
import { createService, updateService, deleteService } from '../api';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from './ui/Table';

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
    <div className="space-y-6 max-w-4xl mx-auto">
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
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto ring-1 ring-slate-900/5">
                  {filteredProducts.map(product => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => toggleProductSelection(product.id)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-slate-700 border-b border-slate-100 last:border-b-0 transition-colors"
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
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full"
                      >
                        {product?.description}
                        <button
                          type="button"
                          onClick={() => toggleProductSelection(productId)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
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

      <TableContainer>
        <div className="px-6 py-4 border-b border-slate-100 bg-gray-50">
          <h2 className="text-lg font-bold text-slate-900">Existing Services</h2>
        </div>
        <Table>
          <Thead>
            <Tr className="hover:bg-transparent">
              <Th>Description</Th>
              <Th className="text-right">Price</Th>
              <Th className="text-center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map(item => (
              <Tr key={item.id}>
                <Td className="font-bold">{item.description}</Td>
                <Td className="text-right font-medium text-slate-900">${item.price.toFixed(2)}</Td>
                <Td className="text-center">
                  <Button variant="ghost" size="sm" onClick={() => startEdit(item)} className="mr-2 text-blue-600 hover:text-blue-700 uppercase font-bold text-xs">Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleRemove(item.id)} className="uppercase font-bold text-xs">Delete</Button>
                </Td>
              </Tr>
            ))}
            {items.length === 0 && (
              <Tr className="hover:bg-transparent">
                <Td colSpan={3} className="text-center py-12 text-slate-500">No services found. Add one above.</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {editingServiceId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl transform transition-all" title="Edit Service">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <Input
                  label="Price ($)"
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="editChecklist" className="block text-sm font-semibold text-slate-700 mb-1">
                  Checklist (optional)
                </label>
                <textarea
                  id="editChecklist"
                  value={editChecklist}
                  onChange={(e) => setEditChecklist(e.target.value)}
                  placeholder="e.g., Check oil level\nCheck tire pressure"
                  className={`
                      block w-full rounded-lg shadow-sm py-2.5 px-3 text-base
                      bg-white text-slate-900 placeholder-slate-400
                      border border-slate-300 focus:border-blue-500 focus:ring-blue-500
                      focus:ring-1 focus:outline-none
                      transition-colors duration-200
                    `}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Included Products</label>
                <div className="flex flex-wrap gap-2">
                  {products.map(product => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => toggleProductSelection(product.id, true)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors border ${editSelectedProducts.includes(product.id)
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-gray-50'
                        }`}
                    >
                      {product.description}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <Button variant="secondary" onClick={cancelEdit}>Cancel</Button>
                <Button onClick={handleUpdate}>Save Changes</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ManageServices;
