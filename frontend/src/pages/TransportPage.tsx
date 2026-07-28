import React, { useEffect, useState } from 'react';
import { getTransportStatus } from '../services/api';
import { Bus, Clock, MapPin, AlertTriangle, Users } from 'lucide-react';

export const TransportPage: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getTransportStatus().then(setData);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between glass-panel p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Campus Transport & Transit Tracker</h2>
            <p className="text-xs text-gray-400">Shuttle Bus Telemetry, Route Delays, & Passenger Crowd Management</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-gray-400">Fleet On-Time: <strong className="text-twin-green">{data?.fleet_on_time_pct || 75}%</strong></span>
          <span className="text-gray-400">Active Fleet: <strong className="text-white">{data?.active_buses_count || 4} Buses</strong></span>
        </div>
      </div>

      {/* Bus Fleet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.buses?.map((bus: any) => (
          <div key={bus.id} className="glass-panel p-5 rounded-xl space-y-3 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-base">{bus.id} - {bus.route}</span>
              <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                bus.status === 'DELAYED' ? 'bg-twin-orange/20 text-twin-orange' : 'bg-twin-green/20 text-twin-green'
              }`}>
                {bus.status} {bus.delay_min ? `(+${bus.delay_min} mins)` : ''}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-surface-hover p-3 rounded-lg">
              <div>
                <span className="text-gray-400 block text-[10px]">Driver:</span>
                <span className="text-white font-semibold">{bus.driver}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Next Terminal:</span>
                <span className="text-cyan-400 font-semibold">{bus.next_stop}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400">Capacity Utilization:</span>
                <span className={bus.capacity_pct > 100 ? 'text-twin-red font-bold' : 'text-twin-green'}>{bus.capacity_pct}%</span>
              </div>
              <div className="w-full bg-surface-border rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${bus.capacity_pct > 100 ? 'bg-twin-red animate-pulse' : 'bg-twin-green'}`}
                  style={{ width: `${Math.min(100, bus.capacity_pct)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
