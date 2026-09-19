CATEGORY_RULES = {
    "Food & Dining": ["swiggy", "zomato", "restaurant", "cafe", "dominos", "mcdonald"],
    "Transport": ["uber", "ola", "rapido", "petrol", "fuel", "metro"],
    "Entertainment": ["netflix", "spotify", "prime video", "hotstar", "bookmyshow"],
    "Shopping": ["amazon", "flipkart", "myntra", "ajio"],
    "Housing": ["rent", "maintenance"],
    "Utilities": ["electricity", "water bill", "gas bill", "wifi", "broadband", "recharge"],
    "Income": ["salary", "freelance", "payment received", "refund"],
}

def categorize_merchant(merchant: str) -> str:
    merchant_lower = merchant.lower()
    for category, keywords in CATEGORY_RULES.items():
        for keyword in keywords:
            if keyword in merchant_lower:
                return category
    return "Uncategorized"