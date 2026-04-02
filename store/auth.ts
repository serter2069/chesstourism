import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import api, { setAuthToken, clearAuthToken, getAuthToken } from '../lib/api';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  role: 'participant' | 'commissar' | 'admin';
  country?: string;
  city?: string;
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
  login: (email: string, password: string) => Promise<void>;
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
  login: async () => {},
  logout: async () => {},
  loadUser: async () => {},
});

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadUser = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const token = await getAuthToken();
      if (!token) {
        dispatch({ type: 'LOGOUT' });
        return;
      }
      dispatch({ type: 'SET_TOKEN', payload: token });
      const res = await api.get('/auth/me');
      dispatch({ type: 'SET_USER', payload: res.data });
    } catch {
      dispatch({ type: 'LOGOUT' });
      await clearAuthToken();
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    await setAuthToken(token);
    dispatch({ type: 'SET_TOKEN', payload: token });
    dispatch({ type: 'SET_USER', payload: user });
  }, []);

  const logout = useCallback(async () => {
    await clearAuthToken();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const value: AuthContextValue = {
    ...state,
    login,
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
