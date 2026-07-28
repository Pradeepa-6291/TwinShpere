import React, { useEffect, useState } from 'react';
import { getPredictions } from '../services/api';
import { Prediction } from '../types';
import { TrendingUp, AlertTriangle, ShieldCheck, Clock, Cpu } from 'lucide-react';

export const PredictionsPage: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    getPredictions().then(setPredictions);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between glass-panel p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Predictive Intelligence Engine</h2>
            <p className="text-xs text-gray-400">Proactive Failure Prevention & Statistical Anomaly Forecasting</p>
          </div>
        </div>
      </div>

      {/* Predictions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {predictions.map((pred) => (
          <div key={pred.id} className="glass-panel p-6 rounded-2xl space-y-4 border-l-4 border-cyan-500">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold uppercase">
                {pred.category}
              </span>
              <span className="text-xs text-twin-orange font-bold font-mono">
                {pred.probability_pct}% Failure Probability
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">{pred.title}</h3>
              <p className="text-xs text-gray-400 font-mono mt-1">Target Asset: {pred.target_asset}</p>
            </div>

            <div className="glass-panel p-3 rounded-xl space-y-1 text-xs">
              <strong className="text-gray-300 font-bold block">Contributing Evidence Factors:</strong>
              <ul className="list-disc list-inside text-gray-400 space-y-0.5">
                {pred.contributing_factors.map((cf, i) => (
                  <li key={i}>{cf}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-surface-hover border border-surface-border text-xs text-cyan-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold">Recommended Proactive Action:</strong>
                {pred.recommended_prevention}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
