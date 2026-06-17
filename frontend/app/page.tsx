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

  const top3 = items.slice(0, 3);
  const avgPrice = top3.length ? top3.reduce((acc, curr) => acc + curr.price, 0) / 3 : 0;
  const avgRelevance = top3.length ? top3.reduce((acc, curr) => acc + curr.base_relevance, 0) / 3 : 0;

  return (
    <main className="min-h-screen bg-[#030712] text-white font-sans p-6">
      {/* Header */}
      <header className="border-b border-[#1F2937] pb-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#38BDF8]">Recommendation Engine Sandbox</h1>
          <p className="text-sm text-gray-400">Distribution & Demand Rail • Intelligence Library POC-49</p>
        </div>
        <div className="text-right text-xs text-indigo-400">
          <p className="font-semibold">Architect: Harikrishnan</p>
        </div>
      </header>

      {/* Strict 70:30 Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* LEFT: Main Intelligence View (70%) */}
        <section className="lg:w-[70%] flex flex-col gap-6">
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
                      <th className="py-3 px-4">Asset</th>
                      <th className="py-3 px-4">Relevance</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4 text-[#38BDF8]">Calculated Score</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-[#1F2937]">
                    {items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-[#111823] transition">
                        <td className="py-3 px-4 font-mono text-gray-400">#{index + 1}</td>
                        <td className="py-3 px-4 font-medium">{item.title}</td>
                        <td className="py-3 px-4 text-xs">{item.base_relevance}%</td>
                        <td className="py-3 px-4 text-xs">${item.price.toFixed(2)}</td>
                        <td className="py-3 px-4 font-mono font-bold text-[#38BDF8]">{item.final_score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* RIGHT: Intelligence Layer (30%) */}
        <aside className="lg:w-[30%] flex flex-col gap-6">
          <div className="bg-[#0B1117] p-6 rounded-lg border border-[#1F2937]">
            <h2 className="text-lg font-semibold mb-4 text-[#38BDF8]">Configuration Room</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Relevance Weight</label>
                <input type="range" min="0" max="2" step="0.1" value={relevanceWeight} onChange={(e) => setRelevanceWeight(parseFloat(e.target.value))} className="w-full accent-[#38BDF8]" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Price Sensitivity</label>
                <input type="range" min="0" max="2" step="0.1" value={priceSensitivity} onChange={(e) => setPriceSensitivity(parseFloat(e.target.value))} className="w-full accent-[#38BDF8]" />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Recency Bias</label>
                <input type="range" min="0" max="2" step="0.1" value={recencyWeight} onChange={(e) => setRecencyWeight(parseFloat(e.target.value))} className="w-full accent-[#38BDF8]" />
              </div>
              <div className="flex gap-2 pt-4">
                <button onClick={handleReset} className="flex-1 bg-[#1F2937] hover:bg-gray-700 text-xs py-2 rounded transition">Reset</button>
                <button onClick={downloadData} className="flex-1 bg-[#38BDF8] text-black hover:bg-cyan-400 text-xs py-2 rounded transition font-bold">Download JSON</button>
              </div>
            </div>
          </div>

          <div className="bg-[#0B1117] p-6 rounded-lg border border-[#1F2937]">
            <h3 className="text-xs font-bold text-[#818CF8] mb-2">Why This Matters</h3>
            <p className="text-[11px] text-gray-400">Algorithmic ranking engines often operate as black boxes. This sandbox makes bias transparent, allowing allocators to simulate how weight shifts redistribute visibility.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}