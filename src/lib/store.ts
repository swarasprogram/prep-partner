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

type PaymentMethod = 'upi' | 'card' | 'wallet';

interface WalletState {
  balance: number;
  cashback: number;
}

interface PaymentState {
  selectedPlan: string | null;
  amount: number;
  selectedMethod: PaymentMethod | null;
  wallet: WalletState;
  setPlan: (plan: string | null, amount: number) => void;
  setMethod: (method: PaymentMethod | null) => void;
  getRecommendedMethod: () => PaymentMethod;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  selectedPlan: null,
  amount: 0,
  selectedMethod: null,
  wallet: { balance: 450, cashback: 32 },
  setPlan: (plan, amount) => set({ selectedPlan: plan, amount }),
  setMethod: (method) => set({ selectedMethod: method }),
  getRecommendedMethod: () => {
    const { amount, wallet } = get();
    if (wallet.balance >= amount && amount > 0) return 'wallet';
    if (amount <= 2000) return 'upi';
    return 'card';
  },
}));
