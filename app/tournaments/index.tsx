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
import { SafeContainer, Header } from '../../components/layout';
import { Button, Card, Badge, LoadingSpinner, Input } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useAuth } from '../../store/auth';
import api from '../../lib/api';

interface Tournament {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  city: string;
  country: string;
  format: string;
  status: string;
  entryFee: number | null;
  currency?: string;
  _count?: { participants: number };
  commissar?: {
    id: string;
    name: string;
    surname: string;
  };
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'REGISTRATION_OPEN', label: 'Registration Open' },
  { value: 'REGISTRATION_CLOSED', label: 'Registration Closed' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
];

const FORMAT_OPTIONS = [
  { value: '', label: 'All Formats' },
  { value: 'CLASSICAL', label: 'Classical' },
  { value: 'RAPID', label: 'Rapid' },
  { value: 'BLITZ', label: 'Blitz' },
  { value: 'BULLET', label: 'Bullet' },
];

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

export default function TournamentsListScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [formatFilter, setFormatFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchTournaments = useCallback(async (pageNum = 1, append = false) => {
    try {
      setError(null);
      if (!append) setLoading(true);

      const params: Record<string, string | number> = { page: pageNum, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      if (formatFilter) params.format = formatFilter;
      if (countryFilter) params.country = countryFilter;

      const res = await api.get('/tournaments', { params });
      const data = res.data;
      const items: Tournament[] = Array.isArray(data) ? data : data.items || data.tournaments || [];
      const total = data.total || items.length;

      if (append) {
        setTournaments((prev) => [...prev, ...items]);
      } else {
        setTournaments(items);
      }
      setHasMore(pageNum * 10 < total);
      setPage(pageNum);
    } catch {
      setError('Failed to load tournaments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter, formatFilter, countryFilter]);

  useEffect(() => {
    fetchTournaments(1);
  }, [fetchTournaments]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTournaments(1);
  }, [fetchTournaments]);

  const loadMore = useCallback(() => {
    if (hasMore) {
      fetchTournaments(page + 1, true);
    }
  }, [hasMore, page, fetchTournaments]);

  const isCommissar = user?.role === 'commissar' || user?.role === 'admin';

  return (
    <SafeContainer>
      <Header />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brandPrimary} />
        }
      >
        {/* Page title */}
        <View style={styles.pageTitle}>
          <Text style={styles.pageTitleText}>Tournaments</Text>
        </View>

        {/* Filters */}
        <View style={styles.filters}>
          {/* Status filter */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Status</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipRow}>
                {STATUS_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setStatusFilter(opt.value)}
                    style={[styles.chip, statusFilter === opt.value && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, statusFilter === opt.value && styles.chipTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Format filter */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Format</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipRow}>
                {FORMAT_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setFormatFilter(opt.value)}
                    style={[styles.chip, formatFilter === opt.value && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, formatFilter === opt.value && styles.chipTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Country text filter */}
          <View style={styles.filterRow}>
            <Input
              placeholder="Filter by country..."
              value={countryFilter}
              onChangeText={setCountryFilter}
            />
          </View>
        </View>

        {/* Create tournament button for commissars */}
        {isCommissar && (
          <View style={styles.createRow}>
            <Button
              title="Create Tournament"
              onPress={() => router.push('/(auth)/commissar/tournament/create' as never)}
              style={styles.createBtn}
            />
          </View>
        )}

        {/* Loading state */}
        {loading && <LoadingSpinner />}

        {/* Error state */}
        {error && !loading && (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Button title="Retry" onPress={() => fetchTournaments(1)} variant="secondary" />
          </Card>
        )}

        {/* Empty state */}
        {!loading && !error && tournaments.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{'♜'}</Text>
            <Text style={styles.emptyTitle}>No Tournaments Found</Text>
            <Text style={styles.emptyText}>Try adjusting your filters or check back later.</Text>
          </View>
        )}

        {/* Tournament list */}
        {!loading && tournaments.map((t) => {
          const badge = STATUS_BADGE[t.status] || { label: t.status, status: 'default' as const };
          return (
            <TouchableOpacity
              key={t.id}
              onPress={() => router.push(`/tournaments/${t.id}`)}
              activeOpacity={0.7}
              style={styles.cardWrapper}
            >
              <Card>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{t.title}</Text>
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
                <View style={styles.cardFooter}>
                  <View style={styles.footerItem}>
                    <Text style={styles.footerLabel}>Format</Text>
                    <Text style={styles.footerValue}>{t.format}</Text>
                  </View>
                  {t.commissar && (
                    <View style={styles.footerItem}>
                      <Text style={styles.footerLabel}>Commissar</Text>
                      <Text style={styles.footerValue}>{t.commissar.name} {t.commissar.surname}</Text>
                    </View>
                  )}
                  {t._count?.participants != null && (
                    <View style={styles.footerItem}>
                      <Text style={styles.footerLabel}>Players</Text>
                      <Text style={styles.footerValue}>{t._count.participants}</Text>
                    </View>
                  )}
                  {t.entryFee != null && (
                    <View style={styles.footerItem}>
                      <Text style={styles.footerLabel}>Fee</Text>
                      <Text style={styles.footerValue}>
                        {t.entryFee === 0 ? 'Free' : `${t.entryFee} ${t.currency || 'EUR'}`}
                      </Text>
                    </View>
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}

        {/* Load more */}
        {hasMore && !loading && (
          <View style={styles.loadMore}>
            <Button title="Load More" onPress={loadMore} variant="secondary" />
          </View>
        )}

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
  },
  // Page title
  pageTitle: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  pageTitleText: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  // Filters
  filters: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  filterRow: {
    marginBottom: Spacing.md,
  },
  filterLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  chip: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: 16,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  chipActive: {
    backgroundColor: Colors.brandPrimary,
    borderColor: Colors.brandPrimary,
  },
  chipText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  chipTextActive: {
    color: '#ffffff',
  },
  // Create button
  createRow: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  createBtn: {
    marginBottom: Spacing.sm,
  },
  // Error
  errorCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  errorText: {
    color: Colors.statusError,
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.md,
  },
  // Empty
  empty: {
    alignItems: 'center',
    paddingTop: Spacing['4xl'],
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.lg,
    opacity: 0.5,
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
    flexWrap: 'wrap',
    gap: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDefault,
    paddingTop: Spacing.sm,
  },
  footerItem: {},
  footerLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  footerValue: {
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    fontWeight: Typography.weights.medium,
  },
  // Load more
  loadMore: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  footer: {
    height: Spacing['2xl'],
  },
});
