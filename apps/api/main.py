from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.auth.router import router as auth_router
from app.crm.router import router as crm_router
from app.products.router import router as products_router

app = FastAPI(
    title="Frost API",
    description="Cannabis operations platform API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        settings.app_url,
        settings.website_url,
        settings.portal_url,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(crm_router, prefix="/api/crm", tags=["crm"])
app.include_router(products_router, prefix="/api/products", tags=["products"])


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}
