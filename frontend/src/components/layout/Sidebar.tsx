import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Map, AlertTriangle, Cpu, TrendingUp, FlaskConical,
  CheckSquare, Zap, Bus, Users, ShieldAlert, MessageSquare, Database,
  BarChart3, Settings, Activity, ChevronLeft, ChevronRight, LogOut,
} from 'lucide-react';

const navGroups = [
  {
    label: 'Operations',
    items: [
      { name: 'Command Center', path: '/', icon: LayoutDashboard },
      { name: 'Digital Twin', path: '/digital-twin', icon: Map },
      { name: 'Live Incidents', path: '/incidents', icon: AlertTriangle },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { name: 'AI Predictions', path: '/predictions', icon: TrendingUp },
      { name: 'Agent Swarm', path: '/agent-swarm', icon: Cpu },
      { name: 'Simulations', path: '/simulations', icon: FlaskConical },
      { name: 'Approvals', path: '/approvals', icon: CheckSquare },
    ],
  },
  {
    label: 'Infrastructure',
    items: [
      { name: 'Energy', path: '/energy', icon: Zap },
      { name: 'Transport', path: '/transport', icon: Bus },
      { name: 'Occupancy', path: '/occupancy', icon: Users },
      { name: 'Security', path: '/security', icon: ShieldAlert },
    ],
  },
  {
    label: 'Platform',
    items: [
      { name: 'Complaints', path: '/complaints', icon: MessageSquare },
      { name: 'Memory', path: '/memory', icon: Database },
      { name: 'Analytics', path: '/analytics', icon: BarChart3 },
      { name: 'Settings', path: '/settings', icon: Settings },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside
      className={`${collapsed ? 'w-[60px]' : 'w-[220px]'} flex flex-col h-screen sticky top-0 z-30 transition-all duration-300 select-none shrink-0`}
      style={{ background: 'rgba(4,8,15,0.98)', borderRight: '1px solid rgba(28,43,69,0.8)' }}
    >
      {/* Brand */}
      <div className={`flex items-center ${collapsed ? 'justify-center px-3' : 'gap-2.5 px-4'} py-4 border-b border-surface-border`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0 shadow-glow-sm">
          <Activity className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-text-primary tracking-tight leading-tight">TwinSphere AI</div>
            <div className="text-[10px] text-text-muted font-mono">Campus Digital Twin</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all shrink-0"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <div className="px-3 mb-1 text-[10px] font-semibold text-text-muted uppercase tracking-widest">
                {group.label}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    title={collapsed ? item.name : undefined}
                    className={({ isActive }) =>
                      `flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 px-3'} py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-primary-600/12 text-primary-300 border border-primary-500/18'
                          : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-surface-border p-2 space-y-1">
        {!collapsed && (
          <div className="px-3 py-2 rounded-xl bg-twin-green-dim border border-twin-green/15 flex items-center gap-2 mb-1">
            <span className="live-dot shrink-0" />
            <span className="text-[11px] text-twin-green font-semibold">16 Agents Active</span>
          </div>
        )}
        <div
          className={`flex items-center ${collapsed ? 'justify-center px-2' : 'gap-2.5 px-3'} py-2 rounded-xl hover:bg-surface-hover transition-all cursor-pointer group`}
          onClick={() => { logout(); navigate('/login'); }}
          title="Sign out"
        >
          <div className="w-7 h-7 rounded-lg bg-primary-600/25 border border-primary-500/25 flex items-center justify-center text-primary-300 text-xs font-bold shrink-0">
            {user?.full_name?.charAt(0) || 'A'}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-text-primary truncate">{user?.full_name}</div>
                <div className="text-[10px] text-text-muted truncate">{user?.role}</div>
              </div>
              <LogOut className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-all shrink-0" />
            </>
          )}
        </div>
      </div>
    </aside>
  );
};
