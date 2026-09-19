from fastapi import FastAPI
from database import engine
from models import Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="F1 Finance Coach API")

@app.get("/health")
def health():
    return {"status": "ok"}