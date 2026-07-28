import React from 'react';
import { GitBranch, AlertCircle, CheckCircle, ShieldAlert, Cpu } from 'lucide-react';

interface Props {
  rootCauseData?: any;
}

export const RootCauseTree: React.FC<Props> = ({ rootCauseData }) => {
  const tree = rootCauseData?.root_cause_tree || {
    name: "Telemetry Anomaly: High Power Spike & Zero Flow",
    category: "Symptom",
    children: [
      {
        name: "Power Spike +34.5% at Water Treatment Plant",
        category: "Telemetry Anomaly",
        confidence: 0.96,
        children: [
          {
            name: "HVAC Chiller / Pump Motor Cavitation",
            category: "Mechanical Fault",
            confidence: 0.92,
            children: [
              {
                name: "Auxiliary Water Pump #2 Bearing Seizure",
                category: "Root Cause",
                confidence: 0.94,
                evidence: "Power consumption spiked to 48.2 kW followed by 0 LPM outlet pressure telemetry.",
                children: [
                  {
                    name: "Maintenance Flush Overdue by 14 Days",
                    category: "Contributory Factor",
                    confidence: 0.88
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  const renderNode = (node: any, level: number = 0) => (
    <div key={node.name} className="space-y-3 relative pl-6 border-l-2 border-primary-500/40 my-2">
      <div className="glass-panel p-4 rounded-xl border border-surface-border flex items-start justify-between gap-4 hover:border-cyan-500 transition">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
              node.category === 'Root Cause'
                ? 'bg-twin-red/20 text-twin-red border border-twin-red/30'
                : node.category === 'Symptom'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-cyan-500/20 text-cyan-400'
            }`}>
              {node.category}
            </span>
            {node.confidence && (
              <span className="text-xs font-mono text-gray-400">
                Confidence: <strong className="text-white">{(node.confidence * 100).toFixed(0)}%</strong>
              </span>
            )}
          </div>

          <h4 className="text-sm font-bold text-white">{node.name}</h4>
          {node.evidence && (
            <p className="text-xs text-gray-400 mt-1 italic">Evidence: {node.evidence}</p>
          )}
        </div>

        {node.category === 'Root Cause' && (
          <ShieldAlert className="w-6 h-6 text-twin-red shrink-0 animate-pulse" />
        )}
      </div>

      {node.children && node.children.map((child: any) => renderNode(child, level + 1))}
    </div>
  );

  return (
    <div className="glass-panel p-6 rounded-2xl">
      <div className="flex items-center gap-3 border-b border-surface-border pb-4 mb-6">
        <GitBranch className="w-5 h-5 text-cyan-400" />
        <div>
          <h3 className="font-extrabold text-base text-white">Diagnostic Root Cause Tree</h3>
          <p className="text-xs text-gray-400">AI Isolated Cause & Contributory Maintenance Factors</p>
        </div>
      </div>

      {renderNode(tree)}
    </div>
  );
};
