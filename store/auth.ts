import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import api, { saveTokens, clearTokens, getAuthToken } from '../lib/api';
import { useAuthRefresh } from '../hooks/use-auth-refresh';

// Types
export interface User {
  id: string;
  email: string;
  name?: string;
  surname?: string;
  phone?: string;
  role: 'PARTICIPANT' | 'COMMISSIONER' | 'ADMIN';
  country?: string;
  city?: string;
  birthDate?: string | null;
  onboardingCompleted?: boolean;
  preferences?: Record<string, any> | null;
  fideId?: string | null;
  fideRating?: number | null;
  fideTitle?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGOUT' };

interface AuthContextValue extends AuthState {
  requestOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGOUT':
      return { user: null, token: null, isLoading: false };
    default:
      return state;
  }
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
};

// Context
export const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  requestOtp: async () => {},
  verifyOtp: async () => {},
  logout: async () => {},
  loadUser: async () => {},
});

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Level 2: Proactive refresh every 20 min (only when logged in)
  useAuthRefresh(!!state.user);

  // Level 3: Check auth on startup
  const loadUser = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const token = await getAuthToken();
      if (!token) {
        dispatch({ type: 'LOGOUT' });
        return;
      }
      dispatch({ type: 'SET_TOKEN', payload: token });
      // GET /me — api interceptor handles 401 with reactive refresh (Level 1)
      const res = await api.get('/auth/me');
      dispatch({ type: 'SET_USER', payload: res.data });
    } catch {
      dispatch({ type: 'LOGOUT' });
      await clearTokens();
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const requestOtp = useCallback(async (email: string) => {
    await api.post('/auth/send-code', { email });
  }, []);

  const verifyOtp = useCallback(async (email: string, code: string) => {
    const res = await api.post('/auth/verify-code', { email, code });
    const { token, refreshToken, user } = res.data;
    await saveTokens(token, refreshToken);
    dispatch({ type: 'SET_TOKEN', payload: token });
    dispatch({ type: 'SET_USER', payload: user });
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Server logout failed — still clear local state
    }
    await clearTokens();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const value: AuthContextValue = {
    ...state,
    requestOtp,
    verifyOtp,
    logout,
    loadUser,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

// Hook
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
