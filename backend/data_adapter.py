import os
import requests
from dotenv import load_dotenv

load_dotenv()

class RecommendationAdapter:
    def __init__(self):
        # Keys are loaded from .env which is now safe
        self.gdelt_key = os.getenv("GDELT_API_KEY")
        self.owid_key = os.getenv("OWID_API_KEY")

    def fetch_gdelt_data(self):
        # Placeholder for your real HTTP call
        # url = "https://api.gdeltproject.org/api/v2/..."
        # response = requests.get(url, params={"key": self.gdelt_key})
        # return response.json()
        return [{"id": 1, "title": "GDELT Insight: Tech Trends", "category": "AI/ML", "base_relevance": 98, "price": 0.0, "age_days": 2}]

    def fetch_owid_data(self):
        # Placeholder for OWID call
        return [{"id": 2, "title": "OWID: Digital Access", "category": "Business", "base_relevance": 85, "price": 0.0, "age_days": 15}]

    def get_items(self):
        # Aggregates data from both sources
        try:
            return self.fetch_gdelt_data() + self.fetch_owid_data()
        except Exception as e:
            print(f"Error fetching data: {e}")
            return [] # Fallback to empty or local mock