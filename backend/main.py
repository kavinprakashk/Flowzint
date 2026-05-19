import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.core.config import settings, ENV_PATH
from backend.core.logger import logger
from backend.core.exceptions import add_exception_handlers
from backend.core.database import supabase, supabase_admin

# Import routers
from backend.api.routes import health, auth, database_test

def create_app() -> FastAPI:
    # Adding components for swagger security configuration
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="Core Live Backend Connection System for Flowzint AI. Features native Supabase Auth.",
        docs_url="/docs",
        redoc_url="/redoc"
    )

    # --------------------------------------------------
    # CORS CONFIGURATION
    # --------------------------------------------------
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Restrict in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # --------------------------------------------------
    # EXCEPTION HANDLERS
    # --------------------------------------------------
    add_exception_handlers(app)

    # --------------------------------------------------
    # ROOT ROUTE
    # --------------------------------------------------
    @app.get("/")
    async def root():
        return {
            "project": settings.PROJECT_NAME,
            "app": settings.APP_NAME,
            "status": "running"
        }

    # --------------------------------------------------
    # API ROUTERS
    # --------------------------------------------------
    app.include_router(health.router, prefix=f"{settings.API_V1_STR}", tags=["Health"])
    app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Auth"])
    app.include_router(database_test.router, prefix=f"{settings.API_V1_STR}/db", tags=["Database"])

    # --------------------------------------------------
    # STARTUP EVENTS
    # --------------------------------------------------
    @app.on_event("startup")
    async def startup_event():
        logger.info("==================================================")
        logger.info(f"🚀 Starting up {settings.PROJECT_NAME}...")
        logger.info("==================================================")
        logger.info(f"Environment file target: {ENV_PATH}")
        logger.info(f"Supabase URL configured: {'Yes' if settings.SUPABASE_URL else 'No'}")
        
        # We no longer need JWT_SECRET_KEY for auth verification because we use native verification
        
        if supabase is None:
            logger.warning("⚠️ Warning: Supabase ANON client is NOT initialized.")
        else:
            logger.info("✅ Supabase ANON client initialized.")
            
        if supabase_admin is None:
            logger.warning("⚠️ Warning: Supabase SERVICE client is NOT initialized.")
        else:
            logger.info("✅ Supabase SERVICE client initialized.")
        
        logger.info("🛡️ Authentication strategy: Native Supabase HTTPBearer Verification")
        logger.info("==================================================")

    # --------------------------------------------------
    # SHUTDOWN EVENTS
    # --------------------------------------------------
    @app.on_event("shutdown")
    async def shutdown_event():
        logger.info(f"Shutting down {settings.PROJECT_NAME}...")

    return app

app = create_app()

if __name__ == "__main__":
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
