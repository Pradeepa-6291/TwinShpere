import React, { useEffect, useState } from 'react';
import { getCommandCenterSummary, getIncidents } from '../services/api';
import { CommandSummary, Incident } from '../types';
import { Activity, AlertTriangle, TrendingUp, Cpu, CheckSquare, Zap, Droplets, Users, ShieldAlert, Bus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AgentSwarmVisualizer } from '../components/agent_swarm/AgentSwarmVisualizer';
import { useDemo } from '../context/DemoContext';

export const CommandCenter: React.FC = () => {
  const [summary, setSummary] = useState<CommandSummary | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const { liveAgentSteps, lastEvent } = useDemo();

  const loadData = async () => {
    try {
      const s = await getCommandCenterSummary();
      const inc = await getIncidents();
      setSummary(s);
      setIncidents(inc);
    } catch (e) {
      console.error('Failed to load command center data:', e);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (lastEvent) loadData();
  }, [lastEvent]);

  // Telemetry chart mock history
  const chartData = [
    { time: '10:00', power: 310, water: 110, occupancy: 1200 },
    { time: '10:15', power: 340, water: 115, occupancy: 1450 },
    { time: '10:30', power: 385, water: 95, occupancy: 1800 },
    { time: '10:45', power: 420, water: 45, occupancy: 2100 },
    { time: '11:00', power: 410, water: 120, occupancy: 2240 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner & Health Score */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Overall Campus Health Score Widget */}
        <div className="glass-panel-glow p-6 rounded-2xl border border-primary-500/40 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Campus Health Score</span>
            <Activity className="w-5 h-5 text-twin-green animate-pulse" />
          </div>

          <div className="my-4 flex items-baseline gap-3">
            <span className="text-5xl font-extrabold text-white font-mono tracking-tight">
              {summary?.campus_health_score || 94.5}%
            </span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono border ${
              summary?.health_status === 'CRITICAL'
                ? 'bg-twin-red/20 text-twin-red border-twin-red/30'
                : 'bg-twin-green/20 text-twin-green border-twin-green/30'
            }`}>
              {summary?.health_status || 'OPTIMAL'}
            </span>
          </div>

          <div className="w-full bg-surface-border rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-twin-green via-cyan-400 to-twin-purple h-full transition-all duration-500"
              style={{ width: `${summary?.campus_health_score || 94.5}%` }}
            />
          </div>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-medium">Active Incidents</div>
            <div className="text-3xl font-extrabold text-white font-mono mt-1">
              {summary?.active_incidents_count || 0}
            </div>
            <div className="text-[11px] text-twin-orange font-semibold mt-1">
              {summary?.critical_alerts_count || 0} Critical Emergency
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-twin-red/10 border border-twin-red/20 flex items-center justify-center text-twin-red">
            <AlertTriangle className="w-6 h-6 animate-bounce" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-medium">Predicted AI Risks</div>
            <div className="text-3xl font-extrabold text-white font-mono mt-1">
              {summary?.predicted_incidents_count || 2}
            </div>
            <div className="text-[11px] text-cyan-400 font-semibold mt-1">
              92% Avg Confidence
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-medium">Pending Approvals</div>
            <div className="text-3xl font-extrabold text-white font-mono mt-1">
              {summary?.pending_approvals_count || 0}
            </div>
            <div className="text-[11px] text-twin-yellow font-semibold mt-1">
              Human Sign-Off Required
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-twin-yellow/10 border border-twin-yellow/20 flex items-center justify-center text-twin-yellow">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Telemetry Trends & Agent Swarm */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Telemetry Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <div>
              <h3 className="font-extrabold text-base text-white">Live Campus Infrastructure Load</h3>
              <p className="text-xs text-gray-400">Real-Time Power (kW), Water Flow (LPM), & Occupancy Trends</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1 text-amber-400"><Zap className="w-3.5 h-3.5" /> Power: {summary?.total_power_kw || 364} kW</span>
              <span className="flex items-center gap-1 text-cyan-400"><Droplets className="w-3.5 h-3.5" /> Water: {summary?.total_water_lpm || 215} LPM</span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#6B7280" fontSize={11} />
                <YAxis stroke="#6B7280" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#121824', borderColor: '#1F293D', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="power" stroke="#F59E0B" fillOpacity={1} fill="url(#colorPower)" strokeWidth={2} />
                <Area type="monotone" dataKey="water" stroke="#06b6d4" fillOpacity={1} fill="url(#colorWater)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Active Incidents List */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <h3 className="font-extrabold text-base text-white">Active Incidents</h3>
            <span className="px-2 py-0.5 rounded bg-surface-hover text-xs font-mono text-gray-400">{incidents.length} Active</span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-64">
            {incidents.length === 0 ? (
              <div className="text-center text-xs text-gray-500 py-8">No active incidents. System operational.</div>
            ) : (
              incidents.slice(0, 4).map((inc) => (
                <div key={inc.id} className="p-3 rounded-xl bg-surface-hover border border-surface-border space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white truncate">{inc.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                      inc.severity === 'Critical' ? 'bg-twin-red/20 text-twin-red' : 'bg-twin-yellow/20 text-twin-yellow'
                    }`}>
                      {inc.severity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                    <span>{inc.location_name}</span>
                    <span className="text-cyan-400">{inc.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Multi-Agent Swarm Visualizer */}
      <AgentSwarmVisualizer steps={liveAgentSteps} isSwarmRunning={liveAgentSteps.length > 0} />
    </div>
  );
};
