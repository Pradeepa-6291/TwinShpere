import React, { useEffect, useState } from 'react';
import { getIncidents, updateIncidentStatus, triggerIncidentWorkflow, getRootCauseTree } from '../services/api';
import { Incident } from '../types';
import { AlertTriangle, Cpu, GitBranch, Plus, Filter, CheckCircle2, Clock } from 'lucide-react';
import { RootCauseTree } from '../components/root_cause/RootCauseTree';

export const IncidentsPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [rootCauseData, setRootCauseData] = useState<any>(null);
  const [showRootCauseModal, setShowRootCauseModal] = useState(false);

  const loadIncidents = async () => {
    try {
      const data = await getIncidents();
      setIncidents(data);
    } catch (e) {
      console.error('Failed to load incidents:', e);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleTriggerSwarm = async (id: string) => {
    try {
      await triggerIncidentWorkflow(id);
      alert('Triggered 16-Agent Swarm for incident execution!');
      loadIncidents();
    } catch (e) {
      console.error(e);
    }
  };

  const handleShowRootCause = async (id: string) => {
    try {
      const tree = await getRootCauseTree(id);
      setRootCauseData(tree);
      setShowRootCauseModal(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateIncidentStatus(id, newStatus);
      loadIncidents();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between glass-panel p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-twin-red/20 border border-twin-red/40 flex items-center justify-center text-twin-red">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Incident Operations Center</h2>
            <p className="text-xs text-gray-400">Complete Lifecycle Management & Multi-Agent Resolution</p>
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="glass-panel p-6 rounded-2xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-border text-xs text-gray-400 uppercase font-mono">
              <th className="py-3 px-4">Incident ID</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Assigned Dept</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border text-xs">
            {incidents.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  No active incidents recorded in system.
                </td>
              </tr>
            ) : (
              incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-surface-hover/60 transition">
                  <td className="py-4 px-4 font-mono text-cyan-400 font-semibold">{inc.id}</td>
                  <td className="py-4 px-4 font-bold text-white max-w-xs truncate">{inc.title}</td>
                  <td className="py-4 px-4 text-gray-300">{inc.location_name}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                      inc.severity === 'Critical' ? 'bg-twin-red/20 text-twin-red' : 'bg-twin-yellow/20 text-twin-yellow'
                    }`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono font-semibold text-twin-yellow">
                    {inc.status}
                  </td>
                  <td className="py-4 px-4 text-gray-400">{inc.assigned_department}</td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleShowRootCause(inc.id)}
                      className="px-2.5 py-1 rounded bg-surface-hover border border-surface-border hover:border-cyan-400 text-cyan-400 font-semibold text-[11px]"
                    >
                      Root Cause
                    </button>
                    <button
                      onClick={() => handleTriggerSwarm(inc.id)}
                      className="px-2.5 py-1 rounded bg-primary-600/30 hover:bg-primary-600 text-white font-semibold text-[11px]"
                    >
                      Run Swarm
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Root Cause Tree Modal */}
      {showRootCauseModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <RootCauseTree rootCauseData={rootCauseData} />
            <button
              onClick={() => setShowRootCauseModal(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-surface-hover text-gray-300 font-bold text-xs"
            >
              Close Root Cause Tree
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
