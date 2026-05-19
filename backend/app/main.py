from fastapi import FastAPI
from app.core import *
from sqlalchemy import text

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
)

@app.get("/")
def root():
    return {
        "message": f"{settings.APP_NAME}is Running"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
    }

@app.get("/db-test")
def test_database_connection():
    """
    Simple endpoint to verify that the database connection works.
    If the connection is successful, PostgreSQL returns 1.
    """
    try:
        # Open a connection using the SQLAlchemy engine
        with engine.connect() as connection:
            # Execute a very simple SQL query
            result = connection.execute(text("SELECT 1"))

            # Get the first value from the first row
            value = result.scalar()

        return {
            "status": "success",
            "message": "Database connection is working",
            "result": value
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }