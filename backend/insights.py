import os
import json
from anthropic import Anthropic

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def generate_insights(summary: dict) -> list[dict]:
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
    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}]
    )
    text = response.content[0].text.strip()
    if text.startswith("```"):
        text = text.strip("`").replace("json", "", 1).strip()
    return json.loads(text)
