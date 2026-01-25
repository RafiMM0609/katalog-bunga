"""
Pydantic Schemas untuk validasi data
"""

from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime


# ===== CATEGORY SCHEMAS =====
class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    slug: str = Field(..., min_length=1, max_length=50)
    icon_name: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(CategoryBase):
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    slug: Optional[str] = Field(None, min_length=1, max_length=50)


class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ===== PRODUCT SCHEMAS =====
class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    category_id: int
    description: str
    rating: float = Field(5.0, ge=0, le=5)
    sold_count: int = Field(0, ge=0)
    bg_color: str = Field("bg-white", max_length=50)
    icon_color: str = Field("text-pink-300", max_length=50)
    tags: Optional[str] = Field(None, max_length=255)
    is_active: bool = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    category_id: Optional[int] = None
    description: Optional[str] = None
    rating: Optional[float] = Field(None, ge=0, le=5)
    sold_count: Optional[int] = Field(None, ge=0)
    bg_color: Optional[str] = Field(None, max_length=50)
    icon_color: Optional[str] = Field(None, max_length=50)
    tags: Optional[str] = Field(None, max_length=255)
    is_active: Optional[bool] = None


class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    category: Optional[CategoryResponse] = None

    class Config:
        from_attributes = True


# ===== PAPER COLOR SCHEMAS =====
class PaperColorBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    hex_code: str = Field(..., min_length=7, max_length=7, pattern=r'^#[0-9A-Fa-f]{6}$')
    product_id: Optional[int] = None


class PaperColorCreate(PaperColorBase):
    pass


class PaperColorResponse(PaperColorBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ===== ORDER SCHEMAS =====
class OrderBase(BaseModel):
    customer_name: str = Field(..., min_length=1, max_length=255)
    customer_phone: str = Field(..., min_length=10, max_length=20)
    customer_email: Optional[EmailStr] = None
    product_id: int
    selected_paper_color: Optional[str] = Field(None, max_length=50)
    customer_rating: Optional[int] = Field(None, ge=1, le=5)
    notes: Optional[str] = None
    status: str = Field("pending", max_length=50)


class OrderCreate(OrderBase):
    pass


class OrderUpdate(BaseModel):
    status: Optional[str] = Field(None, max_length=50)
    customer_rating: Optional[int] = Field(None, ge=1, le=5)
    notes: Optional[str] = None


class OrderResponse(OrderBase):
    id: int
    created_at: datetime
    updated_at: datetime
    product: Optional[ProductResponse] = None

    class Config:
        from_attributes = True


# ===== PAGINATION =====
class PaginatedResponse(BaseModel):
    total: int
    page: int
    per_page: int
    total_pages: int
    data: List[ProductResponse]
