from fastapi import FastAPI

app = FastAPI(title="F1 Finance Coach API")

@app.get("/health")
def health():
    return {"status": "ok"}