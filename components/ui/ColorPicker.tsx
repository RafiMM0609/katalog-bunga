'use client'

import { useState } from "react";

interface ColorOption {
  name: string;
  hex: string;
}

const defaultColors: ColorOption[] = [
  { name: 'Pink Pastel', hex: '#FBCFE8' },
  { name: 'Cream', hex: '#FDE68A' },
  { name: 'Silver', hex: '#E5E7EB' },
  { name: 'Putih', hex: '#FFFFFF' },
  { name: 'Hitam', hex: '#1F2937' },
];

interface ColorPickerProps {
  colors?: ColorOption[];
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export default function ColorPicker({ 
  colors = defaultColors, 
  selectedColor, 
  onColorChange 
}: ColorPickerProps) {
  return (
    <div>
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
        Pilih Warna Kertas
      </h3>
      <div className="flex flex-wrap gap-3">
        {colors.map((item) => (
          <button
            key={item.name}
            onClick={() => onColorChange(item.name)}
            className={`group relative w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all flex items-center justify-center ${
              selectedColor === item.name
                ? 'border-pink-500 scale-110 shadow-md'
                : 'border-gray-200 hover:border-pink-300'
            }`}
            style={{ backgroundColor: item.hex }}
            title={item.name}
          >
            {selectedColor === item.name && (
              <div
                className={`w-3 h-3 rounded-full ${
                  item.name === 'Hitam' ? 'bg-white' : 'bg-pink-500'
                }`}
              ></div>
            )}
            <span className="absolute -bottom-6 text-[10px] text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {item.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
