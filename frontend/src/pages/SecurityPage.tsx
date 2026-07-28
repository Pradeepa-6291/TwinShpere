import React, { useState } from 'react';
import { ShieldAlert, AlertOctagon, CheckCircle2, Lock, Radio } from 'lucide-react';
import { triggerDemoScenario } from '../services/api';

export const SecurityPage: React.FC = () => {
  const [emergencyActive, setEmergencyActive] = useState(false);

  const handleActivateEmergency = async () => {
    setEmergencyActive(true);
    await triggerDemoScenario(5);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between glass-panel p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-twin-red/20 border border-twin-red/40 flex items-center justify-center text-twin-red">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Security & Emergency Operations</h2>
            <p className="text-xs text-gray-400">Access Control Perimeter, Evacuation Protocols, & Crisis Dispatch</p>
          </div>
        </div>
      </div>

      {/* Emergency Mode Card */}
      <div className={`p-6 rounded-2xl border transition-all duration-300 ${
        emergencyActive ? 'bg-twin-red/20 border-twin-red animate-pulse-slow' : 'glass-panel border-surface-border'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <AlertOctagon className="w-6 h-6 text-twin-red" />
              <span>Campus Emergency Protocol Mode</span>
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              Activating emergency mode broadcasts instant safety alerts, unlocks escape exits, and dispatches Emergency Squad Delta.
            </p>
          </div>

          <button
            onClick={handleActivateEmergency}
            className="px-6 py-3 rounded-xl bg-twin-red hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-twin-red/30 shrink-0"
          >
            {emergencyActive ? 'EMERGENCY MODE ACTIVE' : 'ACTIVATE EMERGENCY MODE'}
          </button>
        </div>
      </div>
    </div>
  );
};
