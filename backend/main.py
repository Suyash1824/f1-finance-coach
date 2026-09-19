from fastapi import FastAPI, UploadFile, File, Depends
from sqlalchemy.orm import Session
import pandas as pd
import io

from database import engine, SessionLocal
from models import Base, Transaction, Category
from categorizer import categorize_merchant
from schemas import TransactionOut, ImportSummary

Base.metadata.create_all(bind=engine)

app = FastAPI(title="F1 Finance Coach API")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/transactions/import", response_model=ImportSummary)
async def import_transactions(file: UploadFile = File(...), db: Session = Depends(get_db)):
    content = await file.read()
    df = pd.read_csv(io.BytesIO(content))

    categorized_count = 0
    uncategorized_count = 0

    for _, row in df.iterrows():
        category_name = categorize_merchant(str(row["merchant"]))

        category = db.query(Category).filter(Category.name == category_name).first()
        if not category:
            category = Category(name=category_name)
            db.add(category)
            db.flush()

        if category_name == "Uncategorized":
            uncategorized_count += 1
        else:
            categorized_count += 1

        txn = Transaction(
            date=row["date"],
            merchant=row["merchant"],
            amount=float(row["amount"]),
            type=row["type"],
            category_id=category.id,
        )
        db.add(txn)

    db.commit()

    return ImportSummary(
        total_imported=len(df),
        categorized=categorized_count,
        uncategorized=uncategorized_count,
    )

@app.get("/transactions", response_model=list[TransactionOut])
def get_transactions(db: Session = Depends(get_db)):
    transactions = db.query(Transaction).all()
    return [
        TransactionOut(
            id=t.id,
            date=t.date,
            merchant=t.merchant,
            amount=t.amount,
            type=t.type,
            category=t.category.name if t.category else None,
            is_recurring=t.is_recurring,
        )
        for t in transactions
    ]