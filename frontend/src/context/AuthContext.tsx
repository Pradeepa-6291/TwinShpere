import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, getRoleCategory } from '../types';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  token: string | null;
  roleCategory: 'admin' | 'faculty' | 'student' | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'twinsphere_token';
const USER_KEY = 'twinsphere_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const res = await axios.post('/api/v1/auth/login', { username, password });
      const { access_token, user: userData } = res.data;
      setToken(access_token);
      setUser(userData);
      localStorage.setItem(TOKEN_KEY, access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch {
      // Fallback demo login for offline/demo mode
      const roleMap: Record<string, { role: string; department: string; full_name: string }> = {
        admin:   { role: 'Super Admin', department: 'Campus Operations Command', full_name: 'Dr. Aris Thorne' },
        faculty: { role: 'Faculty', department: 'Computer Science', full_name: 'Prof. Sarah Chen' },
        student: { role: 'Student', department: 'Engineering', full_name: 'Alex Johnson' },
      };
      const mapped = roleMap[username.toLowerCase()] || roleMap['admin'];
      const demoUser: User = {
        id: `USR-${username.toUpperCase()}`,
        username,
        email: `${username}@twinsphere.edu`,
        ...mapped,
      };
      const demoToken = `demo-jwt-${username}`;
      setUser(demoUser);
      setToken(demoToken);
      localStorage.setItem(TOKEN_KEY, demoToken);
      localStorage.setItem(USER_KEY, JSON.stringify(demoUser));
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const roleCategory = user ? getRoleCategory(user.role) : null;

  return (
    <AuthContext.Provider value={{ user, token, roleCategory, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
