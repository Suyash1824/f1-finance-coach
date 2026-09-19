from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
import pandas as pd
import io

from database import engine, SessionLocal
from models import Base, Transaction, Category, Budget, SavingsGoal
from categorizer import categorize_merchant
from schemas import (
    TransactionOut, ImportSummary, BudgetIn, BudgetOut,
    SavingsGoalIn, SavingsGoalOut, SavingsContribution, InsightsResponse
)
from recurring_detector import detect_recurring
from insights import generate_insights

Base.metadata.create_all(bind=engine)

app = FastAPI(title="F1 Finance Coach API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
            date=row["date"], merchant=row["merchant"], amount=float(row["amount"]),
            type=row["type"], category_id=category.id,
        )
        db.add(txn)
    db.commit()
    return ImportSummary(total_imported=len(df), categorized=categorized_count, uncategorized=uncategorized_count)

@app.get("/transactions", response_model=list[TransactionOut])
def get_transactions(db: Session = Depends(get_db)):
    transactions = db.query(Transaction).all()
    return [
        TransactionOut(
            id=t.id, date=t.date, merchant=t.merchant, amount=t.amount, type=t.type,
            category=t.category.name if t.category else None, is_recurring=t.is_recurring,
        ) for t in transactions
    ]

@app.post("/recurring/detect")
def run_recurring_detection(db: Session = Depends(get_db)):
    results = detect_recurring(db)
    return {"recurring_expenses_found": len(results), "details": results}

@app.post("/budgets", response_model=BudgetOut)
def create_budget(budget: BudgetIn, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.name == budget.category_name).first()
    if not category:
        category = Category(name=budget.category_name)
        db.add(category)
        db.flush()
    b = Budget(category_id=category.id, monthly_limit=budget.monthly_limit)
    db.add(b)
    db.commit()
    spent = db.query(func.sum(Transaction.amount)).filter(
        Transaction.category_id == category.id, Transaction.type == "expense"
    ).scalar() or 0.0
    return BudgetOut(id=b.id, category=category.name, monthly_limit=b.monthly_limit, spent=spent)

@app.get("/budgets", response_model=list[BudgetOut])
def get_budgets(db: Session = Depends(get_db)):
    budgets = db.query(Budget).all()
    result = []
    for b in budgets:
        spent = db.query(func.sum(Transaction.amount)).filter(
            Transaction.category_id == b.category_id, Transaction.type == "expense"
        ).scalar() or 0.0
        cat = db.query(Category).get(b.category_id)
        result.append(BudgetOut(id=b.id, category=cat.name if cat else "Unknown", monthly_limit=b.monthly_limit, spent=spent))
    return result

@app.post("/savings-goals", response_model=SavingsGoalOut)
def create_savings_goal(goal: SavingsGoalIn, db: Session = Depends(get_db)):
    g = SavingsGoal(name=goal.name, target_amount=goal.target_amount, target_date=goal.target_date, current_amount=0.0)
    db.add(g)
    db.commit()
    db.refresh(g)
    return g

@app.get("/savings-goals", response_model=list[SavingsGoalOut])
def get_savings_goals(db: Session = Depends(get_db)):
    return db.query(SavingsGoal).all()

@app.post("/savings-goals/{goal_id}/contribute", response_model=SavingsGoalOut)
def contribute_to_goal(goal_id: int, contribution: SavingsContribution, db: Session = Depends(get_db)):
    goal = db.query(SavingsGoal).filter(SavingsGoal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    goal.current_amount += contribution.amount
    db.commit()
    db.refresh(goal)
    return goal

@app.get("/insights", response_model=InsightsResponse)
def get_insights(db: Session = Depends(get_db)):
    transactions = db.query(Transaction).all()
    total_income = sum(t.amount for t in transactions if t.type == "income")
    total_expense = sum(t.amount for t in transactions if t.type == "expense")
    category_totals = {}
    for t in transactions:
        if t.type == "expense" and t.category:
            category_totals[t.category.name] = category_totals.get(t.category.name, 0) + t.amount
    recurring = [t.merchant for t in transactions if t.is_recurring]
    summary = {
        "total_income": total_income,
        "total_expense": total_expense,
        "savings_rate_percent": round((total_income - total_expense) / total_income * 100, 1) if total_income > 0 else 0,
        "spending_by_category": category_totals,
        "recurring_merchants": list(set(recurring)),
    }
    insights = generate_insights(summary)
    return InsightsResponse(insights=insights)