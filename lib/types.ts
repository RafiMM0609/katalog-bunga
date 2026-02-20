// Type definitions for API responses
export interface Category {
  id: number;
  name: string;
  slug: string;
  icon_name?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  category_id: number;
  description: string;
  rating: number;
  sold_count: number;
  bg_color: string;
  icon_color: string;
  tags?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface PaperColor {
  id: number;
  name: string;
  hex_code: string;
  product_id?: number;
  created_at: string;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  product_id: number;
  selected_paper_color?: string;
  customer_rating?: number;
  notes?: string;
  status: string;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  data: T[];
}
