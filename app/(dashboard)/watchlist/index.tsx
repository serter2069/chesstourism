import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeContainer, Header } from '../../../components/layout';
import { Card, Badge, LoadingSpinner, WatchlistButton } from '../../../components/ui';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import api from '../../../lib/api';

interface WatchlistTournament {
  id: string;
  title: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  status: string;
  fee: number | null;
  currency?: string;
  ratingLimit?: number | null;
  timeControl?: string | null;
}

interface WatchlistItem {
  id: string;
  tournamentId: string;
  createdAt: string;
  tournament: WatchlistTournament;
}

const STATUS_BADGE: Record<string, { label: string; status: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  REGISTRATION_OPEN: { label: 'Registration Open', status: 'success' },
  REGISTRATION_CLOSED: { label: 'Registration Closed', status: 'warning' },
  IN_PROGRESS: { label: 'In Progress', status: 'info' },
  COMPLETED: { label: 'Completed', status: 'default' },
  CANCELLED: { label: 'Cancelled', status: 'error' },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function WatchlistScreen() {
  const router = useRouter();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWatchlist = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get('/watchlist');
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load watchlist');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWatchlist();
  }, [fetchWatchlist]);

  return (
    <SafeContainer>
      <Header title="Watchlist" showBack />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brandPrimary} />
        }
      >
        {loading && <LoadingSpinner />}

        {error && !loading && (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!loading && !error && items.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{'\u2661'}</Text>
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptyText}>
              Tap the heart icon on any tournament to add it to your watchlist.
            </Text>
          </View>
        )}

        {!loading && items.map((item) => {
          const t = item.tournament;
          const badge = STATUS_BADGE[t.status] || { label: t.status, status: 'default' as const };
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(`/tournaments/${t.id}`)}
              activeOpacity={0.7}
              style={styles.cardWrapper}
            >
              <Card>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{t.title}</Text>
                  <WatchlistButton tournamentId={t.id} size={20} />
                  <Badge label={badge.label} status={badge.status} />
                </View>
                <View style={styles.cardMeta}>
                  <Text style={styles.metaText}>
                    {formatDate(t.startDate)} - {formatDate(t.endDate)}
                  </Text>
                  <Text style={styles.metaText}>
                    {t.city}, {t.country}
                  </Text>
                </View>
                {t.fee != null && (
                  <View style={styles.cardFooter}>
                    <Text style={styles.footerLabel}>Fee</Text>
                    <Text style={styles.footerValue}>
                      {t.fee === 0 ? 'Free' : `${t.fee} ${t.currency || 'USD'}`}
                    </Text>
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          );
        })}

        <View style={styles.footer} />
      </ScrollView>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing['4xl'],
    maxWidth: 430,
    alignSelf: 'center' as const,
    width: '100%' as unknown as number,
  },
  // Error
  errorWrap: {
    padding: Spacing.lg,
  },
  errorText: {
    color: Colors.statusError,
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
  },
  // Empty
  empty: {
    alignItems: 'center',
    paddingTop: Spacing['4xl'],
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    color: Colors.brandAccent,
    marginBottom: Spacing.lg,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  // Cards
  cardWrapper: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  cardMeta: {
    marginBottom: Spacing.md,
  },
  metaText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDefault,
    paddingTop: Spacing.sm,
  },
  footerLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  footerValue: {
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    fontWeight: Typography.weights.medium,
  },
  footer: {
    height: Spacing['2xl'],
  },
});
