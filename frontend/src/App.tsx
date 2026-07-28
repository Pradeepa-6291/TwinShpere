import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DemoProvider } from './context/DemoContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DemoScenarioBar } from './components/layout/DemoScenarioBar';

import { CommandCenter } from './pages/CommandCenter';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { AgentSwarmPage } from './pages/AgentSwarmPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { SimulationsPage } from './pages/SimulationsPage';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { EnergyPage } from './pages/EnergyPage';
import { TransportPage } from './pages/TransportPage';
import { OccupancyPage } from './pages/OccupancyPage';
import { SecurityPage } from './pages/SecurityPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { MemoryPage } from './pages/MemoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-background text-gray-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <DemoScenarioBar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <DemoProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Layout><CommandCenter /></Layout>} />
            <Route path="/digital-twin" element={<Layout><DigitalTwinPage /></Layout>} />
            <Route path="/incidents" element={<Layout><IncidentsPage /></Layout>} />
            <Route path="/predictions" element={<Layout><PredictionsPage /></Layout>} />
            <Route path="/agent-swarm" element={<Layout><AgentSwarmPage /></Layout>} />
            <Route path="/simulations" element={<Layout><SimulationsPage /></Layout>} />
            <Route path="/approvals" element={<Layout><ApprovalsPage /></Layout>} />
            <Route path="/energy" element={<Layout><EnergyPage /></Layout>} />
            <Route path="/transport" element={<Layout><TransportPage /></Layout>} />
            <Route path="/occupancy" element={<Layout><OccupancyPage /></Layout>} />
            <Route path="/security" element={<Layout><SecurityPage /></Layout>} />
            <Route path="/complaints" element={<Layout><ComplaintsPage /></Layout>} />
            <Route path="/memory" element={<Layout><MemoryPage /></Layout>} />
            <Route path="/analytics" element={<Layout><AnalyticsPage /></Layout>} />
            <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </DemoProvider>
    </AuthProvider>
  );
};
