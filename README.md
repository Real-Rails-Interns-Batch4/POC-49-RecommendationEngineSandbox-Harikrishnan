# POC-49 - Recommendation Engine Sandbox

A cinematic, inspectable, and interactive demand-capture sandbox built to turn abstract ranking algorithms into a transparent, data-dense experience. 

## Rail Intelligence
* **Rail:** Distribution & Demand
* **Topic:** Recommendation Engine Sandbox
* **Difficulty:** Hard (Spec-Driven / Self-Contained Matrix)

## Architecture Summary
* **Architect:** Harikrishnan
* **Batch:** Batch 4 Interns
* **Core Stack:** Next.js, FastAPI, Tailwind CSS, TypeScript

## Features & UI Panels
- **Configuration Room:** Adjust ranking signals (Relevance, Recency, Price Sensitivity) in real-time. Includes glassmorphism-styled controls.
- **Model Score/Ranking Matrix View:** Inspectable scoring table demonstrating the underlying algorithmic math.
- **Why This Matters:** Explains the importance of bias transparency in algorithmic ranking engines.
- **Who Controls the Rail:** Clarifies the dynamic between user preference inputs and hardcoded platform governance.
- **Data Controls:** Scenario resets and downloadable interaction datasets (JSON).

## Setup & Operational Instructions

### 1. Backend Operation (FastAPI)
The backend manages the data ingestion pipeline and ranking logic.
1. `cd backend`
2. `pip install -r requirements.txt`
3. **Ingest Data:** `python ingest.py` (Generates `database.json`)
4. **Launch:** `uvicorn main:app --reload --port 8000`

### 2. Frontend Operation (Next.js)
The frontend serves the interactive matrix.
1. `cd frontend`
2. **Environment Setup:** Create a `.env.local` file in the `frontend/` root containing: `NEXT_PUBLIC_API_URL=http://localhost:8000`
3. `npm install`
4. **Launch:** `npm run dev`
5. **Access:** Open `http://localhost:3000` in your browser.

### 3. Sample Data
A static `sample_data.json` file is located in the `frontend/public/` directory for immediate testing of the ingestion structure.

## Screenshots

**Final Optimized UI (Strict 70:30 Layout & Glassmorphism):**
![Dashboard Optimized View](screenshots/Screenshot-2026-06-17-at-10.54.25-AM.png)