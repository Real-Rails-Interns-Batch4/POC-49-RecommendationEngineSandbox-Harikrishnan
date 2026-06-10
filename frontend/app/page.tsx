"use client";

import React, { useState, useEffect } from "react";

interface Item {
  id: number;
  title: string;
  category: string;
  base_relevance: number;
  price: number;
  age_days: number;
  final_score: number;
}

export default function RecommendationSandbox() {
  const [relevanceWeight, setRelevanceWeight] = useState<number>(1.0);
  const [priceSensitivity, setPriceSensitivity] = useState<number>(0.5);
  const [recencyWeight, setRecencyWeight] = useState<number>(0.2);
  
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/re-rank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          relevance_weight: relevanceWeight,
          price_sensitivity: priceSensitivity,
          recency_weight: recencyWeight,
        }),
      });
      const result = await response.json();
      if (result.status === "success") {
        setItems(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch matrix re-ranking", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRankings();
  }, [relevanceWeight, priceSensitivity, recencyWeight]);

  const handleReset = () => {
    setRelevanceWeight(1.0);
    setPriceSensitivity(0.5);
    setRecencyWeight(0.2);
  };

  const downloadData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "interaction_matrix.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Content Outcomes calculation (Top 3 items bias feedback loop demo)
  const top3 = items.slice(0, 3);
  const avgPrice = top3.length ? top3.reduce((acc, curr) => acc + curr.price, 0) / 3 : 0;
  const avgRelevance = top3.length ? top3.reduce((acc, curr) => acc + curr.base_relevance, 0) / 3 : 0;

  return (
    <main className="min-h-screen bg-[#030712] text-white font-sans p-6 flex flex-col gap-6">
      {/* Header / Developer Signature */}
      <header className="border-b border-[#1F2937] pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#38BDF8]">Recommendation Engine Sandbox</h1>
          <p className="text-sm text-gray-400">Distribution & Demand Rail • Synthetic User/Item Interaction Matrix</p>
        </div>
        <div className="text-right text-xs text-indigo-400">
          <p className="font-semibold">Architect: Harikrishnan</p>
          <p>Stack: Next.js + FastAPI + Tailwind</p>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Control Panel (25%) */}
        <aside className="lg:w-1/4 bg-[#0B1117] p-5 rounded-lg border border-[#1F2937] flex flex-col gap-5 h-fit">
          <h2 className="text-lg font-semibold border-b border-[#1F2937] pb-2 text-[#38BDF8]">Configuration Room</h2>
          
          <div>
            <label className="text-xs text-gray-400 block mb-1">Relevance Weight: {relevanceWeight.toFixed(1)}</label>
            <input 
              type="range" min="0" max="2" step="0.1" 
              value={relevanceWeight} 
              onChange={(e) => setRelevanceWeight(parseFloat(e.target.value))}
              className="w-full accent-[#38BDF8]"
              title="Adjusts importance of matching underlying content relevance"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Price Sensitivity: {priceSensitivity.toFixed(1)}</label>
            <input 
              type="range" min="0" max="2" step="0.1" 
              value={priceSensitivity} 
              onChange={(e) => setPriceSensitivity(parseFloat(e.target.value))}
              className="w-full accent-[#38BDF8]"
              title="Adjusts bias toward cheaper or free items"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Recency Bias: {recencyWeight.toFixed(1)}</label>
            <input 
              type="range" min="0" max="2" step="0.1" 
              value={recencyWeight} 
              onChange={(e) => setRecencyWeight(parseFloat(e.target.value))}
              className="w-full accent-[#38BDF8]"
              title="Adjusts bias toward recently added items"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={handleReset} className="flex-1 bg-[#1F2937] hover:bg-gray-700 text-xs py-2 rounded transition">Reset Scenarios</button>
            <button onClick={downloadData} className="flex-1 bg-[#38BDF8] text-black hover:bg-cyan-400 text-xs py-2 rounded transition font-bold">Export Matrix</button>
          </div>

          {/* Explainer Panels */}
          <div className="border-t border-[#1F2937] pt-4 mt-2 flex flex-col gap-4">
            <div>
              <h3 className="text-xs font-bold text-[#818CF8]">Why This Matters</h3>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">Turns opaque algorithmic ranking black-boxes into inspectable sandboxes, making dial-driven bias visible to everyday viewers, builders, and allocators.</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#818CF8]">Who Controls the Rail</h3>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">Users calibrate preference sliders in real-time, but the platform operator hardcodes the core mathematical scoring formula and default weights.</p>
            </div>
          </div>
        </aside>

        {/* Center/Right Panel (75%) */}
        <section className="flex-1 flex flex-col gap-6">
          {/* Model Score View */}
          <div className="bg-[#0B1117] p-6 rounded-lg border border-[#1F2937]">
            <h2 className="text-lg font-semibold mb-4 text-gray-200">Model Score & Ranking Matrix View</h2>
            
            {loading ? (
              <p className="text-sm text-gray-500 animate-pulse">Re-computing scoring matrix...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-gray-400 text-xs border-b border-[#1F2937]">
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Asset / Item</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Base Relevance</th>
                      <th className="py-3 px-4">Price (USD)</th>
                      <th className="py-3 px-4">Age (Days)</th>
                      <th className="py-3 px-4 text-[#38BDF8]">Calculated Score</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-[#1F2937]">
                    {items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-[#111823] transition">
                        <td className="py-3 px-4 font-mono text-gray-400">#{index + 1}</td>
                        <td className="py-3 px-4 font-medium text-gray-200">{item.title}</td>
                        <td className="py-3 px-4 text-xs text-gray-400">{item.category}</td>
                        <td className="py-3 px-4 font-mono text-xs text-gray-400">{item.base_relevance}%</td>
                        <td className="py-3 px-4 font-mono text-xs text-gray-400">${item.price.toFixed(2)}</td>
                        <td className="py-3 px-4 font-mono text-xs text-gray-400">{item.age_days}d</td>
                        <td className="py-3 px-4 font-mono font-bold text-[#38BDF8]">{item.final_score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bias Feedback Loop & Content Outcomes Demo */}
          <div className="bg-[#0B1117] p-6 rounded-lg border border-[#1F2937]">
            <h2 className="text-lg font-semibold mb-2 text-gray-200">Bias Feedback Loop Demo & Content Outcomes</h2>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">Observe how manipulating the configuration dials concentrates distribution and shifts the resulting top-tier content outcomes.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#030712] p-4 rounded border border-[#1F2937] flex flex-col justify-between">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Top 3 Outcomes Avg Price</span>
                <span className="text-2xl font-mono font-bold text-white mt-2">${avgPrice.toFixed(2)}</span>
                <span className="text-[10px] text-gray-500 mt-1">Impacted by Price Sensitivity dial</span>
              </div>
              <div className="bg-[#030712] p-4 rounded border border-[#1F2937] flex flex-col justify-between">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Top 3 Outcomes Avg Relevance</span>
                <span className="text-2xl font-mono font-bold text-[#38BDF8] mt-2">{avgRelevance.toFixed(1)}%</span>
                <span className="text-[10px] text-gray-500 mt-1">Impacted by Relevance Weight dial</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}