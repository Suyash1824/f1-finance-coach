from pydantic import BaseModel
from datetime import date as date_type
from typing import Optional

class TransactionOut(BaseModel):
    id: int
    date: date_type
    merchant: str
    amount: float
    type: str
    category: Optional[str] = None
    is_recurring: bool
    class Config:
        from_attributes = True

class ImportSummary(BaseModel):
    total_imported: int
    categorized: int
    uncategorized: int

class BudgetIn(BaseModel):
    category_name: str
    monthly_limit: float

class BudgetOut(BaseModel):
    id: int
    category: str
    monthly_limit: float
    spent: float
    class Config:
        from_attributes = True

class SavingsGoalIn(BaseModel):
    name: str
    target_amount: float
    target_date: Optional[date_type] = None

class SavingsGoalOut(BaseModel):
    id: int
    name: str
    target_amount: float
    current_amount: float
    target_date: Optional[date_type] = None
    onchain_tx_hash: Optional[str] = None
    class Config:
        from_attributes = True

class SavingsContribution(BaseModel):
    amount: float

class InsightItem(BaseModel):
    title: str
    explanation: str
    action: str

class InsightsResponse(BaseModel):
    insights: list[InsightItem]