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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 no-print"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="addItemModalTitle"
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >

                <div className="p-6 border-b border-gray-100">
                    <h2 id="addItemModalTitle" className="text-2xl font-bold text-slate-900">Add Services or Products</h2>
                </div>

                <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex space-x-2 mb-4">
                        <TabButton name="Services" tab="services" activeTab={activeTab} onClick={setActiveTab} />
                        <TabButton name="Products" tab="products" activeTab={activeTab} onClick={setActiveTab} />
                    </div>
                     <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-sm transition-shadow"
                    />
                </div>
                
                <div className="p-2 overflow-y-auto flex-grow">
                    <table className="w-full text-sm">
                        <thead className="text-xs uppercase bg-gray-50 sticky top-0 border-b border-gray-200 text-slate-500 font-semibold">
                            <tr>
                                <th scope="col" className="p-4 w-12"></th>
                                <th scope="col" className="px-6 py-3 text-left tracking-wider">Description</th>
                                <th scope="col" className="px-6 py-3 text-right tracking-wider">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemsToDisplay.map(item => (
                                <tr key={item.id} className="bg-white border-b border-gray-100 hover:bg-blue-50/50 cursor-pointer transition-colors" onClick={() => handleSelect(item.id)}>
                                    <td className="w-4 p-4">
                                        <div className="flex items-center">
                                            <input
                                                id={`checkbox-${item.id}`}
                                                type="checkbox"
                                                checked={selectedItemIds.has(item.id)}
                                                onChange={() => handleSelect(item.id)}
                                                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                            />
                                            <label htmlFor={`checkbox-${item.id}`} className="sr-only">checkbox</label>
                                        </div>
                                    </td>
                                    <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                        {item.description}
                                    </th>
                                    <td className="px-6 py-4 text-right text-slate-600 font-medium">${item.price.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50 rounded-b-xl">
                    <button onClick={onClose} className="px-6 py-3 bg-white text-slate-700 rounded-lg hover:bg-gray-50 hover:text-slate-900 transition-all font-semibold border border-slate-300 shadow-sm">
                        Cancel
                    </button>
                    <button 
                        onClick={handleAddSelected} 
                        disabled={selectedItemIds.size === 0}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all font-bold shadow-sm"
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
            className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all ${
                isActive 
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white hover:text-blue-600'
            }`}
            role="tab"
            aria-selected={isActive}
        >
            {name}
        </button>
    )
}

export default AddItemModal;
