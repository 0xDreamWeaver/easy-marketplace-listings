"use client";
import React, { useState } from 'react';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface MarketplaceSelectionProps {
  onBack: () => void;
  onSubmit: (selectedMarketplaces: string[]) => void;
  itemName: string;
}

const marketplaces = [
  { id: 'ebay', name: 'Ebay' },
  { id: 'craigslist', name: 'Craigslist' },
  { id: 'etsy', name: 'Etsy' },
  { id: 'facebook', name: 'FB Marketplace' },
];

const MarketplaceSelection: React.FC<MarketplaceSelectionProps> = ({ 
  onBack, 
  onSubmit,
  itemName 
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleMarketplace = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(item => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSubmit = () => {
    if (selected.length === 0) {
      toast.error('Please select at least one marketplace');
      return;
    }
    onSubmit(selected);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold mx-auto">Platforms</h1>
      </div>

      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-2">{itemName}</h2>
        <p className="text-gray-600 mb-8">
          Your item will be posted to the marketplaces you choose below.
        </p>

        <div className="space-y-4">
          {marketplaces.map((marketplace) => (
            <div 
              key={marketplace.id}
              className="flex items-center"
            >
              <div 
                className={`w-6 h-6 border rounded mr-4 flex items-center justify-center cursor-pointer ${
                  selected.includes(marketplace.id) ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                }`}
                onClick={() => toggleMarketplace(marketplace.id)}
              >
                {selected.includes(marketplace.id) && (
                  <CheckIcon className="w-4 h-4 text-white" />
                )}
              </div>
              <span className="text-xl">{marketplace.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t">
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-blue-500 text-white rounded-lg text-lg font-medium"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default MarketplaceSelection;
