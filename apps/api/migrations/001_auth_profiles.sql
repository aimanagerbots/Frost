-- Migration 001: Auth Profiles
-- Extends Supabase Auth with a public profiles table

create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text not null,
  role text not null default 'viewer',  -- admin, manager, sales_rep, cultivation_lead, manufacturing_lead, packaging_lead, fulfillment_lead, driver, viewer
  department text,  -- executive, sales, cultivation, manufacturing, packaging, fulfillment, delivery, finance, marketing, quality
  title text,
  avatar_url text,
  language_preference text default 'en',  -- en, es
  phone text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies: users can read all profiles, update their own
create policy "Profiles are viewable by authenticated users" on public.profiles
  for select using (auth.role() = 'authenticated');

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at trigger function (reusable across all tables)
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at();
