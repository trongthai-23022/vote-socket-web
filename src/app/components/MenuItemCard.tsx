"use client";
import React from 'react';

interface MenuItem {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
}

interface MenuItemCardProps {
  item: MenuItem;
  isSelected: boolean;
  onToggle: (name: string) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, isSelected, onToggle }) => {
  return (
    <div 
      className={`border rounded-lg p-4 shadow-lg cursor-pointer transition-colors duration-200 ${isSelected ? 'border-indigo-600 bg-indigo-50' : 'hover:border-gray-400'}`}
      onClick={() => onToggle(item.name)}
    >
      {item.imageUrl && (
        <img 
          src={item.imageUrl} 
          alt={item.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
      {item.description && (
        <p className="text-gray-600 mb-2">{item.description}</p>
      )}
      <p className="text-lg font-bold text-indigo-600">{item.price}</p>
    </div>
  );
};

export default MenuItemCard; 