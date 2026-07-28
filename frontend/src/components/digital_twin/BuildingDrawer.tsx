import React from 'react';
import { Building, Incident } from '../../types';
import { X, Zap, Droplets, Thermometer, Users, AlertTriangle, Cpu, HelpCircle } from 'lucide-react';
import { triggerIncidentWorkflow } from '../../services/api';

interface Props {
  building: Building | null;
  activeIncidents: Incident[];
  onClose: () => void;
}

export const BuildingDrawer: React.FC<Props> = ({ building, activeIncidents, onClose }) => {
  if (!building) return null;

  const handleTriggerSwarm = async (incidentId: string) => {
    try {
      await triggerIncidentWorkflow(incidentId);
      alert('AI Multi-Agent Swarm activated for incident!');
    } catch (e) {
      console.error('Failed to trigger swarm:', e);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-surface border-l border-surface-border z-40 p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-border pb-4 mb-6">
          <div>
            <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wide">{building.code}</div>
            <h2 className="text-xl font-bold text-white leading-snug">{building.name}</h2>
            <span className="text-xs text-gray-400">{building.category} Zone</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-surface-hover text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Banner */}
        <div className={`p-3 rounded-xl mb-6 text-xs font-semibold flex items-center justify-between border ${
          building.status === 'RED'
            ? 'bg-twin-red/10 border-twin-red/30 text-twin-red'
            : building.status === 'ORANGE'
            ? 'bg-twin-orange/10 border-twin-orange/30 text-twin-orange'
            : 'bg-twin-green/10 border-twin-green/30 text-twin-green'
        }`}>
          <span>Operational Status: {building.status}</span>
          <span className="w-2.5 h-2.5 rounded-full bg-current animate-pulse" />
        </div>

        {/* Live Environmental Sensors Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="glass-panel p-3 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Power Load</span>
            </div>
            <div className="text-lg font-extrabold text-white font-mono">{building.power_kw} <span className="text-xs text-gray-400 font-normal">kW</span></div>
          </div>

          <div className="glass-panel p-3 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Water Flow</span>
            </div>
            <div className="text-lg font-extrabold text-white font-mono">{building.water_flow_lpm} <span className="text-xs text-gray-400 font-normal">LPM</span></div>
          </div>

          <div className="glass-panel p-3 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <Thermometer className="w-4 h-4 text-rose-400" />
              <span>Temperature</span>
            </div>
            <div className="text-lg font-extrabold text-white font-mono">{building.temperature_c}°C</div>
          </div>

          <div className="glass-panel p-3 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Occupancy</span>
            </div>
            <div className="text-lg font-extrabold text-white font-mono">
              {building.occupancy_current} / {building.occupancy_capacity}
            </div>
          </div>
        </div>

        {/* Active Incidents section */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-200 mb-3 flex items-center justify-between">
            <span>Active Incidents ({activeIncidents.length})</span>
            {activeIncidents.length > 0 && <AlertTriangle className="w-4 h-4 text-twin-orange animate-bounce" />}
          </h3>

          {activeIncidents.length === 0 ? (
            <div className="text-xs text-gray-400 glass-panel p-3 rounded-xl text-center">
              No active incidents reported for this asset.
            </div>
          ) : (
            <div className="space-y-3">
              {activeIncidents.map((inc) => (
                <div key={inc.id} className="glass-panel p-3 rounded-xl border-l-4 border-twin-red space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-white truncate">{inc.title}</span>
                    <span className="px-2 py-0.5 rounded bg-twin-red/20 text-twin-red text-[10px] uppercase font-bold">{inc.severity}</span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">{inc.description}</p>
                  
                  <button
                    onClick={() => handleTriggerSwarm(inc.id)}
                    className="w-full mt-2 py-1.5 px-3 rounded-lg bg-primary-600/30 hover:bg-primary-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Run Multi-Agent Swarm</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer info */}
      <div className="pt-4 border-t border-surface-border text-[11px] text-gray-400 flex items-center justify-between font-mono">
        <span>ID: {building.id}</span>
        <span>Updated: {new Date(building.last_updated).toLocaleTimeString()}</span>
      </div>
    </div>
  );
};
