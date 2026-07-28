import React, { useEffect, useState } from 'react';
import { getSwarmStatus, getAgentRuns } from '../services/api';
import { Cpu, CheckCircle2, Zap } from 'lucide-react';
import { AgentSwarmVisualizer } from '../components/agent_swarm/AgentSwarmVisualizer';
import { useDemo } from '../context/DemoContext';

export const AgentSwarmPage: React.FC = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const { liveAgentSteps } = useDemo();

  useEffect(() => {
    getSwarmStatus().then((res) => setAgents(res.agents || []));
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between glass-panel p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-500/40 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Multi-Agent Swarm Ecosystem</h2>
            <p className="text-xs text-gray-400">16 Autonomous Agents Coordinated via Orchestrator State Engine</p>
          </div>
        </div>
      </div>

      {/* Agents Grid (16 Specialized Agents) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((ag, idx) => (
          <div key={idx} className="glass-panel p-4 rounded-xl space-y-2 border-l-2 border-primary-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white truncate">{ag.name}</span>
              <span className="w-2 h-2 rounded-full bg-twin-green animate-pulse" />
            </div>
            <p className="text-[11px] text-cyan-400 font-mono">{ag.role}</p>
            <p className="text-xs text-gray-400 line-clamp-2">{ag.description}</p>
          </div>
        ))}
      </div>

      {/* Live Swarm Visualizer */}
      <AgentSwarmVisualizer steps={liveAgentSteps} isSwarmRunning={liveAgentSteps.length > 0} />
    </div>
  );
};
