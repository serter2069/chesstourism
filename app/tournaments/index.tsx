import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeContainer, Header } from '../../components/layout';
import { Button, Card, Badge, LoadingSpinner, Input, WatchlistButton } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useAuth } from '../../store/auth';
import { usePlatform } from '../../hooks/usePlatform';
import api from '../../lib/api';

interface Tournament {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  city: string;
  country: string;
  timeControl: string | null;
  status: string;
  fee: number | null;
  currency?: string;
  ratingLimit?: number | null;
  _count?: { registrations: number };
  commissioner?: {
    id: string;
    userId: string;
    country?: string | null;
    city?: string | null;
    user?: { name: string; surname: string };
  };
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'REGISTRATION_OPEN', label: 'Registration Open' },
  { value: 'REGISTRATION_CLOSED', label: 'Registration Closed' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
];

const RATING_OPTIONS = [
  { value: '', label: 'Open' },
  { value: '2200', label: 'U2200' },
  { value: '1800', label: 'U1800' },
  { value: '1400', label: 'U1400' },
];

const TIME_CONTROL_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'classical', label: 'Classical' },
  { value: 'rapid', label: 'Rapid' },
  { value: 'blitz', label: 'Blitz' },
];

const STATUS_BADGE: Record<string, { label: string; status: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  DRAFT: { label: 'Draft', status: 'default' },
  PUBLISHED: { label: 'Coming Soon', status: 'default' },
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
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [timeControlFilter, setTimeControlFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [debouncedCountryFilter, setDebouncedCountryFilter] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Debounce search query: only update debouncedSearchQuery after 300ms of no typing
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [searchQuery]);

  // Debounce country filter: only update debouncedCountryFilter after 300ms of no typing
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedCountryFilter(countryFilter);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [countryFilter]);

  const fetchTournaments = useCallback(async (pageNum = 1, append = false) => {
    try {
      setError(null);
      if (!append) setLoading(true);

      const params: Record<string, string | number> = { page: pageNum, limit: 10 };
      if (debouncedSearchQuery) params.q = debouncedSearchQuery;
      if (statusFilter) params.status = statusFilter;
      if (ratingFilter) params.ratingMax = ratingFilter;
      if (timeControlFilter) params.timeControl = timeControlFilter;
      if (debouncedCountryFilter) params.country = debouncedCountryFilter;

      const res = await api.get('/tournaments', { params });
      const data = res.data;
      const items: Tournament[] = Array.isArray(data) ? data : data.data || data.items || data.tournaments || [];
      const total = data.pagination?.total ?? data.total ?? items.length;

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
  }, [debouncedSearchQuery, statusFilter, ratingFilter, timeControlFilter, debouncedCountryFilter]);

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

  const isCommissar = user?.role === 'COMMISSIONER' || user?.role === 'ADMIN';
  const { columns } = usePlatform();

  return (
    <SafeContainer>
      <Header />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Page title */}
        <View style={styles.pageTitle}>
          <Text style={styles.pageTitleText}>Tournaments</Text>
        </View>

        {/* Search input */}
        <View style={styles.searchRow}>
          <View style={styles.searchInputWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search tournaments..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.searchClear}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.searchClearText}>{'×'}</Text>
              </TouchableOpacity>
            )}
          </View>
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

          {/* Rating category filter */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Rating</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipRow}>
                {RATING_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setRatingFilter(opt.value)}
                    style={[styles.chip, ratingFilter === opt.value && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, ratingFilter === opt.value && styles.chipTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Time control filter */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Time Control</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipRow}>
                {TIME_CONTROL_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setTimeControlFilter(opt.value)}
                    style={[styles.chip, timeControlFilter === opt.value && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, timeControlFilter === opt.value && styles.chipTextActive]}>
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
              onPress={() => router.push('/(dashboard)/tournaments/create' as never)}
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

        {/* Tournament list — responsive grid */}
        {!loading && (
          <View style={[styles.grid, { paddingHorizontal: Spacing.lg }]}>
            {tournaments.map((t) => {
              const badge = STATUS_BADGE[t.status] || { label: t.status, status: 'default' as const };
              return (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => router.push(`/tournaments/${t.id}`)}
                  activeOpacity={0.7}
                  style={[
                    styles.gridItem,
                    columns > 1 && { width: `${(100 / columns) - 1}%` as unknown as number },
                  ]}
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
                    <View style={styles.cardFooter}>
                      {t.timeControl && (
                        <View style={styles.footerItem}>
                          <Text style={styles.footerLabel}>Format</Text>
                          <Text style={styles.footerValue}>{t.timeControl}</Text>
                        </View>
                      )}
                      {t.commissioner?.user && (
                        <View style={styles.footerItem}>
                          <Text style={styles.footerLabel}>Commissar</Text>
                          <Text style={styles.footerValue}>{[t.commissioner.user.name, t.commissioner.user.surname].filter(Boolean).join(' ')}</Text>
                        </View>
                      )}
                      {t._count?.registrations != null && (
                        <View style={styles.footerItem}>
                          <Text style={styles.footerLabel}>Players</Text>
                          <Text style={styles.footerValue}>{t._count.registrations}</Text>
                        </View>
                      )}
                      {t.fee != null && (
                        <View style={styles.footerItem}>
                          <Text style={styles.footerLabel}>Fee</Text>
                          <Text style={styles.footerValue}>
                            {t.fee === 0 ? 'Free' : `${t.fee} ${t.currency || 'EUR'}`}
                          </Text>
                        </View>
                      )}
                      <View style={styles.footerItem}>
                        <Text style={styles.footerLabel}>Rating</Text>
                        <Text style={styles.footerValue}>
                          {t.ratingLimit != null ? `\u2264 ${t.ratingLimit}` : 'Open'}
                        </Text>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

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
    color: Colors.text,
  },
  // Filters
  filters: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    width: '100%',
  },
  filterRow: {
    marginBottom: Spacing.md,
  },
  filterLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textMuted,
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
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  chipText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
  chipTextActive: {
    color: '#FFFFFF',
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
    color: Colors.error,
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
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  // Grid layout
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  gridItem: {
    marginTop: 0,
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
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  cardMeta: {
    marginBottom: Spacing.md,
  },
  metaText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
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
    color: Colors.text,
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
  // Search
  searchRow: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.sm,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  searchClear: {
    paddingLeft: Spacing.sm,
  },
  searchClearText: {
    fontSize: 20,
    color: Colors.textMuted,
    lineHeight: 24,
  },
});
