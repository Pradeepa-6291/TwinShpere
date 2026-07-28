import React, { useEffect, useState } from 'react';
import { searchMemory } from '../services/api';
import { HistoricalIncident } from '../types';
import { Database, Search, CheckCircle2, History } from 'lucide-react';

export const MemoryPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [incidents, setIncidents] = useState<HistoricalIncident[]>([]);

  const handleSearch = async (q: string) => {
    try {
      const data = await searchMemory(q);
      setIncidents(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    handleSearch('');
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between glass-panel p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">AI Institutional Memory & Knowledge Base</h2>
            <p className="text-xs text-gray-400">Historical Incident Retrieval, Root Cause Vectors, & Solution Fidelity</p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            placeholder="Search past incidents by keyword or symptoms (e.g. pump failure, chiller bearing)..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-hover border border-surface-border text-xs text-white placeholder-gray-500"
          />
        </div>
      </div>

      {/* Historical Cases */}
      <div className="space-y-4">
        {incidents.map((inc) => (
          <div key={inc.id} className="glass-panel p-5 rounded-xl space-y-2 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-base">{inc.title}</span>
              <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-xs font-bold">
                {inc.similarity_score_pct}% Vector Match
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-surface-hover p-3 rounded-lg font-mono">
              <div>
                <span className="text-gray-400 block text-[10px]">Identified Root Cause:</span>
                <span className="text-white font-semibold">{inc.root_cause}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Proven Applied Solution:</span>
                <span className="text-twin-green font-semibold">{inc.solution_applied}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 font-mono pt-1">
              <span>Location: {inc.location_name}</span>
              <span>MTTR: {inc.resolution_time_hours} hrs | Success Rate: {inc.success_rate_pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
