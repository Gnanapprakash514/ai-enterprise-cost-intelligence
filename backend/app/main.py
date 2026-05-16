from fastapi import FastAPI

app = FastAPI(title="AI Enterprise Cost Intelligence API")


@app.get("/")
def root():
    return {"message": "AI Enterprise Cost Intelligence API is running"}