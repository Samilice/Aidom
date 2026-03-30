// ============================================
// AIDOM — Global Store (Zustand)
// ============================================

import { create } from 'zustand';
import type { User, Employer, Employee } from '../types';
import { api } from './api';

interface AppState {
  // Auth
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  loadUser: () => Promise<void>;

  // Employer
  employer: Employer | null;
  setEmployer: (employer: Employer | null) => void;
  loadEmployer: () => Promise<void>;

  // Employees
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  loadEmployees: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  // Auth
  user: null,
  token: localStorage.getItem('aidom_token'),
  isLoading: true,

  setAuth: (user, token) => {
    localStorage.setItem('aidom_token', token);
    set({ user, token, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem('aidom_token');
    set({ user: null, token: null, employer: null, employees: [] });
  },

  loadUser: async () => {
    const token = localStorage.getItem('aidom_token');
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const res = await api.getMe();
      if (res.success && res.data) {
        set({ user: res.data as User, token, isLoading: false });
      } else {
        localStorage.removeItem('aidom_token');
        set({ user: null, token: null, isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  // Employer
  employer: null,
  setEmployer: (employer) => set({ employer }),

  loadEmployer: async () => {
    const res = await api.getEmployer();
    if (res.success) {
      set({ employer: (res.data as Employer) || null });
    }
  },

  // Employees
  employees: [],
  setEmployees: (employees) => set({ employees }),

  loadEmployees: async () => {
    const res = await api.getEmployees();
    if (res.success) {
      set({ employees: (res.data as Employee[]) || [] });
    }
  },
}));
