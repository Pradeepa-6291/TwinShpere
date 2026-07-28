import React, { useEffect, useState } from 'react';
import { getEnergyMetrics } from '../services/api';
import { Zap, Sun, BatteryCharging, TrendingDown, Cpu } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const EnergyPage: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getEnergyMetrics().then(setData);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between glass-panel p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Energy Intelligence & Substation Grid</h2>
            <p className="text-xs text-gray-400">Building Power Telemetry, Solar Storage, & HVAC Load Optimization</p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl">
          <div className="text-xs text-gray-400 font-medium">Total Power Demand</div>
          <div className="text-3xl font-extrabold text-white font-mono mt-1">
            {data?.total_campus_power_kw || 364} <span className="text-xs font-normal text-gray-400">kW</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <div className="text-xs text-gray-400 font-medium">Solar Array Generation</div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono mt-1 flex items-center gap-2">
            <Sun className="w-6 h-6 text-amber-400 animate-spin" />
            <span>{data?.solar_generation_kw || 45.8} kW</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <div className="text-xs text-gray-400 font-medium">Battery Storage Bank</div>
          <div className="text-3xl font-extrabold text-cyan-400 font-mono mt-1 flex items-center gap-2">
            <BatteryCharging className="w-6 h-6 text-cyan-400" />
            <span>{data?.battery_storage_pct || 88.5}%</span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl">
          <div className="text-xs text-gray-400 font-medium">Energy Efficiency Rating</div>
          <div className="text-3xl font-extrabold text-twin-green font-mono mt-1">
            {data?.energy_efficiency_score || 91.2}%
          </div>
        </div>
      </div>

      {/* Building Power Chart */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-base text-white">Building Power Consumption Breakdown (kW)</h3>
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.building_breakdown || []}>
              <XAxis dataKey="code" stroke="#6B7280" fontSize={11} />
              <YAxis stroke="#6B7280" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#121824', borderColor: '#1F293D', borderRadius: '12px', color: '#fff' }} />
              <Bar dataKey="power_kw" fill="#F59E0B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
