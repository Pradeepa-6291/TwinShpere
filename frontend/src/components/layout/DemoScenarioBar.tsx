import React from 'react';
import { useDemo } from '../../context/DemoContext';
import { Play, Zap, Droplets, Bus, ShieldAlert, Users, AlertOctagon } from 'lucide-react';

const scenarios = [
  { id: 1, name: 'Water Pump', icon: Droplets, active: 'bg-accent-500/12 border-accent-500/30 text-accent-400' },
  { id: 2, name: 'Energy Anomaly', icon: Zap, active: 'bg-twin-yellow-dim border-twin-yellow/30 text-twin-yellow' },
  { id: 3, name: 'Bus Delay', icon: Bus, active: 'bg-primary-600/12 border-primary-500/30 text-primary-400' },
  { id: 4, name: 'Security Breach', icon: ShieldAlert, active: 'bg-twin-purple-dim border-twin-purple/30 text-twin-purple' },
  { id: 5, name: 'Crowd Bottleneck', icon: Users, active: 'bg-twin-green-dim border-twin-green/30 text-twin-green' },
  { id: 6, name: 'Grid Failure', icon: AlertOctagon, active: 'bg-twin-red-dim border-twin-red/30 text-twin-red' },
];

export const DemoScenarioBar: React.FC = () => {
  const { activeScenarioId, triggerScenario } = useDemo();
  return (
    <div
      className="px-4 py-2 flex items-center gap-3 overflow-x-auto shrink-0"
      style={{ background: 'rgba(7,13,26,0.9)', borderBottom: '1px solid rgba(28,43,69,0.6)' }}
    >
      <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest shrink-0">Demo</span>
      <div className="flex items-center gap-1.5">
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          const isActive = activeScenarioId === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => triggerScenario(sc.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 shrink-0 ${
                isActive ? sc.active : 'border-surface-border text-text-muted hover:border-surface-hover hover:text-text-secondary bg-surface-2/40'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{sc.name}</span>
              {isActive && <Play className="w-2.5 h-2.5 animate-pulse-soft" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
