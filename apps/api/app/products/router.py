from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.database import get_supabase_client
from app.products.schemas import ProductResponse, StrainResponse

router = APIRouter()


# --- Products ---


@router.get("", response_model=list[ProductResponse])
async def list_products(
    category: Optional[str] = None,
    brand: Optional[str] = None,
    strain_name: Optional[str] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
):
    supabase = get_supabase_client()
    query = supabase.table("products").select("*").eq("is_active", True)

    if category:
        query = query.eq("category", category)
    if brand:
        query = query.eq("brand", brand)
    if strain_name:
        query = query.eq("strain_name", strain_name)
    if search:
        query = query.ilike("name", f"%{search}%")

    offset = (page - 1) * per_page
    result = query.order("name").range(offset, offset + per_page - 1).execute()
    return [ProductResponse(**row) for row in result.data]


@router.get("/featured", response_model=list[ProductResponse])
async def get_featured_products():
    supabase = get_supabase_client()
    result = (
        supabase.table("products")
        .select("*")
        .eq("is_active", True)
        .eq("is_featured", True)
        .order("name")
        .execute()
    )
    return [ProductResponse(**row) for row in result.data]


@router.get("/by-category/{category}", response_model=list[ProductResponse])
async def get_products_by_category(category: str):
    supabase = get_supabase_client()
    result = (
        supabase.table("products")
        .select("*")
        .eq("is_active", True)
        .eq("category", category)
        .order("name")
        .execute()
    )
    return [ProductResponse(**row) for row in result.data]


@router.get("/by-strain/{strain_name}", response_model=list[ProductResponse])
async def get_products_by_strain(strain_name: str):
    supabase = get_supabase_client()
    result = (
        supabase.table("products")
        .select("*")
        .eq("is_active", True)
        .eq("strain_name", strain_name)
        .order("name")
        .execute()
    )
    return [ProductResponse(**row) for row in result.data]


@router.get("/{slug}", response_model=ProductResponse)
async def get_product(slug: str):
    supabase = get_supabase_client()
    result = (
        supabase.table("products")
        .select("*")
        .eq("slug", slug)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Product not found")

    return ProductResponse(**result.data)


# --- Strains ---


@router.get("/strains/all", response_model=list[StrainResponse])
async def list_strains(strain_type: Optional[str] = None):
    supabase = get_supabase_client()
    query = supabase.table("strains").select("*").eq("is_active", True)

    if strain_type:
        query = query.eq("strain_type", strain_type)

    result = query.order("name").execute()
    return [StrainResponse(**row) for row in result.data]


@router.get("/strains/{slug}", response_model=StrainResponse)
async def get_strain(slug: str):
    supabase = get_supabase_client()
    result = (
        supabase.table("strains")
        .select("*")
        .eq("slug", slug)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Strain not found")

    return StrainResponse(**result.data)
