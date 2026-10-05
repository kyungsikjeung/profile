'use client';

import { create } from 'zustand';
import { api } from '@/lib/api';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  login: async (email, password) => {
    set({ loading: true });
    try {
      const t = await api.login(email, password);
      localStorage.setItem('p3d_access', t.access_token);
      localStorage.setItem('p3d_refresh', t.refresh_token);
      const user = (await api.me()) as User;
      set({ user });
    } finally {
      set({ loading: false });
    }
  },
  signup: async (email, password, name) => {
    set({ loading: true });
    try {
      await api.register(email, password, name);
      const t = await api.login(email, password);
      localStorage.setItem('p3d_access', t.access_token);
      localStorage.setItem('p3d_refresh', t.refresh_token);
      const user = (await api.me()) as User;
      set({ user });
    } finally {
      set({ loading: false });
    }
  },
  logout: () => {
    localStorage.removeItem('p3d_access');
    localStorage.removeItem('p3d_refresh');
    set({ user: null });
  },
  fetchMe: async () => {
    if (!localStorage.getItem('p3d_access')) return;
    try {
      const user = (await api.me()) as User;
      set({ user });
    } catch {
      set({ user: null });
    }
  },
}));
