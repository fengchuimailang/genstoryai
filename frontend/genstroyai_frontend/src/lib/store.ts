import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../api/auth-api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastLoginTime: number | null;
}

interface AuthActions {
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  clearError: () => void;
  updateUser: (updates: Partial<User>) => void;
  refreshToken: (token: string) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      lastLoginTime: null,

      // Actions
      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
          error: null,
          lastLoginTime: Date.now(),
        }),

      setToken: (token) =>
        set({
          token,
        }),

      setLoading: (isLoading) =>
        set({
          isLoading,
        }),

      setError: (error) =>
        set({
          error,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          lastLoginTime: null,
        }),

      clearError: () =>
        set({
          error: null,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      refreshToken: (token) =>
        set({
          token,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        lastLoginTime: state.lastLoginTime,
      }),
      // 添加版本控制，便于后续迁移
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // 处理旧版本数据迁移
          return {
            ...persistedState,
            lastLoginTime: null,
          };
        }
        return persistedState;
      },
    }
  )
); 