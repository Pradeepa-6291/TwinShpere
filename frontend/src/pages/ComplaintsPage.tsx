import React, { useEffect, useState } from 'react';
import { getComplaints, submitComplaint, getBuildings } from '../services/api';
import { Complaint, Building } from '../types';
import { MessageSquare, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

export const ComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [category, setCategory] = useState('Water');
  const [bldgId, setBldgId] = useState('BLDG-03');
  const [description, setDescription] = useState('');

  const loadData = async () => {
    try {
      const c = await getComplaints();
      const b = await getBuildings();
      setComplaints(c);
      setBuildings(b);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;
    try {
      await submitComplaint({
        student_name: 'Alex Chen (Student)',
        category,
        location_building_id: bldgId,
        description
      });
      setDescription('');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between glass-panel p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Student Complaint Intelligence</h2>
            <p className="text-xs text-gray-400">NLP Clustering Engine & Auto-Grouping into Infrastructure Incidents</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit Complaint Form */}
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-base text-white">Submit Campus Issue</h3>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-hover border border-surface-border text-xs text-white"
            >
              <option value="Water">Water Supply & Plumbing</option>
              <option value="Energy">Energy & Power Grid</option>
              <option value="HVAC">HVAC & Air Conditioning</option>
              <option value="Transport">Bus & Shuttle Transit</option>
              <option value="Security">Security & Access</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Building Location</label>
            <select
              value={bldgId}
              onChange={(e) => setBldgId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface-hover border border-surface-border text-xs text-white"
            >
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Issue Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe the complaint..."
              className="w-full px-3 py-2 rounded-xl bg-surface-hover border border-surface-border text-xs text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
          >
            Submit Complaint
          </button>
        </form>

        {/* Active Complaints List */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-base text-white">Submitted Student Complaints</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {complaints.map((c) => (
              <div key={c.id} className="p-4 rounded-xl bg-surface-hover border border-surface-border space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{c.student_name}</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono text-[10px]">{c.status}</span>
                </div>
                <p className="text-xs text-gray-300">{c.description}</p>
                <div className="text-[11px] text-gray-400 font-mono flex items-center justify-between pt-1">
                  <span>{c.location_name}</span>
                  <span>{new Date(c.created_at).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
