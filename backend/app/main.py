from fastapi import FastAPI
from sqlalchemy import text

from app.core import settings, engine, Base
from app.models import CostRecord
from app.api.routes import cost_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
)

# Register API routes
app.include_router(
    cost_router,
    prefix=settings.API_V1_PREFIX
)


@app.get("/")
def root():
    return {
        "message": f"{settings.APP_NAME} is Running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
    }


@app.get("/db-test")
def test_database_connection():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            value = result.scalar()

        return {
            "status": "success",
            "message": "Database connection is working",
            "result": value,
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
        }