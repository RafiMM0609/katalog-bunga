'use client'

import { useState } from "react";
import { Toaster } from "react-hot-toast";
import TabNavigator from "@/components/admin/TabNavigator";
import ProductManagement from "@/components/admin/ProductManagement";
import CategoryManagement from "@/components/admin/CategoryManagement";
import ColorManagement from "@/components/admin/ColorManagement";

type TabType = 'products' | 'categories' | 'colors';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('products');

  return (
    <div className="space-y-6 animate-fade-in">
      <Toaster position="top-right" />
      
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h1 className="font-serif text-2xl font-bold text-gray-800 mb-2">
          Dashboard Admin
        </h1>
        <p className="text-sm text-gray-500">
          Kelola produk, kategori, dan warna kertas Kagitacraft
        </p>
      </div>

      {/* Tab Navigation */}
      <TabNavigator activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'categories' && <CategoryManagement />}
        {activeTab === 'colors' && <ColorManagement />}
      </div>
    </div>
  );
}
