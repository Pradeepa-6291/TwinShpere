import React, { useEffect, useState } from 'react';
import { getAnalyticsMetrics } from '../services/api';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getAnalyticsMetrics().then(setData);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between glass-panel p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Administration & Analytics Reports</h2>
            <p className="text-xs text-gray-400">Incident Resolution Time (MTTR), Department SLA, & Agent Performance</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-base text-white">Monthly Resolved Incidents</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.monthly_incident_trends || []}>
                <XAxis dataKey="month" stroke="#6B7280" fontSize={11} />
                <YAxis stroke="#6B7280" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#121824', borderColor: '#1F293D', borderRadius: '12px', color: '#fff' }} />
                <Line type="monotone" dataKey="resolved" stroke="#6366f1" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department SLA */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-base text-white">Department Resolution Speed (Avg Hours)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.department_resolution_times || []}>
                <XAxis dataKey="dept" stroke="#6B7280" fontSize={10} />
                <YAxis stroke="#6B7280" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#121824', borderColor: '#1F293D', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="avg_hours" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
