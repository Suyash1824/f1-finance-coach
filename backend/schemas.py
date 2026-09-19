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