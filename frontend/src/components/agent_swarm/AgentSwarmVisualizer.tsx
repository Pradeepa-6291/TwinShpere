import React from 'react';
import { Cpu, CheckCircle2, Clock, AlertCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { AgentStep } from '../../types';

interface Props {
  steps: AgentStep[];
  isSwarmRunning?: boolean;
}

export const AgentSwarmVisualizer: React.FC<Props> = ({ steps, isSwarmRunning }) => {
  return (
    <div className="glass-panel-glow p-6 rounded-2xl border border-primary-500/30">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-600/30 border border-primary-500/50 flex items-center justify-center text-cyan-400">
            <Cpu className={`w-5 h-5 ${isSwarmRunning ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
              <span>Multi-Agent Swarm Orchestrator</span>
              {isSwarmRunning && (
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono font-normal animate-pulse">
                  EXECUTING DAG WORKFLOW
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-400">16 Specialized AI Agents Coordinated via Graph State Machine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-mono">
            {steps.length} Steps Executed
          </span>
        </div>
      </div>

      {/* Live Agent Activity Step Feed */}
      {steps.length === 0 ? (
        <div className="py-12 text-center text-gray-500 space-y-2">
          <Cpu className="w-8 h-8 mx-auto opacity-40 animate-pulse" />
          <p className="text-sm font-medium">No active agent runs in progress.</p>
          <p className="text-xs text-gray-600">Select a Demo Scenario or trigger an incident to launch the 16-Agent Swarm.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="glass-panel p-4 rounded-xl border-l-4 border-cyan-500 flex items-start gap-4 transition-all duration-300 hover:border-primary-500"
            >
              <div className="w-8 h-8 rounded-lg bg-surface-hover border border-surface-border flex items-center justify-center text-cyan-400 font-mono font-bold text-xs shrink-0">
                {idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white tracking-wide">{step.agent_name}</span>
                    <span className="px-2 py-0.5 rounded-md bg-surface-hover text-cyan-400 text-[11px] font-mono border border-surface-border">
                      {step.action_type}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">{step.timestamp}</span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed font-sans">{step.message}</p>
              </div>

              <div className="shrink-0 flex items-center gap-1.5 text-twin-green text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
