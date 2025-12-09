import React, { useState } from 'react';
import type { ServiceOrProduct } from '../types';
import { createProduct, deleteProduct } from '../api';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from './ui/Table';

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
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Manage Products</h1>
      
      <Card title="Add New Product">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <Input
              label="Product Description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Engine Oil (5L)"
              required
            />
          </div>
          <div>
            <Input
              label="Price ($)"
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
              placeholder="0.00"
              required
              step="0.01"
              min="0"
            />
          </div>
          <div className="md:col-span-3 text-right">
            <Button type="submit">
              Add Product
            </Button>
          </div>
        </form>
      </Card>

      <TableContainer>
        <div className="px-6 py-4 border-b border-slate-100 bg-gray-50">
          <h2 className="text-lg font-bold text-slate-900">Products</h2>
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
                  <button onClick={() => handleRemove(item.id)} className="text-red-500 hover:text-red-400 font-bold uppercase text-xs tracking-wide">Delete</button>
                </Td>
              </Tr>
            ))}
            {items.length === 0 && (
              <Tr className="hover:bg-transparent">
                <Td colSpan={3} className="text-center py-12 text-slate-500">No products found.</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ManageProducts;
