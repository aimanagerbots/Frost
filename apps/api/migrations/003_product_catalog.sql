-- Migration 003: Product Catalog
-- Strains and products — public read access for website

-- Strains
create table public.strains (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  slug text not null unique,
  strain_type text not null,  -- indica, sativa, hybrid
  lineage text,  -- parent strains
  thc_min numeric,
  thc_max numeric,
  cbd_min numeric,
  cbd_max numeric,
  terpenes jsonb default '[]',  -- [{name, percentage, flavor}]
  effects jsonb default '[]',  -- ["relaxing", "creative", ...]
  flavor_notes jsonb default '[]',
  description text,
  image_url text,
  difficulty text,  -- easy, moderate, hard
  flowering_weeks integer,
  yield_rating text,  -- low, medium, high
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.strains enable row level security;
create policy "Strains viewable by all" on public.strains
  for select using (true);  -- public for website
create policy "Strains manageable by admin" on public.strains
  for all using (
    auth.role() = 'authenticated'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'manager')
    )
  );


-- Products
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null,
  sku text unique,
  brand text not null,  -- Frost Farms, Glacier Extracts, Northern Lights Co.
  category text not null,  -- flower, preroll, vaporizer, concentrate, edible, beverage
  sub_category text,
  strain_id uuid references public.strains(id),
  strain_name text,  -- denormalized for performance
  strain_type text,  -- denormalized
  thc numeric,
  cbd numeric,
  package_sizes jsonb default '[]',  -- ["3.5g", "7g", "14g", "28g"]
  terpenes jsonb default '[]',
  effects jsonb default '[]',
  flavor_notes jsonb default '[]',
  description text,
  image_url text,
  price numeric,
  is_active boolean default true,
  is_featured boolean default false,
  is_new boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique(slug, category)
);

create index idx_products_category on public.products(category);
create index idx_products_strain on public.products(strain_id);
create index idx_products_brand on public.products(brand);
create index idx_products_active on public.products(is_active) where is_active = true;
alter table public.products enable row level security;
create policy "Products viewable by all" on public.products
  for select using (true);  -- public for website
create policy "Products manageable by admin" on public.products
  for all using (
    auth.role() = 'authenticated'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'manager')
    )
  );

-- Apply updated_at triggers
create trigger strains_updated_at before update on public.strains
  for each row execute function public.update_updated_at();
create trigger products_updated_at before update on public.products
  for each row execute function public.update_updated_at();
