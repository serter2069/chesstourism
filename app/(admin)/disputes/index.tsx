import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeContainer, Header } from '../../../components/layout';
import { Card, Badge, LoadingSpinner, Button } from '../../../components/ui';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import api from '../../../lib/api';

// ── Types ───────────────────────────────────────────────

interface DisputeItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  externalId: string | null;
  createdAt: string;
  tournament: { title: string; currency: string } | null;
  user: { name: string | null; email: string } | null;
}

interface DisputesResponse {
  items: DisputeItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
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

// ── Component ───────────────────────────────────────────

export default function AdminDisputesScreen() {
  const [items, setItems] = useState<DisputeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchDisputes = useCallback(async (p = 1) => {
    try {
      setError(null);
      const res = await api.get<DisputesResponse>('/admin/disputes', {
        params: { page: p, limit: 20 },
      });
      const data = res.data;
      setItems(data.items || []);
      setPage(data.pagination?.page || 1);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || 0);
    } catch {
      setError('Failed to load disputes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchDisputes(1);
  }, [fetchDisputes]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDisputes(1);
  }, [fetchDisputes]);

  return (
    <SafeContainer>
      <Header title="Disputes" showBack />
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
        {loading && <LoadingSpinner />}

        {error && !loading && (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Button title="Retry" onPress={() => fetchDisputes(1)} variant="secondary" />
          </Card>
        )}

        {!loading && !error && (
          <>
            {/* Summary */}
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{total}</Text>
              <Text style={styles.summaryLabel}>Total Disputed Payments</Text>
            </Card>

            {items.length === 0 && (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>No Disputes</Text>
                <Text style={styles.emptyText}>
                  No disputed payments found. Disputes appear here when Stripe receives a chargeback.
                </Text>
              </View>
            )}

            {items.map((item) => {
              const currency = item.tournament?.currency || item.currency || 'USD';
              return (
                <Card key={item.id} style={styles.disputeCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardInfo}>
                      <Text style={styles.amount}>
                        {formatCurrency(item.amount, currency)}
                      </Text>
                      <Text style={styles.tournament} numberOfLines={1}>
                        {item.tournament?.title || 'N/A'}
                      </Text>
                    </View>
                    <Badge label="Disputed" status="error" />
                  </View>

                  <View style={styles.cardBody}>
                    <View style={styles.row}>
                      <Text style={styles.label}>User</Text>
                      <Text style={styles.value} numberOfLines={1}>
                        {item.user?.name || item.user?.email || 'Unknown'}
                      </Text>
                    </View>
                    {item.user?.name && item.user?.email && (
                      <View style={styles.row}>
                        <Text style={styles.label}>Email</Text>
                        <Text style={styles.value} numberOfLines={1}>
                          {item.user.email}
                        </Text>
                      </View>
                    )}
                    <View style={styles.row}>
                      <Text style={styles.label}>Payment ID</Text>
                      <Text style={styles.valueCode} numberOfLines={1}>
                        {item.id}
                      </Text>
                    </View>
                    {item.externalId && (
                      <View style={styles.row}>
                        <Text style={styles.label}>Stripe Session</Text>
                        <Text style={styles.valueCode} numberOfLines={1}>
                          {item.externalId}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.cardFooter}>
                    <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
                  </View>
                </Card>
              );
            })}

            {totalPages > 1 && (
              <View style={styles.pagination}>
                <Button
                  title="Previous"
                  onPress={() => fetchDisputes(page - 1)}
                  disabled={page <= 1}
                  variant="secondary"
                />
                <Text style={styles.pageText}>
                  Page {page} of {totalPages}
                </Text>
                <Button
                  title="Next"
                  onPress={() => fetchDisputes(page + 1)}
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
  errorCard: {
    marginTop: Spacing.lg,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.md,
  },
  summaryCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.error + '10',
    borderWidth: 1,
    borderColor: Colors.error + '40',
  },
  summaryValue: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.error,
    marginBottom: Spacing.xs,
  },
  summaryLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
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
  disputeCard: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  cardInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  amount: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.error,
    marginBottom: 2,
  },
  tournament: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    gap: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  label: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    width: 90,
    flexShrink: 0,
  },
  value: {
    fontSize: Typography.sizes.xs,
    color: Colors.text,
    flex: 1,
  },
  valueCode: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    flex: 1,
    fontFamily: 'monospace',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.xs,
    marginTop: Spacing.sm,
    alignItems: 'flex-end',
  },
  dateText: {
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
