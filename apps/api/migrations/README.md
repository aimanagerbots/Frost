# Frost Database Migrations

SQL migrations for the Supabase PostgreSQL database. Run in order.

## How to Run

### Option A: Supabase SQL Editor (Recommended for initial setup)
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy-paste each migration file in order (001, 002, 003)
4. Click "Run" for each

### Option B: Supabase CLI
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref xujvrkrkzousllsprapg

# Run migrations
supabase db push
```

### Option C: Direct psql
```bash
psql $DATABASE_URL -f migrations/001_auth_profiles.sql
psql $DATABASE_URL -f migrations/002_crm_core.sql
psql $DATABASE_URL -f migrations/003_product_catalog.sql
```

## Migration Order

| # | File | Tables |
|---|------|--------|
| 1 | `001_auth_profiles.sql` | `profiles` (extends auth.users) |
| 2 | `002_crm_core.sql` | `accounts`, `contacts`, `interactions`, `opportunities`, `pipeline_movements`, `activity_log` |
| 3 | `003_product_catalog.sql` | `strains`, `products` |

## Notes
- Migration 001 creates the `update_updated_at()` trigger function used by all subsequent migrations
- All tables have RLS enabled with appropriate policies
- Generated columns (`pipeline_code`, `health_tier`, `days_since_last_order`) are computed automatically
