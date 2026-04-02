import { useEffect, useRef } from 'react';
import { AppState, Platform } from 'react-native';
import { refreshTokens } from '../lib/api';

const REFRESH_INTERVAL_MS = 20 * 60 * 1000; // 20 minutes
const MIN_REFRESH_GAP_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Proactive token refresh hook — mounts at app root.
 * Level 2 of 3-level refresh system:
 *   1. Reactive (401 interceptor in api.ts)
 *   2. Proactive (this hook — every 20 min + on app resume)
 *   3. On startup (checkAuth in AuthProvider)
 */
export function useAuthRefresh(isLoggedIn: boolean) {
  const lastRefreshRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!isLoggedIn) return;

    // Periodic refresh every 20 minutes
    const interval = setInterval(() => {
      refreshTokens();
      lastRefreshRef.current = Date.now();
    }, REFRESH_INTERVAL_MS);

    // On app resume (foreground) — refresh if enough time passed
    let subscription: ReturnType<typeof AppState.addEventListener> | undefined;

    if (Platform.OS === 'web') {
      // Web: visibilitychange event
      const onVisibility = () => {
        if (
          document.visibilityState === 'visible' &&
          Date.now() - lastRefreshRef.current >= MIN_REFRESH_GAP_MS
        ) {
          refreshTokens();
          lastRefreshRef.current = Date.now();
        }
      };
      document.addEventListener('visibilitychange', onVisibility);
      return () => {
        clearInterval(interval);
        document.removeEventListener('visibilitychange', onVisibility);
      };
    } else {
      // Native: AppState change
      subscription = AppState.addEventListener('change', (nextState) => {
        if (
          nextState === 'active' &&
          Date.now() - lastRefreshRef.current >= MIN_REFRESH_GAP_MS
        ) {
          refreshTokens();
          lastRefreshRef.current = Date.now();
        }
      });
      return () => {
        clearInterval(interval);
        subscription?.remove();
      };
    }
  }, [isLoggedIn]);
}
