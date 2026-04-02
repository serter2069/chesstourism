import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../lib/api';
import { useAuth } from './auth';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  data?: Record<string, unknown> | null;
  createdAt: string;
}

interface NotificationsContextValue {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  refresh: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue>({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  refresh: async () => {},
  markRead: async () => {},
  markAllRead: async () => {},
});

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      setIsLoading(true);
      const [notifRes, countRes] = await Promise.all([
        api.get<Notification[]>('/notifications'),
        api.get<{ count: number }>('/notifications/unread-count'),
      ]);
      setNotifications(Array.isArray(notifRes.data) ? notifRes.data : []);
      setUnreadCount(countRes.data?.count ?? 0);
    } catch {
      // Non-critical — silently fail
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const markRead = useCallback(
    async (id: string) => {
      try {
        await api.put(`/notifications/${id}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {
        // Silently fail
      }
    },
    [],
  );

  const markAllRead = useCallback(async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // Silently fail
    }
  }, []);

  const value: NotificationsContextValue = {
    notifications,
    unreadCount,
    isLoading,
    refresh,
    markRead,
    markAllRead,
  };

  return React.createElement(NotificationsContext.Provider, { value }, children);
}

export function useNotifications(): NotificationsContextValue {
  return useContext(NotificationsContext);
}
