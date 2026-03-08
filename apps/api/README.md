# Frost API

FastAPI backend for the Frost cannabis operations platform.

## Setup

### 1. Install Python 3.12+

### 2. Create virtual environment
```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 4. Run database migrations
Copy each SQL file from `migrations/` into the Supabase SQL Editor and run in order:
1. `001_auth_profiles.sql`
2. `002_crm_core.sql`
3. `003_product_catalog.sql`

### 5. Seed data (optional)
```bash
python seed.py
```
Seeds 20 strains and 42 products. Does not seed accounts or CRM data.

### 6. Start dev server
```bash
uvicorn main:app --reload
```
API available at http://localhost:8000. Docs at http://localhost:8000/docs.

## Deployment (Railway)

The `Procfile` is configured for Railway deployment:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

Set environment variables in the Railway dashboard.

## API Endpoints

### Auth
- `POST /api/auth/signup` — Create user
- `POST /api/auth/login` — Login, returns JWT
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Current user profile
- `PATCH /api/auth/me` — Update profile
- `GET /api/auth/users` — List users (admin)

### CRM
- `GET /api/crm/accounts` — List accounts (filterable)
- `GET /api/crm/accounts/{id}` — Get account
- `POST /api/crm/accounts` — Create account
- `PATCH /api/crm/accounts/{id}` — Update account
- `GET /api/crm/contacts` — List contacts
- `POST /api/crm/contacts` — Create contact
- `PATCH /api/crm/contacts/{id}` — Update contact
- `GET /api/crm/interactions` — List interactions
- `POST /api/crm/interactions` — Create interaction
- `GET /api/crm/opportunities` — List opportunities
- `POST /api/crm/opportunities` — Create opportunity
- `PATCH /api/crm/opportunities/{id}` — Update opportunity
- `GET /api/crm/pipeline/overview` — Pipeline grid
- `GET /api/crm/pipeline/movements` — Recent movements
- `POST /api/crm/pipeline/move` — Move account in pipeline
- `GET /api/crm/dashboard` — Dashboard metrics

### Products
- `GET /api/products` — List products (filterable)
- `GET /api/products/featured` — Featured products
- `GET /api/products/by-category/{category}` — By category
- `GET /api/products/by-strain/{strain}` — By strain
- `GET /api/products/{slug}` — Single product
- `GET /api/products/strains/all` — List strains
- `GET /api/products/strains/{slug}` — Single strain

### Health
- `GET /api/health` — Health check
