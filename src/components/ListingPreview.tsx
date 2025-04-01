"use client";
import React, { useState } from 'react';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';

interface ListingPreviewProps {
  onBack: () => void;
  onNext: () => void;
  photo: string;
  itemIndex: number;
  totalItems: number;
  generatedData: {
    name: string;
    description: string;
    condition: string;
    price: number;
  };
  onEdit: (field: string, value: string | number) => void;
}

const ListingPreview: React.FC<ListingPreviewProps> = ({
  onBack,
  onNext,
  photo,
  itemIndex,
  totalItems,
  generatedData,
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const startEditing = (field: string, initialValue: string | number) => {
    setIsEditing(field);
    setEditValue(String(initialValue));
  };

  const saveEdit = () => {
    if (isEditing) {
      if (isEditing === 'price') {
        const numValue = parseFloat(editValue);
        if (!isNaN(numValue)) {
          onEdit(isEditing, numValue);
        }
      } else {
        onEdit(isEditing, editValue);
      }
      setIsEditing(null);
    }
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
        <h1 className="text-xl font-bold mx-auto">Item Listing</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="aspect-video bg-gray-100 relative">
          {photo ? (
            <img 
              src={photo} 
              alt="Item preview" 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              &lt;photo&gt;
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            {isEditing === 'name' ? (
              <div className="flex-1 flex">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 border rounded p-2"
                  autoFocus
                  onBlur={saveEdit}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                />
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold">{generatedData.name}</h2>
                <button 
                  onClick={() => startEditing('name', generatedData.name)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              </>
            )}
            <span className="text-sm text-gray-500 ml-2">
              Item {itemIndex}/{totalItems}
            </span>
          </div>

          <div className="mb-4">
            {isEditing === 'description' ? (
              <div className="flex-1 flex">
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 border rounded p-2 min-h-[100px]"
                  autoFocus
                  onBlur={saveEdit}
                />
              </div>
            ) : (
              <div className="flex">
                <p className="text-gray-700 flex-1">{generatedData.description}</p>
                <button 
                  onClick={() => startEditing('description', generatedData.description)}
                  className="p-1 text-gray-500 hover:text-gray-700 self-start ml-2"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            {isEditing === 'condition' ? (
              <div className="flex-1 flex">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 border rounded p-2"
                  autoFocus
                  onBlur={saveEdit}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                />
              </div>
            ) : (
              <div className="flex items-center">
                <span>{generatedData.condition}.</span>
                <button 
                  onClick={() => startEditing('condition', generatedData.condition)}
                  className="p-1 text-gray-500 hover:text-gray-700 ml-2"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            {isEditing === 'price' ? (
              <div className="flex items-center">
                <span className="mr-1">$</span>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="border rounded p-2 w-24"
                  autoFocus
                  onBlur={saveEdit}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                />
                <span className="ml-1">OBO</span>
              </div>
            ) : (
              <div className="flex items-center">
                <span className="font-bold">${generatedData.price} OBO</span>
                <button 
                  onClick={() => startEditing('price', generatedData.price)}
                  className="p-1 text-gray-500 hover:text-gray-700 ml-2"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <button
          onClick={onNext}
          className="w-full py-3 bg-blue-500 text-white rounded-lg text-lg font-medium"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ListingPreview;
