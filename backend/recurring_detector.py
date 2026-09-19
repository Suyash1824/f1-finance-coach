from collections import defaultdict
from models import Transaction

def detect_recurring(db):
    transactions = db.query(Transaction).filter(Transaction.type == "expense").all()

    grouped = defaultdict(list)
    for t in transactions:
        grouped[t.merchant.lower()].append(t)

    recurring_merchants = []

    for merchant, txns in grouped.items():
        if len(txns) < 2:
            continue

        txns.sort(key=lambda t: t.date)
        dates = [t.date for t in txns]
        amounts = [t.amount for t in txns]

        gaps = [(dates[i+1] - dates[i]).days for i in range(len(dates) - 1)]
        avg_gap = sum(gaps) / len(gaps)

        amount_variation = (max(amounts) - min(amounts)) / max(amounts) if max(amounts) > 0 else 0

        if 20 <= avg_gap <= 40 and amount_variation < 0.15:
            for t in txns:
                t.is_recurring = True
            recurring_merchants.append({
                "merchant": txns[0].merchant,
                "average_amount": round(sum(amounts) / len(amounts), 2),
                "interval_days": round(avg_gap),
                "occurrences": len(txns),
            })

    db.commit()
    return recurring_merchants
    