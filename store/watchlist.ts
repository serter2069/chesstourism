import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from './auth';

interface WatchlistContextValue {
  watchlistedIds: Set<string>;
  isLoading: boolean;
  isWatchlisted: (tournamentId: string) => boolean;
  toggle: (tournamentId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextValue>({
  watchlistedIds: new Set(),
  isLoading: false,
  isWatchlisted: () => false,
  toggle: async () => {},
  refresh: async () => {},
});

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [watchlistedIds, setWatchlistedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setWatchlistedIds(new Set());
      return;
    }
    try {
      setIsLoading(true);
      const res = await api.get('/watchlist/ids');
      const ids: string[] = Array.isArray(res.data) ? res.data : [];
      setWatchlistedIds(new Set(ids));
    } catch {
      // Silently fail — watchlist is non-critical
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isWatchlisted = useCallback(
    (tournamentId: string) => watchlistedIds.has(tournamentId),
    [watchlistedIds],
  );

  const toggle = useCallback(
    async (tournamentId: string) => {
      if (!user) return;

      const wasWatchlisted = watchlistedIds.has(tournamentId);

      // Optimistic update
      setWatchlistedIds((prev) => {
        const next = new Set(prev);
        if (wasWatchlisted) {
          next.delete(tournamentId);
        } else {
          next.add(tournamentId);
        }
        return next;
      });

      try {
        if (wasWatchlisted) {
          await api.delete(`/watchlist/${tournamentId}`);
        } else {
          await api.post('/watchlist', { tournamentId });
        }
      } catch {
        // Revert on error
        setWatchlistedIds((prev) => {
          const reverted = new Set(prev);
          if (wasWatchlisted) {
            reverted.add(tournamentId);
          } else {
            reverted.delete(tournamentId);
          }
          return reverted;
        });
      }
    },
    [user, watchlistedIds],
  );

  const value: WatchlistContextValue = {
    watchlistedIds,
    isLoading,
    isWatchlisted,
    toggle,
    refresh,
  };

  return React.createElement(WatchlistContext.Provider, { value }, children);
}

export function useWatchlist(): WatchlistContextValue {
  return useContext(WatchlistContext);
}
