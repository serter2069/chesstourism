import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storage } from './storage';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://chesstourism.smartlaunchhub.com/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // send cookies on web
});

// Request interceptor — attach JWT from storage (for native)
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await storage.get(TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Storage read failed — continue without token
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Reactive refresh: deduplicated 401 interceptor
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function doRefresh(): Promise<string | null> {
  try {
    const refreshToken = await storage.get(REFRESH_TOKEN_KEY);
    if (!refreshToken) return null;

    const res = await axios.post(
      `${api.defaults.baseURL}/auth/refresh`,
      { refreshToken },
      { withCredentials: true },
    );

    const { token, refreshToken: newRefresh } = res.data;
    await saveTokens(token, newRefresh);
    return token;
  } catch {
    await clearTokens();
    return null;
  }
}

// Response interceptor — reactive refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _isRetry?: boolean };

    if (error.response?.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = doRefresh().finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

// Token management
export async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
  await storage.set(TOKEN_KEY, accessToken);
  await storage.set(REFRESH_TOKEN_KEY, refreshToken);
}

export async function clearTokens(): Promise<void> {
  await storage.del(TOKEN_KEY);
  await storage.del(REFRESH_TOKEN_KEY);
}

export async function getAuthToken(): Promise<string | null> {
  return storage.get(TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return storage.get(REFRESH_TOKEN_KEY);
}

// Proactive refresh — call from useAuthRefresh hook
export async function refreshTokens(): Promise<boolean> {
  try {
    const refreshToken = await storage.get(REFRESH_TOKEN_KEY);
    if (!refreshToken) return false;

    const res = await axios.post(
      `${api.defaults.baseURL}/auth/refresh`,
      { refreshToken },
      { withCredentials: true },
    );

    const { token, refreshToken: newRefresh } = res.data;
    await saveTokens(token, newRefresh);
    return true;
  } catch {
    return false;
  }
}

// Legacy exports for backward compatibility
export async function setAuthToken(token: string): Promise<void> {
  await storage.set(TOKEN_KEY, token);
}

export async function clearAuthToken(): Promise<void> {
  await clearTokens();
}

export default api;
