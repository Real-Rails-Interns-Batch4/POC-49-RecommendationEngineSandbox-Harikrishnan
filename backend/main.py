from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="POC-49 Recommendation Engine API", version="1.0")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Synthetic Item Database
SYNTHETIC_ITEMS = [
    {"id": 1, "title": "Next.js Enterprise Guide", "category": "Engineering", "base_relevance": 95, "price": 0.0, "age_days": 5},
    {"id": 2, "title": "FastAPI Microservices Blueprint", "category": "Engineering", "base_relevance": 88, "price": 29.99, "age_days": 12},
    {"id": 3, "title": "Tailwind Mastery Course", "category": "Design", "base_relevance": 92, "price": 49.0, "age_days": 45},
    {"id": 4, "title": "AI Agent Orchestration", "category": "AI/ML", "base_relevance": 98, "price": 0.0, "age_days": 2},
    {"id": 5, "title": "Legacy System Modernization", "category": "Business", "base_relevance": 75, "price": 199.0, "age_days": 90},
]

class ReRankRequest(BaseModel):
    relevance_weight: float = 1.0
    price_sensitivity: float = 0.5  # Higher means preference for cheaper items
    recency_weight: float = 0.2     # Higher means preference for newer items

@app.post("/api/re-rank")
def re_rank_items(payload: ReRankRequest):
    scored_items = []
    for item in SYNTHETIC_ITEMS:
        # Normalize attributes (0 to 1 scale)
        rel_score = item["base_relevance"] / 100.0
        # Price utility: cheaper is better (invert/normalize)
        price_utility = 1.0 - min(item["price"] / 200.0, 1.0)
        # Recency utility: newer is better
        recency_utility = 1.0 - min(item["age_days"] / 100.0, 1.0)
        
        # Compute final score dynamically based on user weights
        final_score = (
            (rel_score * payload.relevance_weight) +
            (price_utility * payload.price_sensitivity) +
            (recency_utility * payload.recency_weight)
        ) / (payload.relevance_weight + payload.price_sensitivity + payload.recency_weight)
        
        scored_items.append({
            **item,
            "final_score": round(final_score * 100, 2)
        })
        
    # Sort descending by final score
    scored_items.sort(key=lambda x: x["final_score"], reverse=True)
    return {"status": "success", "data": scored_items}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "architect": "Harikrishnan"}