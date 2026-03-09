-- Migration 004: Module Permissions
-- Role-based module access control with per-user overrides

-- Canonical list of all sidebar modules
create table public.module_definitions (
  slug text primary key,
  label text not null,
  nav_group text not null,
  created_at timestamptz default now()
);

alter table public.module_definitions enable row level security;

create policy "Module definitions readable by authenticated users"
  on public.module_definitions for select
  using (auth.role() = 'authenticated');

-- Seed all modules from nav-data.ts
insert into public.module_definitions (slug, label, nav_group) values
  -- MAIN
  ('chat', 'Chat', 'MAIN'),
  ('dashboard', 'Dashboard', 'MAIN'),
  -- WORKSPACE
  ('email', 'Email', 'WORKSPACE'),
  ('calendar', 'Calendar', 'WORKSPACE'),
  ('tasks', 'Tasks', 'WORKSPACE'),
  ('projects', 'Projects', 'WORKSPACE'),
  ('meetings', 'Meetings', 'WORKSPACE'),
  ('docs', 'Docs', 'WORKSPACE'),
  ('team', 'Team', 'WORKSPACE'),
  -- MARKETING
  ('content-creator', 'Content Creator', 'MARKETING'),
  ('content-calendar', 'Content Calendar', 'MARKETING'),
  ('social', 'Social Media', 'MARKETING'),
  ('email-marketing', 'Email Marketing', 'MARKETING'),
  ('seo', 'SEO / Blog', 'MARKETING'),
  ('events', 'Events', 'MARKETING'),
  ('paid-ads', 'Paid Ads', 'MARKETING'),
  ('merch', 'Merchandise', 'MARKETING'),
  -- SALES & CRM
  ('crm', 'CRM', 'SALES & CRM'),
  ('pipeline', 'Pipeline', 'SALES & CRM'),
  ('orders', 'Orders', 'SALES & CRM'),
  ('vmi', 'VMI', 'SALES & CRM'),
  ('competitors', 'Competitor Intel', 'SALES & CRM'),
  -- DIVISIONS
  ('inventory', 'Inventory', 'DIVISIONS'),
  ('cultivation', 'Cultivation', 'DIVISIONS'),
  ('manufacturing', 'Manufacturing', 'DIVISIONS'),
  ('packaging', 'Packaging', 'DIVISIONS'),
  ('fulfillment', 'Fulfillment', 'DIVISIONS'),
  ('delivery', 'Delivery', 'DIVISIONS'),
  ('products', 'Products & R&D', 'DIVISIONS'),
  -- FINANCE
  ('finance', 'Finance Dashboard', 'FINANCE'),
  ('ar', 'Accounts Receivable', 'FINANCE'),
  ('ap', 'Accounts Payable', 'FINANCE'),
  ('budget', 'Budget & Planning', 'FINANCE'),
  ('labor', 'Labor & Payroll', 'FINANCE'),
  ('reports', 'Reports', 'FINANCE'),
  -- AI & KNOWLEDGE
  ('agents', 'Agent Hub', 'AI & KNOWLEDGE'),
  ('approvals', 'Approvals', 'AI & KNOWLEDGE'),
  ('council', 'Council', 'AI & KNOWLEDGE'),
  ('insights', 'Insights', 'AI & KNOWLEDGE'),
  ('memory', 'Memory', 'AI & KNOWLEDGE'),
  -- ADMIN
  ('settings', 'Settings', 'ADMIN'),
  ('users', 'Users', 'ADMIN'),
  ('system', 'System', 'ADMIN');


-- Role-to-module default mappings
create table public.role_module_defaults (
  id uuid default gen_random_uuid() primary key,
  role text not null,
  module_slug text not null references public.module_definitions(slug) on delete cascade,
  unique(role, module_slug)
);

alter table public.role_module_defaults enable row level security;

create policy "Role defaults readable by authenticated users"
  on public.role_module_defaults for select
  using (auth.role() = 'authenticated');

create policy "Role defaults writable by admin"
  on public.role_module_defaults for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Base modules everyone gets
-- Helper: define base slugs shared by all roles
do $$
declare
  base_slugs text[] := array[
    'chat', 'dashboard',
    'email', 'calendar', 'tasks', 'projects', 'meetings', 'docs', 'team',
    'agents', 'approvals', 'insights',
    'settings'
  ];
  marketing_slugs text[] := array[
    'content-creator', 'content-calendar', 'social', 'email-marketing',
    'seo', 'events', 'paid-ads', 'merch'
  ];
  sales_slugs text[] := array[
    'crm', 'pipeline', 'orders', 'vmi', 'competitors'
  ];
  finance_slugs text[] := array[
    'finance', 'ar', 'ap', 'budget', 'labor', 'reports'
  ];
  all_division_slugs text[] := array[
    'inventory', 'cultivation', 'manufacturing', 'packaging',
    'fulfillment', 'delivery', 'products'
  ];
  s text;
