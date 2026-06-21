import json
import os

# Define the structure of your data
def ingest_data():
    data = [
        {"id": 1, "title": "AI Agent Orchestration", "relevance": 98, "price": 0.0, "age_days": 2},
        {"id": 2, "title": "Global Market Analysis", "relevance": 85, "price": 62.5, "age_days": 14},
        {"id": 3, "title": "Quantum Computing Hardware", "relevance": 93, "price": 654.0, "age_days": 5}
    ]
    
    # Write to database.json
    with open('database.json', 'w') as f:
        json.dump(data, f, indent=4)
    print("Successfully generated database.json")

if __name__ == "__main__":
    ingest_data()