import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeContainer, Header } from '../../../components/layout';
import { Card, Badge, LoadingSpinner, Button } from '../../../components/ui';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import api from '../../../lib/api';

interface Tournament {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  city: string;
  country: string;
  status: string;
  commissarName?: string;
  fee?: number | null;
  currency?: string;
  timeControl?: string | null;
  _count?: { registrations: number };
}

type StatusFilter = 'ALL' | 'DRAFT' | 'PUBLISHED' | 'REGISTRATION_OPEN' | 'REGISTRATION_CLOSED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Open', value: 'REGISTRATION_OPEN' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const STATUS_BADGE: Record<string, { label: string; status: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  DRAFT: { label: 'Draft', status: 'default' },
  PUBLISHED: { label: 'Published', status: 'info' },
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

export default function AdminTournamentsScreen() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchTournaments = useCallback(async (p = 1) => {
    try {
      setError(null);
      const params: Record<string, string | number> = { page: p, limit: 20 };
      if (filter !== 'ALL') params.status = filter;

      const res = await api.get('/admin/tournaments', { params });
      const data = res.data;
      const items: Tournament[] = data.items || [];
      setTournaments(items);
      setPage(data.pagination?.page || 1);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || items.length);
    } catch {
      setError('Failed to load tournaments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useEffect(() => {
    setLoading(true);
    fetchTournaments(1);
  }, [fetchTournaments]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTournaments(1);
  }, [fetchTournaments]);

  return (
    <SafeContainer>
      <Header title="All Tournaments" showBack />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Summary */}
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {loading ? '...' : total}
          </Text>
          <Text style={styles.summaryLabel}>
            {filter === 'ALL' ? 'Total Tournaments' : `${STATUS_BADGE[filter]?.label || filter} Tournaments`}
          </Text>
        </Card>

        {/* Status filter tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <View style={styles.filterRow}>
            {STATUS_FILTERS.map((f) => (
              <TouchableOpacity
                key={f.value}
                style={[styles.filterTab, filter === f.value && styles.filterTabActive]}
                onPress={() => setFilter(f.value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterTabText, filter === f.value && styles.filterTabTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {loading && <LoadingSpinner />}

        {error && !loading && (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Button title="Retry" onPress={() => fetchTournaments(1)} variant="secondary" />
          </Card>
        )}

        {!loading && !error && tournaments.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No Tournaments</Text>
            <Text style={styles.emptyText}>
              {filter === 'ALL' ? 'No tournaments have been created yet.' : `No ${filter.toLowerCase().replace(/_/g, ' ')} tournaments.`}
            </Text>
          </View>
        )}

        {!loading &&
          tournaments.map((t) => {
            const badge = STATUS_BADGE[t.status] || { label: t.status, status: 'default' as const };
            return (
              <TouchableOpacity
                key={t.id}
                activeOpacity={0.7}
                onPress={() => router.push(`/tournaments/${t.id}` as never)}
              >
                <Card style={styles.tournamentCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {t.title}
                    </Text>
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
                      <Text style={styles.footerLabel}>Commissar</Text>
                      <Text style={styles.footerValue}>{t.commissarName || 'Unassigned'}</Text>
                    </View>
                    {t.timeControl && (
                      <View style={styles.footerItem}>
                        <Text style={styles.footerLabel}>Time Control</Text>
                        <Text style={styles.footerValue}>{t.timeControl}</Text>
                      </View>
                    )}
                    {t._count?.registrations != null && (
                      <View style={styles.footerItem}>
                        <Text style={styles.footerLabel}>Registrations</Text>
                        <Text style={styles.footerValue}>{t._count.registrations}</Text>
                      </View>
                    )}
                    {t.fee != null && t.fee > 0 && (
                      <View style={styles.footerItem}>
                        <Text style={styles.footerLabel}>Fee</Text>
                        <Text style={styles.footerValue}>{t.currency || '$'}{t.fee}</Text>
                      </View>
                    )}
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <View style={styles.pagination}>
            <Button
              title="Previous"
              onPress={() => fetchTournaments(page - 1)}
              disabled={page <= 1}
              variant="secondary"
            />
            <Text style={styles.pageText}>
              Page {page} of {totalPages}
            </Text>
            <Button
              title="Next"
              onPress={() => fetchTournaments(page + 1)}
              disabled={page >= totalPages}
              variant="secondary"
            />
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    maxWidth: 430,
    alignSelf: 'center' as const,
    width: '100%',
  },
  summaryCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.md,
    backgroundColor: Colors.primary,
  },
  summaryValue: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.gold,
    marginBottom: Spacing.xs,
  },
  summaryLabel: {
    fontSize: Typography.sizes.sm,
    color: '#FFFFFF',
  },
  filterScroll: {
    marginBottom: Spacing.lg,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  filterTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundAlt,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterTabText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  errorCard: {
    marginTop: Spacing.lg,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.md,
  },
  empty: {
    alignItems: 'center',
    paddingTop: Spacing['4xl'],
    paddingHorizontal: Spacing.xl,
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
  tournamentCard: {
    marginBottom: Spacing.md,
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
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  pageText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  bottomSpacer: {
    height: Spacing['4xl'],
  },
});
