import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user profiles matching backend defaults
const DEMO_PROFILES: Record<UserRole, User> = {
  individual: {
    id: 'usr_indiv_01',
    email: 'individual@trustchain.ai',
    full_name: 'Alex Mercer',
    role: 'individual',
    organization_name: 'Stanford Alumni',
    organization_type: 'Individual',
    designation: 'Graduate Engineer',
    country: 'United States',
    is_active: true,
    is_verified: true,
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  institution: {
    id: 'usr_inst_01',
    email: 'institution@trustchain.ai',
    full_name: 'Dr. Eleanor Vance',
    role: 'institution',
    organization_name: 'MIT Registrar & Credentialing Office',
    organization_type: 'University',
    designation: 'Chief Registrar',
    country: 'United States',
    is_active: true,
    is_verified: true,
    created_at: new Date(Date.now() - 120 * 86400000).toISOString(),
  },
  verifier: {
    id: 'usr_verif_01',
    email: 'verifier@trustchain.ai',
    full_name: 'Marcus Chen',
    role: 'verifier',
    organization_name: 'Apex Global Talent & Recruiting',
    organization_type: 'Corporate HR',
    designation: 'Head of Technical Recruiting',
    country: 'Singapore',
    is_active: true,
    is_verified: true,
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
  admin: {
    id: 'usr_admin_01',
    email: 'admin@trustchain.ai',
    full_name: 'Sarah Connor',
    role: 'admin',
    organization_name: 'TrustChain Platform Operations',
    organization_type: 'RegTech Provider',
    designation: 'Platform Administrator',
    country: 'Switzerland',
    is_active: true,
    is_verified: true,
    created_at: new Date(Date.now() - 180 * 86400000).toISOString(),
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('trustchain_token');
      const savedUser = localStorage.getItem('trustchain_user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(DEMO_PROFILES.individual);
        }
      } else {
        // In default demo mode, pre-populate individual user so app is immediately exploreable
        setUser(DEMO_PROFILES.individual);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post<{ access_token: string; user: User }>('/auth/login', {
        email,
        password,
      });
      localStorage.setItem('trustchain_token', res.access_token);
      localStorage.setItem('trustchain_user', JSON.stringify(res.user));
      setUser(res.user);
    } catch (err: any) {
      // In demo mode, fallback matching by email if backend is not yet started
      const matchedRole = (Object.keys(DEMO_PROFILES) as UserRole[]).find(
        (r) => DEMO_PROFILES[r].email === email.toLowerCase()
      );
      if (matchedRole) {
        const u = DEMO_PROFILES[matchedRole];
        localStorage.setItem('trustchain_user', JSON.stringify(u));
        setUser(u);
      } else {
        throw err;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const newUser = await api.post<User>('/auth/register', data);
      await login(data.email, data.password);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('trustchain_token');
    localStorage.removeItem('trustchain_user');
    setUser(null);
  };

  const switchDemoRole = async (targetRole: UserRole) => {
    const u = DEMO_PROFILES[targetRole];
    localStorage.setItem('trustchain_user', JSON.stringify(u));
    setUser(u);
    try {
      // Also request token from backend to keep sync
      await login(u.email, 'Password123!');
    } catch {
      // Local fallback active
    }
  };

  const role = user?.role || 'individual';
  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
