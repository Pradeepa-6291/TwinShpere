import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bell, Wifi, Sparkles, LogOut, User, ChevronDown, X, AlertTriangle, TrendingUp, CheckSquare } from 'lucide-react';

const NOTIFS = [
  { id: 1, icon: AlertTriangle, color: 'text-twin-red', title: 'HVAC Anomaly Detected', body: 'Building B — 82% failure probability', time: '2m ago', unread: true },
  { id: 2, icon: TrendingUp, color: 'text-accent-400', title: 'Energy Spike Predicted', body: 'Substation A — 31% above baseline', time: '8m ago', unread: true },
  { id: 3, icon: CheckSquare, color: 'text-twin-yellow', title: 'Action Awaiting Approval', body: 'Emergency HVAC shutdown — HIGH risk', time: '15m ago', unread: false },
];

function useClickOutside(ref: React.RefObject<HTMLElement>, cb: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) cb(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, cb]);
}

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFS);
  const notifRef = useRef<HTMLDivElement>(null!);
  const profileRef = useRef<HTMLDivElement>(null!);
  useClickOutside(notifRef, () => setShowNotifs(false));
  useClickOutside(profileRef, () => setShowProfile(false));
  const unread = notifs.filter(n => n.unread).length;

  return (
    <header
      className="h-14 px-5 flex items-center justify-between sticky top-0 z-20 shrink-0"
      style={{ background: 'rgba(4,8,15,0.96)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(28,43,69,0.8)' }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-twin-green-dim border border-twin-green/20 text-twin-green text-xs font-medium">
          <span className="live-dot" />
          <Wifi className="w-3 h-3" />
          <span className="hidden sm:inline">Live Stream</span>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-text-muted">
          <Sparkles className="w-3 h-3 text-primary-400" />
          <span>TwinSphere AI v2.0 — Multi-Agent Intelligence Active</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifs(v => !v); setShowProfile(false); }}
            className="relative p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-twin-red" style={{ boxShadow: '0 0 6px rgba(239,68,68,0.8)' }} />
            )}
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 glass-card-glow rounded-2xl overflow-hidden z-50 animate-scale-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
                <span className="text-sm font-semibold text-text-primary">Notifications</span>
                <div className="flex items-center gap-2">
                  {unread > 0 && <span className="badge badge-red">{unread} new</span>}
                  <button onClick={() => setShowNotifs(false)} className="text-text-muted hover:text-text-primary p-0.5"><X className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="divide-y divide-surface-border/60 max-h-72 overflow-y-auto">
                {notifs.map(n => {
                  const Icon = n.icon;
                  return (
                    <div key={n.id} className={`px-4 py-3 hover:bg-surface-hover transition-colors cursor-pointer ${n.unread ? 'bg-primary-600/4' : ''}`}>
                      <div className="flex items-start gap-3">
                        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${n.color}`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-text-primary">{n.title}</div>
                          <div className="text-xs text-text-secondary mt-0.5">{n.body}</div>
                        </div>
                        <span className="text-[10px] text-text-muted shrink-0">{n.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="px-4 py-2.5 border-t border-surface-border">
                <button onClick={() => setNotifs(ns => ns.map(n => ({ ...n, unread: false })))} className="text-xs text-primary-400 hover:text-primary-300 font-medium">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setShowProfile(v => !v); setShowNotifs(false); }}
            className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-xl hover:bg-surface-hover transition-all border border-transparent hover:border-surface-border"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-600/40 to-accent-500/30 border border-primary-500/30 flex items-center justify-center text-primary-300 text-xs font-bold">
              {user?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-text-primary leading-tight">{user?.full_name}</div>
              <div className="text-[10px] text-primary-400 font-mono">{user?.role}</div>
            </div>
            <ChevronDown className="w-3 h-3 text-text-muted" />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-52 glass-card-glow rounded-2xl overflow-hidden z-50 animate-scale-in">
              <div className="px-4 py-3 border-b border-surface-border">
                <div className="text-sm font-semibold text-text-primary">{user?.full_name}</div>
                <div className="text-xs text-text-muted mt-0.5">{user?.email}</div>
                <div className="mt-2"><span className="badge badge-primary">{user?.role}</span></div>
              </div>
              <div className="p-2">
                <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all">
                  <User className="w-4 h-4" /> Profile
                </button>
                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-twin-red hover:bg-twin-red-dim transition-all"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
