import React from 'react';
import { Approval } from '../../types';
import { CheckSquare, XCircle, CheckCircle, ShieldAlert, Cpu } from 'lucide-react';
import { approveAction, rejectAction } from '../../services/api';

interface Props {
  approvals: Approval[];
  onActionComplete: () => void;
}

export const ApprovalQueueCard: React.FC<Props> = ({ approvals, onActionComplete }) => {
  const handleApprove = async (id: string) => {
    try {
      await approveAction(id, 'Dr. Aris Thorne (Super Admin)');
      onActionComplete();
    } catch (e) {
      console.error('Approve failed:', e);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectAction(id, 'Dr. Aris Thorne (Super Admin)');
      onActionComplete();
    } catch (e) {
      console.error('Reject failed:', e);
    }
  };

  const pending = approvals.filter((a) => a.status === 'PENDING');

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-twin-yellow/20 border border-twin-yellow/40 flex items-center justify-center text-twin-yellow">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white">Human-in-the-Loop Approval Queue</h3>
            <p className="text-xs text-gray-400">High-Risk Autonomous Actions Awaiting Administrator Sign-Off</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-twin-yellow/20 text-twin-yellow font-mono text-xs font-bold border border-twin-yellow/30">
          {pending.length} Pending Approvals
        </span>
      </div>

      {/* Approvals list */}
      {pending.length === 0 ? (
        <div className="py-8 text-center text-gray-400 text-xs font-medium">
          No pending action approvals in queue. All autonomous actions evaluated as LOW RISK have executed automatically.
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((app) => (
            <div key={app.id} className="glass-panel p-5 rounded-xl border-l-4 border-twin-yellow space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-twin-red/20 text-twin-red font-mono text-[10px] font-extrabold uppercase border border-twin-red/30">
                    {app.risk_level} RISK ACTION
                  </span>
                  <span className="text-xs text-gray-400 font-mono">Proposed by {app.proposed_by_agent}</span>
                </div>
                <span className="text-xs text-gray-500 font-mono">{app.id}</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-1">{app.action_title}</h4>
                <p className="text-xs text-gray-300">{app.action_description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-surface-hover p-3 rounded-lg font-mono">
                <div>
                  <span className="text-gray-400 block text-[10px]">Target Resources:</span>
                  <span className="text-cyan-400 font-semibold">{app.target_resources.join(', ')}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Estimated Impact:</span>
                  <span className="text-white font-semibold">{app.estimated_impact}</span>
                </div>
              </div>

              {/* One-click Approval Controls */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleApprove(app.id)}
                  className="flex-1 py-2 px-4 rounded-xl bg-twin-green hover:bg-emerald-600 text-white text-xs font-extrabold flex items-center justify-center gap-2 transition shadow-lg shadow-twin-green/20"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve & Dispatch Action</span>
                </button>
                <button
                  onClick={() => handleReject(app.id)}
                  className="py-2 px-4 rounded-xl bg-surface-hover hover:bg-twin-red/30 border border-surface-border text-gray-300 hover:text-twin-red text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
