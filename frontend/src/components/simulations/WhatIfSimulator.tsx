import React, { useState } from 'react';
import { HelpCircle, Play, Sparkles, CheckCircle2, ArrowRight, DollarSign, Clock, Users, ShieldCheck } from 'lucide-react';
import { runSimulation } from '../../services/api';
import { SimulationResult } from '../../types';

export const WhatIfSimulator: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const presetQueries = [
    "What if the main water pump fails?",
    "What if the main power supply fails?",
    "What if 30% of buses are unavailable?",
  ];

  const handleSimulate = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const data = await runSimulation(q);
      setResult(data);
    } catch (e) {
      console.error('Simulation error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white">What-If Scenario Simulator</h3>
            <p className="text-xs text-gray-400">Evaluate Operational Trade-Offs & Multi-Plan Impact Analysis</p>
          </div>
        </div>
      </div>

      {/* Query Bar */}
      <div className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a scenario question (e.g. What if main water pump fails?)"
          className="flex-1 px-4 py-3 rounded-xl bg-surface-hover border border-surface-border text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-sans"
        />
        <button
          onClick={() => handleSimulate(query)}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-cyan-500 text-white font-bold text-sm flex items-center gap-2 hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? (
            <Sparkles className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Simulate</span>
            </>
          )}
        </button>
      </div>

      {/* Preset Quick Chips */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-gray-400 font-semibold">Suggested Scenarios:</span>
        {presetQueries.map((pq, idx) => (
          <button
            key={idx}
            onClick={() => {
              setQuery(pq);
              handleSimulate(pq);
            }}
            className="px-3 py-1 rounded-lg bg-surface-hover hover:bg-surface-border border border-surface-border text-gray-300 transition"
          >
            {pq}
          </button>
        ))}
      </div>

      {/* Simulation Results Display */}
      {result && (
        <div className="pt-4 border-t border-surface-border space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400 uppercase font-bold">Simulation ID: {result.id}</span>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Affected Population: <strong className="text-white">{result.affected_population} Students & Staff</strong></span>
            </div>
          </div>

          {/* Cascading risks list */}
          <div className="glass-panel p-4 rounded-xl border-l-4 border-twin-orange">
            <h4 className="text-xs font-bold text-twin-orange uppercase tracking-wider mb-2">Predicted Cascading Consequences</h4>
            <ul className="space-y-1 text-xs text-gray-300">
              {result.cascading_risks.map((cr, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-twin-orange" />
                  <span>{cr}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solution Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.options.map((opt) => {
              const isRecommended = opt.option_id === result.recommended_option_id;

              return (
                <div
                  key={opt.option_id}
                  className={`p-5 rounded-2xl border transition-all duration-300 ${
                    isRecommended
                      ? 'glass-panel-glow border-cyan-500/80 bg-gradient-to-b from-surface to-primary-950/20'
                      : 'glass-panel border-surface-border'
                  }`}
                >
                  {isRecommended && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 mb-3 uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      <span>AI Recommended Solution</span>
                    </div>
                  )}

                  <h4 className="text-base font-bold text-white mb-3">{opt.name}</h4>

                  <div className="grid grid-cols-3 gap-2 mb-4 text-xs font-mono">
                    <div className="bg-surface-hover p-2 rounded-lg">
                      <div className="text-[10px] text-gray-400">Est. Cost</div>
                      <div className="text-white font-bold">{opt.cost_estimate}</div>
                    </div>
                    <div className="bg-surface-hover p-2 rounded-lg">
                      <div className="text-[10px] text-gray-400">Resolution</div>
                      <div className="text-white font-bold">{opt.resolution_time_min} mins</div>
                    </div>
                    <div className="bg-surface-hover p-2 rounded-lg">
                      <div className="text-[10px] text-gray-400">Impact</div>
                      <div className="text-white font-bold">{opt.impact_level}</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <strong className="text-twin-green">Pros:</strong>
                      <ul className="list-disc list-inside text-gray-300 pl-1">
                        {opt.pros.map((p, i) => <li key={i}>{p}</li>)}
                      </ul>
                    </div>
                    <div>
                      <strong className="text-twin-red">Cons:</strong>
                      <ul className="list-disc list-inside text-gray-300 pl-1">
                        {opt.cons.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Reasoning summary */}
          <div className="glass-panel p-4 rounded-xl border border-cyan-500/30 text-xs space-y-1">
            <strong className="text-cyan-400 font-bold block">Recommendation Rationale:</strong>
            <p className="text-gray-200">{result.recommendation_reasoning}</p>
          </div>
        </div>
      )}
    </div>
  );
};
