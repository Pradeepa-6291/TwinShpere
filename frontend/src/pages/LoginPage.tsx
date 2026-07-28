import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Activity, Lock, User as UserIcon, Eye, EyeOff, ArrowRight, Cpu, Zap, Shield, TrendingUp } from 'lucide-react';

const NODES = [
  { x: 50, y: 18, r: 7, color: '#6366F1', label: 'Orchestrator' },
  { x: 22, y: 42, r: 5, color: '#06B6D4', label: 'Energy' },
  { x: 78, y: 42, r: 5, color: '#8B5CF6', label: 'Security' },
  { x: 35, y: 68, r: 5, color: '#10B981', label: 'Facility' },
  { x: 65, y: 68, r: 5, color: '#F59E0B', label: 'Transport' },
  { x: 50, y: 84, r: 6, color: '#EF4444', label: 'Decision' },
];
const EDGES = [[0,1],[0,2],[0,3],[0,4],[1,3],[2,4],[3,5],[4,5]];

const DEMO_ROLES = [
  { username: 'admin', label: 'Admin', desc: 'Full command center' },
  { username: 'faculty', label: 'Faculty', desc: 'Faculty portal' },
  { username: 'student', label: 'Student', desc: 'Student portal' },
];

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) { setError('Please enter your credentials.'); return; }
    setLoading(true); setError('');
    try {
      await login(username, password);
      const r = username.toLowerCase();
      if (r === 'student') navigate('/student');
      else if (r === 'faculty') navigate('/faculty');
      else navigate('/');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel — visual */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-primary-600/6 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full bg-accent-500/5 blur-3xl" />

        {/* SVG agent network */}
        <div className="relative w-72 h-72 animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(99,102,241,0.06)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#bgGrad)" />
            {EDGES.map(([a, b], i) => (
              <line key={i}
                x1={`${NODES[a].x}%`} y1={`${NODES[a].y}%`}
                x2={`${NODES[b].x}%`} y2={`${NODES[b].y}%`}
                stroke="rgba(99,102,241,0.18)" strokeWidth="0.6" strokeDasharray="3 2"
              />
            ))}
            {NODES.map((n, i) => (
              <g key={i}>
                <circle cx={`${n.x}%`} cy={`${n.y}%`} r={n.r + 3} fill={`${n.color}18`} />
                <circle cx={`${n.x}%`} cy={`${n.y}%`} r={n.r} fill={`${n.color}22`} stroke={n.color} strokeWidth="0.6" />
                <circle cx={`${n.x}%`} cy={`${n.y}%`} r={n.r / 2.5} fill={n.color} />
              </g>
            ))}
          </svg>
        </div>

        <div className="text-center mt-6 space-y-3 relative z-10 max-w-xs">
          <h2 className="text-xl font-bold text-text-primary">Autonomous Campus Intelligence</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            16 specialized AI agents continuously monitor, predict, and coordinate campus operations in real time.
          </p>
          <div className="flex items-center justify-center gap-6 pt-3">
            {[
              { icon: Cpu, label: '16 Agents', color: 'text-primary-400' },
              { icon: TrendingUp, label: 'Predictive', color: 'text-accent-400' },
              { icon: Shield, label: 'Secure', color: 'text-twin-green' },
              { icon: Zap, label: 'Real-time', color: 'text-twin-yellow' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-lg bg-surface-2 border border-surface-border flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <span className="text-[10px] text-text-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div
        className="flex-1 lg:max-w-[420px] flex items-center justify-center p-6"
        style={{ background: 'rgba(7,13,26,0.7)', borderLeft: '1px solid rgba(28,43,69,0.7)' }}
      >
        <div className="w-full max-w-sm space-y-6">
          {/* Logo */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow-sm">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-text-primary">TwinSphere AI</div>
                <div className="text-[10px] text-text-muted font-mono">Campus Digital Twin Platform</div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
            <p className="text-sm text-text-secondary mt-1">Sign in to your intelligent campus operations platform.</p>
          </div>

          {/* Demo role selector */}
          <div>
            <div className="text-xs text-text-muted mb-2">Quick demo access:</div>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ROLES.map(r => (
                <button
                  key={r.username}
                  onClick={() => setUsername(r.username)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    username === r.username
                      ? 'border-primary-500/40 bg-primary-600/12 text-primary-300'
                      : 'border-surface-border text-text-muted hover:border-surface-hover hover:bg-surface-hover'
                  }`}
                >
                  <div className="text-xs font-semibold">{r.label}</div>
                  <div className="text-[10px] opacity-70 mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="px-4 py-3 rounded-xl bg-twin-red-dim border border-twin-red/20 text-twin-red text-xs">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary" htmlFor="username">Username</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)}
                  className="input pl-10" placeholder="Enter username" autoComplete="username" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-text-secondary" htmlFor="password">Password</label>
                <button type="button" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input id="password" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  className="input pl-10 pr-10" placeholder="Enter password" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                  aria-label="Toggle password visibility">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">Sign In <ArrowRight className="w-4 h-4" /></span>
              )}
            </button>
          </form>

          <p className="text-xs text-center text-text-muted">
            Don't have an account?{' '}
            <button className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Request access</button>
          </p>
        </div>
      </div>
    </div>
  );
};
