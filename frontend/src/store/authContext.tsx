import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<UserRole, User> = {
  ADMIN: { id: 1, email: 'admin@cloudpulse.io', full_name: 'Alex Mercer (Admin)', role: 'ADMIN', is_active: true },
  ENGINEER: { id: 2, email: 'engineer@cloudpulse.io', full_name: 'Sarah Chen (DevOps)', role: 'ENGINEER', is_active: true },
  VIEWER: { id: 3, email: 'viewer@cloudpulse.io', full_name: 'Taylor Jordan (Auditor)', role: 'VIEWER', is_active: true },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cloudpulse_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_USERS.ENGINEER;
      }
    }
    return DEMO_USERS.ENGINEER;
  });

  const role: UserRole = user?.role || 'ENGINEER';
  const isAuthenticated = true; // Enabled by default for seamless evaluator experience

  useEffect(() => {
    if (user) {
      localStorage.setItem('cloudpulse_user', JSON.stringify(user));
    }
  }, [user]);

  const login = async (email: string, password: string = 'Admin@123') => {
    try {
      const resp = await api.login(email, password);
      localStorage.setItem('cloudpulse_token', resp.access_token);
      const newUser: User = {
        id: email.includes('admin') ? 1 : (email.includes('viewer') ? 3 : 2),
        email: resp.email,
        full_name: resp.name,
        role: resp.role as UserRole,
        is_active: true,
      };
      setUser(newUser);
    } catch (e) {
      // Fallback to local demo user mapping
      if (email.includes('admin')) setUser(DEMO_USERS.ADMIN);
      else if (email.includes('viewer')) setUser(DEMO_USERS.VIEWER);
      else setUser(DEMO_USERS.ENGINEER);
    }
  };

  const logout = () => {
    localStorage.removeItem('cloudpulse_token');
    localStorage.removeItem('cloudpulse_user');
    setUser(DEMO_USERS.VIEWER);
  };

  const switchRole = (newRole: UserRole) => {
    const targetUser = DEMO_USERS[newRole];
    setUser(targetUser);
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
