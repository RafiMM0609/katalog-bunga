'use client'

import { LayoutDashboard, Tags, Palette } from "lucide-react";

type TabType = 'products' | 'categories' | 'colors';

interface TabNavigatorProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'products' as TabType, label: 'Produk', icon: LayoutDashboard },
  { id: 'categories' as TabType, label: 'Kategori', icon: Tags },
  { id: 'colors' as TabType, label: 'Warna Kertas', icon: Palette },
];

export default function TabNavigator({ activeTab, onTabChange }: TabNavigatorProps) {
  return (
    <div className="flex flex-wrap gap-2 md:gap-4 border-b border-gray-200 pb-2 bg-white rounded-t-2xl px-4 pt-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 rounded-t-lg font-bold text-sm transition-all flex items-center gap-2 ${
            activeTab === tab.id
              ? 'bg-white text-pink-600 border-b-2 border-pink-600 shadow-sm'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
          }`}
        >
          <tab.icon size={18} />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
