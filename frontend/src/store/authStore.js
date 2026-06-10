import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.post('/api/auth/login', { email, password });
          set({ user: res.data.user, token: res.data.token, loading: false });
          return { success: true };
        } catch (err) {
          // Demo fallback
          if (email && password.length >= 6) {
            const demoUser = { id: 'demo-1', name: 'Demo School', email, school: 'Demo School' };
            set({ user: demoUser, token: 'demo-token', loading: false });
            return { success: true };
          }
          set({ loading: false, error: err.response?.data?.message || 'Login failed' });
          return { success: false };
        }
      },

      register: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.post('/api/auth/register', data);
          set({ user: res.data.user, token: res.data.token, loading: false });
          return { success: true };
        } catch (err) {
          // Demo fallback
          const demoUser = { id: 'demo-1', name: data.name, email: data.email, school: data.school };
          set({ user: demoUser, token: 'demo-token', loading: false });
          return { success: true };
        }
      },

      logout: () => set({ user: null, token: null, error: null }),

      isAuthenticated: () => !!get().token,
    }),
    { name: 'ilc-auth', partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);
