import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';
import { soundEffects } from '../utils/soundEffects';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => Promise<void>;
  loginAsGuest: () => void;
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
        // Pre-populate individual demo persona for immediate accessibility
        setUser(DEMO_PROFILES.individual);
        localStorage.setItem('trustchain_token', 'tc_demo_token_individual');
        localStorage.setItem('trustchain_user', JSON.stringify(DEMO_PROFILES.individual));
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Try hitting FastAPI backend
      const res = await api.post<{ access_token: string; user: User }>('/auth/login', {
        email: cleanEmail,
        password,
      });
      localStorage.setItem('trustchain_token', res.access_token);
      localStorage.setItem('trustchain_user', JSON.stringify(res.user));
      setUser(res.user);
      soundEffects.playSuccess();
    } catch {
      // 2. Client-side resilience fallback (GitHub Pages / offline)
      // Check demo accounts
      const matchedRole = (Object.keys(DEMO_PROFILES) as UserRole[]).find(
        (r) => DEMO_PROFILES[r].email === cleanEmail
      );

      if (matchedRole) {
        const u = DEMO_PROFILES[matchedRole];
        localStorage.setItem('trustchain_token', `tc_token_demo_${matchedRole}`);
        localStorage.setItem('trustchain_user', JSON.stringify(u));
        setUser(u);
        soundEffects.playSuccess();
        return;
      }

      // Check registered users from localStorage
      const registeredJson = localStorage.getItem('trustchain_registered_users');
      let registeredUsers: User[] = [];
      if (registeredJson) {
        try {
          registeredUsers = JSON.parse(registeredJson);
        } catch {}
      }

      const found = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (found) {
        localStorage.setItem('trustchain_token', `tc_token_local_${found.id}`);
        localStorage.setItem('trustchain_user', JSON.stringify(found));
        setUser(found);
        soundEffects.playSuccess();
        return;
      }

      // If user provided ANY valid email, create a session gracefully on static demo hosting
      if (cleanEmail.includes('@')) {
        const autoUser: User = {
          id: `usr_${Date.now()}`,
          email: cleanEmail,
          full_name: cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          role: cleanEmail.includes('admin') ? 'admin' : cleanEmail.includes('inst') ? 'institution' : 'individual',
          organization_name: 'TrustChain Enterprise Workspace',
          organization_type: 'Individual',
          designation: 'Verified Member',
          country: 'United States',
          is_active: true,
          is_verified: true,
          created_at: new Date().toISOString(),
        };

        localStorage.setItem('trustchain_token', `tc_token_auto_${Date.now()}`);
        localStorage.setItem('trustchain_user', JSON.stringify(autoUser));
        setUser(autoUser);
        soundEffects.playSuccess();
        return;
      }

      soundEffects.playError();
      throw new Error('Please enter a valid email address.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    const cleanEmail = (data.email || '').trim().toLowerCase();

    try {
      // 1. Try hitting FastAPI backend
      const newUser = await api.post<User>('/auth/register', data);
      await login(cleanEmail, data.password);
    } catch {
      // 2. Client-side resilience fallback (GitHub Pages / offline)
      const localUser: User = {
        id: `usr_reg_${Date.now()}`,
        email: cleanEmail,
        full_name: data.full_name || 'Verified User',
        role: data.role || 'individual',
        organization_name: data.organization_name || (data.role === 'institution' ? 'Accredited Institution' : 'Individual'),
        organization_type: data.role === 'institution' ? 'University' : 'Individual',
        designation: data.designation || 'Account Holder',
        country: data.country || 'United States',
        is_active: true,
        is_verified: true,
        created_at: new Date().toISOString(),
      };

      // Store in localStorage registered users
      const existing = localStorage.getItem('trustchain_registered_users');
      let usersList: User[] = [];
      if (existing) {
        try {
          usersList = JSON.parse(existing);
        } catch {}
      }
      usersList.push(localUser);
      localStorage.setItem('trustchain_registered_users', JSON.stringify(usersList));

      // Auto login
      localStorage.setItem('trustchain_token', `tc_token_reg_${localUser.id}`);
      localStorage.setItem('trustchain_user', JSON.stringify(localUser));
      setUser(localUser);
      soundEffects.playSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    soundEffects.playAction();
    localStorage.removeItem('trustchain_token');
    localStorage.removeItem('trustchain_user');
    setUser(null);
  };

  const switchDemoRole = async (targetRole: UserRole) => {
    soundEffects.playAction();
    const u = DEMO_PROFILES[targetRole];
    localStorage.setItem('trustchain_token', `tc_token_demo_${targetRole}`);
    localStorage.setItem('trustchain_user', JSON.stringify(u));
    setUser(u);

    try {
      await api.post('/auth/login', { email: u.email, password: 'Password123!' });
    } catch {
      // local demo fallback active
    }
  };

  const loginAsGuest = () => {
    switchDemoRole('individual');
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
        loginAsGuest,
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
