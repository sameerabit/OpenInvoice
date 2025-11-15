import React, { useState } from 'react';
import type { ServiceOrProduct } from '../types';

interface AddItemModalProps {
    services: ServiceOrProduct[];
    products: ServiceOrProduct[];
    onClose: () => void;
    onAddItems: (items: ServiceOrProduct[]) => void;
}

type Tab = 'services' | 'products';

const AddItemModal: React.FC<AddItemModalProps> = ({ services, products, onClose, onAddItems }) => {
    const [activeTab, setActiveTab] = useState<Tab>('services');
    const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');

    const handleSelect = (itemId: string) => {
        setSelectedItemIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };
    
    const handleAddSelected = () => {
        const allItems = [...services, ...products];
        const itemsToAdd = allItems.filter(item => selectedItemIds.has(item.id));
        onAddItems(itemsToAdd);
        onClose();
    };

    const itemsToDisplay = (activeTab === 'services' ? services : products)
        .filter(item => item.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 no-print"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="addItemModalTitle"
        >
            <div 
                className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b">
                    <h2 id="addItemModalTitle" className="text-2xl font-bold text-gray-800">Add Services or Products</h2>
                </div>

                <div className="p-4 border-b">
                    <div className="flex space-x-2 border-b mb-4">
                        <TabButton name="Services" tab="services" activeTab={activeTab} onClick={setActiveTab} />
                        <TabButton name="Products" tab="products" activeTab={activeTab} onClick={setActiveTab} />
                    </div>
                     <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
                <div className="p-2 overflow-y-auto flex-grow">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                            <tr>
                                <th scope="col" className="p-4 w-12"></th>
                                <th scope="col" className="px-6 py-3">Description</th>
                                <th scope="col" className="px-6 py-3 text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemsToDisplay.map(item => (
                                <tr key={item.id} className="bg-white border-b hover:bg-gray-50 cursor-pointer" onClick={() => handleSelect(item.id)}>
                                    <td className="w-4 p-4">
                                        <div className="flex items-center">
                                            <input
                                                id={`checkbox-${item.id}`}
                                                type="checkbox"
                                                checked={selectedItemIds.has(item.id)}
                                                onChange={() => handleSelect(item.id)}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label htmlFor={`checkbox-${item.id}`} className="sr-only">checkbox</label>
                                        </div>
                                    </td>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {item.description}
                                    </th>
                                    <td className="px-6 py-4 text-right">${item.price.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
                        Cancel
                    </button>
                    <button 
                        onClick={handleAddSelected} 
                        disabled={selectedItemIds.size === 0}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        Add {selectedItemIds.size > 0 ? `(${selectedItemIds.size})` : ''} Selected
                    </button>
                </div>
            </div>
        </div>
    );
};


const TabButton: React.FC<{name: string, tab: Tab, activeTab: Tab, onClick: (tab: Tab) => void}> = ({ name, tab, activeTab, onClick }) => {
    const isActive = activeTab === tab;
    return (
        <button
            onClick={() => onClick(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                isActive 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            role="tab"
            aria-selected={isActive}
        >
            {name}
        </button>
    )
}

export default AddItemModal;
