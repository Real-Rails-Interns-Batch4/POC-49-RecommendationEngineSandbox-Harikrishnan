import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from data_adapter import RecommendationAdapter

# Load environment variables from .env
load_dotenv()

app = FastAPI(title="POC-49 Recommendation Engine API", version="1.1")

# Enable CORS using environment variables for security
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the data adapter
adapter = RecommendationAdapter()

class ReRankRequest(BaseModel):
    relevance_weight: float = 1.0
    price_sensitivity: float = 0.5
    recency_weight: float = 0.2

@app.post("/api/re-rank")
def re_rank_items(payload: ReRankRequest):
    # Data is now fetched via the adapter instead of a hardcoded variable
    items = adapter.get_items()
    
    scored_items = []
    for item in items:
        # Normalize attributes (0 to 1 scale)
        rel_score = item["base_relevance"] / 100.0
        # Price utility: cheaper is better
        price_utility = 1.0 - min(item["price"] / 200.0, 1.0)
        # Recency utility: newer is better
        recency_utility = 1.0 - min(item["age_days"] / 100.0, 1.0)
        
        # Compute final score
        weight_sum = payload.relevance_weight + payload.price_sensitivity + payload.recency_weight
        final_score = (
            (rel_score * payload.relevance_weight) +
            (price_utility * payload.price_sensitivity) +
            (recency_utility * payload.recency_weight)
        ) / weight_sum
        
        scored_items.append({
            **item,
            "final_score": round(final_score * 100, 2)
        })
        
    scored_items.sort(key=lambda x: x["final_score"], reverse=True)
    return {"status": "success", "data": scored_items}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "architect": "Harikrishnan"}