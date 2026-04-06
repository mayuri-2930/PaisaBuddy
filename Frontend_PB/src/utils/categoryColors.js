// src/utils/categoryColors.js
import { Coffee, Home, Plane, Tv, Wifi, MoreHorizontal } from 'lucide-react';

export const categoryColors = {
  Food: { bg: 'bg-orange-100', text: 'text-orange-600' },
  Rent: { bg: 'bg-red-100', text: 'text-red-600' },
  Travel: { bg: 'bg-blue-100', text: 'text-blue-600' },
  Leisure: { bg: 'bg-purple-100', text: 'text-purple-600' },
  Internet: { bg: 'bg-cyan-100', text: 'text-cyan-600' },
  Other: { bg: 'bg-gray-100', text: 'text-gray-600' }
};

export const getCategoryIcon = (category) => {
  const map = {
    Food: Coffee, Rent: Home, Travel: Plane, Leisure: Tv, Internet: Wifi, Other: MoreHorizontal
  };
  return map[category] || MoreHorizontal;
};