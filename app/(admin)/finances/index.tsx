import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeContainer, Header } from '../../../components/layout';
import { Card, Badge, LoadingSpinner, Button } from '../../../components/ui';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import api from '../../../lib/api';

// ── Types ───────────────────────────────────────────────

interface FinanceSummary {
  totalRevenue: number;
  paidCount: number;
  pendingAmount: number;
  refundedCount: number;
}

interface PaymentItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  tournament: { title: string; currency: string } | null;
  user: { name: string | null; email: string } | null;
}

interface FinanceResponse {
  summary: FinanceSummary;
  items: PaymentItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

// ── Period helpers ───────────────────────────────────────

type PeriodKey = 'all' | 'month' | '30d' | 'year';

const PERIOD_TABS: { label: string; value: PeriodKey }[] = [
  { label: 'All Time', value: 'all' },
  { label: 'This Month', value: 'month' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'This Year', value: 'year' },
];

function periodToParams(period: PeriodKey): { from?: string; to?: string } {
  const now = new Date();
  if (period === 'all') return {};
  if (period === 'month') {
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    return { from: from.toISOString() };
  }
  if (period === '30d') {
    const from = new Date(now);
    from.setDate(from.getDate() - 30);
    return { from: from.toISOString() };
  }
  // year
  const from = new Date(now.getFullYear(), 0, 1);
  return { from: from.toISOString() };
}

// ── Formatting ──────────────────────────────────────────

function formatCurrency(amount: number, currency?: string): string {
  const cur = (currency || 'USD').toUpperCase();
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${cur}`;
  }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const STATUS_BADGE: Record<string, { label: string; status: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  PAID: { label: 'Paid', status: 'success' },
  PENDING: { label: 'Pending', status: 'warning' },
  FAILED: { label: 'Failed', status: 'error' },
  REFUNDED: { label: 'Refunded', status: 'info' },
};

// ── Component ───────────────────────────────────────────

export default function AdminFinancesScreen() {
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [items, setItems] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<PeriodKey>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchFinances = useCallback(async (p = 1) => {
    try {
      setError(null);
      const params: Record<string, string | number> = { page: p, limit: 20 };
      const dateParams = periodToParams(period);
      if (dateParams.from) params.from = dateParams.from;
      if (dateParams.to) params.to = dateParams.to;

      const res = await api.get<FinanceResponse>('/admin/finances', { params });
      const data = res.data;
      setSummary(data.summary);
      setItems(data.items || []);
      setPage(data.pagination?.page || 1);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      setError('Failed to load financial data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [period]);

  useEffect(() => {
    setLoading(true);
    fetchFinances(1);
  }, [fetchFinances]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFinances(1);
  }, [fetchFinances]);

  return (
    <SafeContainer>
      <Header title="Finances" showBack />
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
        {/* Period tabs */}
        <View style={styles.filterRow}>
          {PERIOD_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.value}
              style={[styles.filterTab, period === tab.value && styles.filterTabActive]}
              onPress={() => setPeriod(tab.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterTabText, period === tab.value && styles.filterTabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading && <LoadingSpinner />}

        {error && !loading && (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Button title="Retry" onPress={() => fetchFinances(1)} variant="secondary" />
          </Card>
        )}

        {!loading && !error && summary && (
          <>
            {/* Summary cards */}
            <View style={styles.statsRow}>
              <Card style={styles.statCard}>
                <Text style={styles.statValue}>{formatCurrency(summary.totalRevenue)}</Text>
                <Text style={styles.statLabel}>Total Revenue</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text style={styles.statValue}>{summary.paidCount}</Text>
                <Text style={styles.statLabel}>Paid</Text>
              </Card>
            </View>
            <View style={styles.statsRow}>
              <Card style={styles.statCard}>
                <Text style={[styles.statValue, { color: Colors.gold }]}>
                  {formatCurrency(summary.pendingAmount)}
                </Text>
                <Text style={styles.statLabel}>Pending</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text style={styles.statValue}>{summary.refundedCount}</Text>
                <Text style={styles.statLabel}>Refunds</Text>
              </Card>
            </View>

            {/* Transactions header */}
            <Text style={styles.sectionTitle}>Transactions</Text>

            {items.length === 0 && (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>No Transactions</Text>
                <Text style={styles.emptyText}>
                  No payments found for the selected period.
                </Text>
              </View>
            )}

            {items.map((item) => {
              const badge = STATUS_BADGE[item.status] || STATUS_BADGE.PENDING;
              const currency = item.tournament?.currency || item.currency || 'USD';
              return (
                <Card key={item.id} style={styles.txCard}>
                  <View style={styles.txHeader}>
                    <View style={styles.txInfo}>
                      <Text style={styles.txAmount}>
                        {formatCurrency(item.amount, currency)}
                      </Text>
                      <Text style={styles.txTournament} numberOfLines={1}>
                        {item.tournament?.title || 'N/A'}
                      </Text>
                    </View>
                    <Badge label={badge.label} status={badge.status} />
                  </View>
                  <View style={styles.txFooter}>
                    <Text style={styles.txUser} numberOfLines={1}>
                      {item.user?.name || item.user?.email || 'Unknown'}
                    </Text>
                    <Text style={styles.txDate}>{formatDate(item.createdAt)}</Text>
                  </View>
                </Card>
              );
            })}

            {totalPages > 1 && (
              <View style={styles.pagination}>
                <Button
                  title="Previous"
                  onPress={() => fetchFinances(page - 1)}
                  disabled={page <= 1}
                  variant="secondary"
                />
                <Text style={styles.pageText}>
                  Page {page} of {totalPages}
                </Text>
                <Button
                  title="Next"
                  onPress={() => fetchFinances(page + 1)}
                  disabled={page >= totalPages}
                  variant="secondary"
                />
              </View>
            )}
          </>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeContainer>
  );
}

// ── Styles ──────────────────────────────────────────────

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
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
    flexWrap: 'wrap',
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
    color: Colors.white,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  statValue: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
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
  txCard: {
    marginBottom: Spacing.md,
  },
  txHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  txInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  txAmount: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  txTournament: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  txFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.xs,
  },
  txUser: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    flex: 1,
  },
  txDate: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
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
