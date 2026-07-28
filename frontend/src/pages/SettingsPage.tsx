import React, { useState } from 'react';
import { Settings, Cpu, Database, Key } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [provider, setProvider] = useState('fallback');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between glass-panel p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-hover border border-surface-border flex items-center justify-center text-gray-300">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">System Settings & AI Configuration</h2>
            <p className="text-xs text-gray-400">Configure LLM Providers, MongoDB Atlas Parameters, & Thresholds</p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4 max-w-xl">
        <h3 className="font-bold text-base text-white">Configurable AI / LLM Provider</h3>

        <div>
          <label className="text-xs text-gray-400 block mb-1">AI Provider Engine</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-surface-hover border border-surface-border text-xs text-white"
          >
            <option value="fallback">Deterministic High-Fidelity Fallback Engine (Offline Safe)</option>
            <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
            <option value="gemini">Google Gemini 1.5 Pro</option>
            <option value="ollama">Local Ollama LLM</option>
          </select>
        </div>

        <button className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs">
          Save Settings
        </button>
      </div>
    </div>
  );
};
