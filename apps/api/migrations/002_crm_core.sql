-- Migration 002: CRM Core Tables
-- Accounts, contacts, interactions, opportunities, pipeline movements, activity log

-- Accounts (dispensary accounts — the CRM gravity well)
create table public.accounts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  legal_name text,
  license_number text unique,
  license_expiry date,
  account_type text default 'dispensary',  -- dispensary, distributor, processor

  -- Address
  address_street text,
  address_city text,
  address_state text default 'WA',
  address_zip text,
  latitude numeric,
  longitude numeric,

  -- Pipeline (A/I/R system)
  pipeline_status text not null default 'inactive',  -- active, inactive, recovery
  pipeline_phase integer not null default 1,  -- 1-5
  pipeline_code text generated always as (
    upper(left(pipeline_status, 1)) || pipeline_phase::text
  ) stored,  -- A1, I3, R2, etc.
  pipeline_entered_date timestamptz default now(),
  pipeline_previous_code text,
  pipeline_previous_date timestamptz,
  pipeline_notes text,

  -- Health score (composite 0-100)
  health_score integer default 50,
  health_tier text generated always as (
    case
      when health_score >= 80 then 'thriving'
      when health_score >= 60 then 'healthy'
      when health_score >= 40 then 'at_risk'
      else 'churning'
    end
  ) stored,

  -- Business metrics (denormalized for dashboard performance)
  total_revenue numeric default 0,
  total_orders integer default 0,
  average_order_value numeric default 0,
  last_order_date timestamptz,
  order_cadence_days integer,  -- expected days between orders
  -- days_since_last_order: compute at query time as extract(day from now() - last_order_date)

  -- VMI
  vmi_enrolled boolean default false,

  -- Delivery preferences
  preferred_delivery_window text,
  delivery_instructions text,

  -- Metadata
  assigned_rep_id uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  is_active boolean default true
);

-- Indexes
create index idx_accounts_pipeline on public.accounts(pipeline_status, pipeline_phase);
create index idx_accounts_health on public.accounts(health_score);
create index idx_accounts_rep on public.accounts(assigned_rep_id);
create index idx_accounts_active on public.accounts(is_active) where is_active = true;

-- RLS
alter table public.accounts enable row level security;
create policy "Accounts viewable by authenticated users" on public.accounts
  for select using (auth.role() = 'authenticated');
create policy "Accounts manageable by sales and admin" on public.accounts
  for all using (
    auth.role() = 'authenticated'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'manager', 'sales_rep')
    )
  );


-- Contacts (people at each account)
create table public.contacts (
  id uuid default gen_random_uuid() primary key,
  account_id uuid references public.accounts(id) on delete cascade not null,
  full_name text not null,
  title text,
  email text,
  phone text,
  is_primary boolean default false,
  is_active boolean default true,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_contacts_account on public.contacts(account_id);
alter table public.contacts enable row level security;
create policy "Contacts viewable by authenticated" on public.contacts
  for select using (auth.role() = 'authenticated');
create policy "Contacts manageable by sales and admin" on public.contacts
  for all using (
    auth.role() = 'authenticated'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'manager', 'sales_rep')
    )
  );


-- Interactions (every customer touchpoint)
create table public.interactions (
  id uuid default gen_random_uuid() primary key,
  account_id uuid references public.accounts(id) on delete cascade not null,
  contact_id uuid references public.contacts(id),
  user_id uuid references public.profiles(id),

  channel text not null,  -- email, phone, sms, meeting, note, whatsapp, vendor_day, agent_action
  direction text default 'outbound',  -- inbound, outbound, internal
  subject text,
  content text,
  sentiment text,  -- positive, neutral, negative (AI-analyzed)

  -- For meetings
  meeting_date timestamptz,
  meeting_duration_minutes integer,

  -- Metadata
  created_at timestamptz default now(),
  is_ai_generated boolean default false
);

create index idx_interactions_account on public.interactions(account_id);
create index idx_interactions_date on public.interactions(created_at desc);
create index idx_interactions_channel on public.interactions(channel);
alter table public.interactions enable row level security;
create policy "Interactions viewable by authenticated" on public.interactions
  for select using (auth.role() = 'authenticated');
create policy "Interactions creatable by authenticated" on public.interactions
  for insert with check (auth.role() = 'authenticated');


-- Opportunities (sales pipeline deals)
create table public.opportunities (
  id uuid default gen_random_uuid() primary key,
  account_id uuid references public.accounts(id) on delete cascade not null,
  title text not null,
  value numeric not null default 0,
  stage text not null default 'prospecting',  -- prospecting, proposal, negotiation, closed_won, closed_lost
  probability integer default 25,  -- 0-100
  expected_close_date date,
  category text,  -- flower, preroll, vaporizer, concentrate, edible, beverage, mixed
  assigned_rep_id uuid references public.profiles(id),
  notes text,
  closed_at timestamptz,
  close_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_opportunities_account on public.opportunities(account_id);
create index idx_opportunities_stage on public.opportunities(stage);
alter table public.opportunities enable row level security;
create policy "Opportunities viewable by authenticated" on public.opportunities
  for select using (auth.role() = 'authenticated');
create policy "Opportunities manageable by sales and admin" on public.opportunities
  for all using (
    auth.role() = 'authenticated'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'manager', 'sales_rep')
    )
  );


-- Pipeline movements (audit trail of A/I/R changes)
create table public.pipeline_movements (
  id uuid default gen_random_uuid() primary key,
  account_id uuid references public.accounts(id) on delete cascade not null,
  from_code text not null,
  to_code text not null,
  reason text,
  direction text not null,  -- advance, decline, lateral
  moved_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

create index idx_pipeline_movements_account on public.pipeline_movements(account_id);
create index idx_pipeline_movements_date on public.pipeline_movements(created_at desc);
alter table public.pipeline_movements enable row level security;
create policy "Pipeline movements viewable by authenticated" on public.pipeline_movements
  for select using (auth.role() = 'authenticated');
create policy "Pipeline movements creatable by sales and admin" on public.pipeline_movements
  for insert with check (
    auth.role() = 'authenticated'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'manager', 'sales_rep')
    )
  );


-- Activity log (cross-module activity feed)
create table public.activity_log (
  id uuid default gen_random_uuid() primary key,
  account_id uuid references public.accounts(id),
  user_id uuid references public.profiles(id),
  module text not null,  -- crm, orders, delivery, pipeline, etc.
  action text not null,  -- created, updated, status_change, etc.
  description text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create index idx_activity_log_account on public.activity_log(account_id);
create index idx_activity_log_date on public.activity_log(created_at desc);
create index idx_activity_log_module on public.activity_log(module);
alter table public.activity_log enable row level security;
create policy "Activity log viewable by authenticated" on public.activity_log
  for select using (auth.role() = 'authenticated');
create policy "Activity log creatable by authenticated" on public.activity_log
  for insert with check (auth.role() = 'authenticated');


-- Apply updated_at triggers
create trigger accounts_updated_at before update on public.accounts
  for each row execute function public.update_updated_at();
create trigger contacts_updated_at before update on public.contacts
  for each row execute function public.update_updated_at();
create trigger opportunities_updated_at before update on public.opportunities
  for each row execute function public.update_updated_at();