begin
  -- viewer: base only
  foreach s in array base_slugs loop
    insert into public.role_module_defaults (role, module_slug) values ('viewer', s);
  end loop;

  -- sales_rep: base + sales
  foreach s in array base_slugs loop
    insert into public.role_module_defaults (role, module_slug) values ('sales_rep', s);
  end loop;
  foreach s in array sales_slugs loop
    insert into public.role_module_defaults (role, module_slug) values ('sales_rep', s);
  end loop;

  -- cultivation_lead: base + cultivation, inventory, products + council
  foreach s in array base_slugs loop
    insert into public.role_module_defaults (role, module_slug) values ('cultivation_lead', s);
  end loop;
  insert into public.role_module_defaults (role, module_slug) values ('cultivation_lead', 'cultivation');
  insert into public.role_module_defaults (role, module_slug) values ('cultivation_lead', 'inventory');
  insert into public.role_module_defaults (role, module_slug) values ('cultivation_lead', 'products');
  insert into public.role_module_defaults (role, module_slug) values ('cultivation_lead', 'council');

  -- manufacturing_lead: base + manufacturing, inventory, products + council
  foreach s in array base_slugs loop
    insert into public.role_module_defaults (role, module_slug) values ('manufacturing_lead', s);
  end loop;
  insert into public.role_module_defaults (role, module_slug) values ('manufacturing_lead', 'manufacturing');
  insert into public.role_module_defaults (role, module_slug) values ('manufacturing_lead', 'inventory');
  insert into public.role_module_defaults (role, module_slug) values ('manufacturing_lead', 'products');
  insert into public.role_module_defaults (role, module_slug) values ('manufacturing_lead', 'council');

  -- packaging_lead: base + packaging, inventory + council
  foreach s in array base_slugs loop
    insert into public.role_module_defaults (role, module_slug) values ('packaging_lead', s);
  end loop;
  insert into public.role_module_defaults (role, module_slug) values ('packaging_lead', 'packaging');
  insert into public.role_module_defaults (role, module_slug) values ('packaging_lead', 'inventory');
  insert into public.role_module_defaults (role, module_slug) values ('packaging_lead', 'council');

  -- fulfillment_lead: base + fulfillment, inventory, orders + council
  foreach s in array base_slugs loop
    insert into public.role_module_defaults (role, module_slug) values ('fulfillment_lead', s);
  end loop;
  insert into public.role_module_defaults (role, module_slug) values ('fulfillment_lead', 'fulfillment');
  insert into public.role_module_defaults (role, module_slug) values ('fulfillment_lead', 'inventory');
  insert into public.role_module_defaults (role, module_slug) values ('fulfillment_lead', 'orders');
  insert into public.role_module_defaults (role, module_slug) values ('fulfillment_lead', 'council');

  -- driver: base + delivery
  foreach s in array base_slugs loop
    insert into public.role_module_defaults (role, module_slug) values ('driver', s);
  end loop;
  insert into public.role_module_defaults (role, module_slug) values ('driver', 'delivery');

  -- manager: everything except memory, system, users
  foreach s in array base_slugs loop
    insert into public.role_module_defaults (role, module_slug) values ('manager', s);
  end loop;
  foreach s in array marketing_slugs loop
    insert into public.role_module_defaults (role, module_slug) values ('manager', s);
  end loop;
  foreach s in array sales_slugs loop
    insert into public.role_module_defaults (role, module_slug) values ('manager', s);
  end loop;
  foreach s in array finance_slugs loop
    insert into public.role_module_defaults (role, module_slug) values ('manager', s);
  end loop;
  foreach s in array all_division_slugs loop
    insert into public.role_module_defaults (role, module_slug) values ('manager', s);
  end loop;
  insert into public.role_module_defaults (role, module_slug) values ('manager', 'council');

  -- admin: everything
  foreach s in array base_slugs loop
    insert into public.role_module_defaults (role, module_slug) values ('admin', s);
  end loop;
  foreach s in array marketing_slugs loop
    insert into public.role_module_defaults (role, module_slug) values ('admin', s);
  end loop;
  foreach s in array sales_slugs loop
    insert into public.role_module_defaults (role, module_slug) values ('admin', s);
  end loop;
  foreach s in array finance_slugs loop
    insert into public.role_module_defaults (role, module_slug) values ('admin', s);
  end loop;
  foreach s in array all_division_slugs loop
    insert into public.role_module_defaults (role, module_slug) values ('admin', s);
  end loop;
  insert into public.role_module_defaults (role, module_slug) values ('admin', 'council');
  insert into public.role_module_defaults (role, module_slug) values ('admin', 'memory');
  insert into public.role_module_defaults (role, module_slug) values ('admin', 'users');
  insert into public.role_module_defaults (role, module_slug) values ('admin', 'system');
end $$;


-- Per-user overrides (grant or revoke specific modules)
create table public.user_module_overrides (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  module_slug text not null references public.module_definitions(slug) on delete cascade,
  granted boolean not null default true,
  granted_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  unique(user_id, module_slug)
);

alter table public.user_module_overrides enable row level security;

create policy "Users can read their own overrides"
  on public.user_module_overrides for select
  using (user_id = auth.uid());

create policy "Admins can read all overrides"
  on public.user_module_overrides for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'manager')
    )
  );

create policy "Admins can manage overrides"
  on public.user_module_overrides for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Index for fast permission lookups
create index idx_role_module_defaults_role on public.role_module_defaults(role);
create index idx_user_module_overrides_user on public.user_module_overrides(user_id);
