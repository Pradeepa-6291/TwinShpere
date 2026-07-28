import React from 'react';
import { Users, AlertTriangle } from 'lucide-react';

export const OccupancyPage: React.FC = () => {
  const rooms = [
    { name: 'Lecture Hall 101', capacity: 120, occupancy: 114, status: 'NORMAL' },
    { name: 'Computer Science Lab 3', capacity: 40, occupancy: 42, status: 'OVERCAPACITY' },
    { name: 'Quantum Physics Lab', capacity: 25, occupancy: 12, status: 'OPTIMAL' },
    { name: 'Grand Auditorium Gate 2', capacity: 1200, occupancy: 1150, status: 'HIGH_DENSITY' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between glass-panel p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Occupancy & Crowd Density Grid</h2>
            <p className="text-xs text-gray-400">Real-Time Classroom, Laboratory, & Event Crowd Telemetry</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map((r, i) => (
          <div key={i} className="glass-panel p-5 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">{r.name}</h3>
              <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                r.status === 'OVERCAPACITY' ? 'bg-twin-red/20 text-twin-red' : 'bg-twin-green/20 text-twin-green'
              }`}>
                {r.status}
              </span>
            </div>

            <div className="flex items-baseline justify-between font-mono">
              <span className="text-xs text-gray-400">Headcount:</span>
              <span className="text-xl font-extrabold text-white">{r.occupancy} / {r.capacity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
