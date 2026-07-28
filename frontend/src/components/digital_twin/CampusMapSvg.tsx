import React from 'react';
import { Building, StatusColor } from '../../types';
import { Zap, Droplets, Users, ShieldAlert, AlertTriangle } from 'lucide-react';

interface Props {
  buildings: Building[];
  selectedBuildingId: string | null;
  onSelectBuilding: (id: string) => void;
  activeFilter: string;
}

export const CampusMapSvg: React.FC<Props> = ({
  buildings,
  selectedBuildingId,
  onSelectBuilding,
  activeFilter,
}) => {
  const getStatusFill = (status: StatusColor) => {
    switch (status) {
      case 'RED': return '#EF4444';
      case 'ORANGE': return '#F97316';
      case 'YELLOW': return '#F59E0B';
      case 'BLUE': return '#3B82F6';
      default: return '#10B981';
    }
  };

  return (
    <div className="relative w-full h-[520px] bg-gradient-to-b from-[#090D16] to-[#111726] rounded-2xl border border-surface-border p-4 overflow-hidden shadow-2xl select-none">
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#3B82F6 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }} 
      />

      {/* SVG Canvas Map */}
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Campus Roads & Connecting Grid Pathways */}
        <path d="M 25 35 L 45 50 L 60 55 L 75 65" stroke="#1F293D" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
        <path d="M 55 30 L 45 50 L 40 80" stroke="#1F293D" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
        <path d="M 15 70 L 40 80 L 75 65" stroke="#1F293D" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
        <path d="M 80 20 L 55 30 L 60 55" stroke="#1E293B" strokeWidth="2" fill="none" />

        {/* Building Nodes */}
        {buildings.map((b) => {
          const isSelected = selectedBuildingId === b.id;
          const statusColor = getStatusFill(b.status);

          return (
            <g 
              key={b.id} 
              onClick={() => onSelectBuilding(b.id)}
              className="cursor-pointer group transition-transform duration-300"
            >
              {/* Outer Pulse Glow if Critical or Selected */}
              {(b.status === 'RED' || b.status === 'ORANGE' || isSelected) && (
                <circle
                  cx={b.coordinates.x}
                  cy={b.coordinates.y}
                  r={isSelected ? "9" : "7"}
                  fill={statusColor}
                  opacity="0.25"
                  className="animate-ping"
                />
              )}

              {/* Building Base Node */}
              <circle
                cx={b.coordinates.x}
                cy={b.coordinates.y}
                r="6"
                fill="#121824"
                stroke={isSelected ? '#22d3ee' : statusColor}
                strokeWidth={isSelected ? '2.5' : '1.8'}
                className="transition-all duration-300 group-hover:r-7"
              />

              {/* Inner Status Indicator Dot */}
              <circle
                cx={b.coordinates.x}
                cy={b.coordinates.y}
                r="3"
                fill={statusColor}
              />

              {/* Building Code Label */}
              <text
                x={b.coordinates.x}
                y={b.coordinates.y + 10}
                textAnchor="middle"
                className="text-[3.2px] font-mono font-bold fill-gray-200 pointer-events-none drop-shadow"
              >
                {b.code}
              </text>

              {/* Telemetry Hover Badge */}
              <text
                x={b.coordinates.x}
                y={b.coordinates.y - 8}
                textAnchor="middle"
                className="text-[2.6px] font-sans fill-cyan-400 opacity-80 group-hover:opacity-100 font-semibold"
              >
                {activeFilter === 'energy' ? `${b.power_kw} kW` : activeFilter === 'water' ? `${b.water_flow_lpm} LPM` : b.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 glass-panel px-3 py-2 rounded-xl flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-twin-green" /><span>Normal</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-twin-yellow" /><span>Warning</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-twin-orange animate-pulse" /><span>Attention</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-twin-red animate-ping" /><span>Critical</span></div>
      </div>
    </div>
  );
};
