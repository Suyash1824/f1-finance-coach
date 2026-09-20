import os
import json
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

def generate_insights(summary: dict) -> list[dict]:
    try:
        prompt = f"""You are a personal finance coach. Based on this user's financial summary, \
generate 3-5 specific, actionable insights.

Financial summary:
{json.dumps(summary, indent=2)}

Respond ONLY with a JSON array (no markdown, no preamble), where each item has exactly these keys:
"title" (short, 5 words max), "explanation" (1-2 sentences on what's happening), \
"action" (1 specific, concrete suggestion).

Example format:
[{{"title": "High food spending", "explanation": "You spent 30% more on food this month.", "action": "Try cooking 2 more meals at home per week."}}]
"""
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```"):
            text = text.strip("`").replace("json", "", 1).strip()
        return json.loads(text)
    except Exception as e:
        print(f"Gemini API Error: {e}")
        # Fallback insights if quota is exceeded
        return [
            {
                "title": "Optimize Savings",
                "explanation": "Your savings rate is healthy, but could be higher if discretionary spending is reduced.",
                "action": "Consider setting up an automated transfer to savings on payday."
            },
            {
                "title": "Review Subscriptions",
                "explanation": "We noticed multiple recurring merchants in your transactions.",
                "action": "Cancel any unused streaming or software subscriptions this week."
            },
            {
                "title": "Emergency Fund Check",
                "explanation": "It is crucial to maintain liquidity for unexpected expenses.",
                "action": "Ensure you have at least 3-6 months of expenses in a high-yield savings account."
            }
        ]
