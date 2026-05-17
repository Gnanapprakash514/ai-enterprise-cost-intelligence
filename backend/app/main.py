from fastapi import FastAPI

app = FastAPI(
    title="Enterprise Cost Intelligence API",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "message": "AI for Enterprise Cost Intelligence Backend is Running"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }