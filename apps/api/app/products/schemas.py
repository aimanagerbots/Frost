from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class StrainResponse(BaseModel):
    id: str
    name: str
    slug: str
    strain_type: str
    lineage: Optional[str] = None
    thc_min: Optional[float] = None
    thc_max: Optional[float] = None
    cbd_min: Optional[float] = None
    cbd_max: Optional[float] = None
    terpenes: list = []
    effects: list = []
    flavor_notes: list = []
    description: Optional[str] = None
    image_url: Optional[str] = None
    difficulty: Optional[str] = None
    flowering_weeks: Optional[int] = None
    yield_rating: Optional[str] = None
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class ProductResponse(BaseModel):
    id: str
    name: str
    slug: str
    sku: Optional[str] = None
    brand: str
    category: str
    sub_category: Optional[str] = None
    strain_id: Optional[str] = None
    strain_name: Optional[str] = None
    strain_type: Optional[str] = None
    thc: Optional[float] = None
    cbd: Optional[float] = None
    package_sizes: list = []
    terpenes: list = []
    effects: list = []
    flavor_notes: list = []
    description: Optional[str] = None
    image_url: Optional[str] = None
    price: Optional[float] = None
    is_active: bool = True
    is_featured: bool = False
    is_new: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
