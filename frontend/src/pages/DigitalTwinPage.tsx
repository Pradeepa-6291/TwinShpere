import React, { useEffect, useState } from 'react';
import { getBuildings, getBuildingDetail } from '../services/api';
import { Building, Incident } from '../types';
import { CampusMapSvg } from '../components/digital_twin/CampusMapSvg';
import { BuildingDrawer } from '../components/digital_twin/BuildingDrawer';
import { Map, Zap, Droplets, ShieldAlert, Users, Layers } from 'lucide-react';

export const DigitalTwinPage: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
  const [selectedBuildingData, setSelectedBuildingData] = useState<Building | null>(null);
  const [activeIncidents, setActiveIncidents] = useState<Incident[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const loadBuildings = async () => {
    try {
      const data = await getBuildings(activeFilter);
      setBuildings(data);
    } catch (e) {
      console.error('Failed to load digital twin buildings:', e);
    }
  };

  useEffect(() => {
    loadBuildings();
    const interval = setInterval(loadBuildings, 4000);
    return () => clearInterval(interval);
  }, [activeFilter]);

  const handleSelectBuilding = async (id: string) => {
    setSelectedBuildingId(id);
    try {
      const res = await getBuildingDetail(id);
      setSelectedBuildingData(res.building);
      setActiveIncidents(res.active_incidents || []);
    } catch (e) {
      console.error('Failed to load building detail:', e);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header & Layer Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Campus Digital Twin</h2>
            <p className="text-xs text-gray-400">Live Spatial Representation of Campus Assets & Telemetry</p>
          </div>
        </div>

        {/* Filter Layer Toggles */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-gray-400 font-mono flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> Filters:</span>
          {['all', 'Academic', 'Hostel', 'Facility', 'Substation', 'Transport'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                activeFilter === f
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'bg-surface-hover text-gray-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map */}
      <CampusMapSvg
        buildings={buildings}
        selectedBuildingId={selectedBuildingId}
        onSelectBuilding={handleSelectBuilding}
        activeFilter={activeFilter}
      />

      {/* Side Drawer */}
      <BuildingDrawer
        building={selectedBuildingData}
        activeIncidents={activeIncidents}
        onClose={() => {
          setSelectedBuildingId(null);
          setSelectedBuildingData(null);
        }}
      />
    </div>
  );
};
