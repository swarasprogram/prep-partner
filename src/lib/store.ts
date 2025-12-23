import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  company?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

interface PrepState {
  selectedRole: string | null;
  selectedCompany: string | null;
  setRole: (role: string | null) => void;
  setCompany: (company: string | null) => void;
}

export const usePrepStore = create<PrepState>((set) => ({
  selectedRole: null,
  selectedCompany: null,
  setRole: (role) => set({ selectedRole: role }),
  setCompany: (company) => set({ selectedCompany: company }),
}));
