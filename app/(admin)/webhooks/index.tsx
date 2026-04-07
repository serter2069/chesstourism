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
import { useRouter } from 'expo-router';
import { SafeContainer, Header } from '../../../components/layout';
import { Card, Badge, LoadingSpinner, Button } from '../../../components/ui';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import api from '../../../lib/api';

// ── Types ───────────────────────────────────────────────

interface WebhookEvent {
  id: string;
  stripeEventId: string;
  eventType: string | null;
  status: string;
  processedAt: string;
  errorMessage: string | null;
  rawRef: string | null;
}

interface WebhookResponse {
  items: WebhookEvent[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

// ── Constants ───────────────────────────────────────────

type StatusFilter = 'all' | 'processed' | 'failed' | 'pending';

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Processed', value: 'processed' },
  { label: 'Failed', value: 'failed' },
  { label: 'Pending', value: 'pending' },
];

const STATUS_BADGE: Record<string, { label: string; status: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  processed: { label: 'Processed', status: 'success' },
  failed: { label: 'Failed', status: 'error' },
  pending: { label: 'Pending', status: 'warning' },
};

// ── Helpers ─────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

// ── Component ───────────────────────────────────────────

export default function AdminWebhooksScreen() {
  const router = useRouter();
  const [items, setItems] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchWebhooks = useCallback(async (p = 1) => {
    try {
      setError(null);
      const params: Record<string, string | number> = { page: p, limit: 20 };
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await api.get<WebhookResponse>('/admin/webhooks', { params });
      setItems(res.data.items || []);
      setPage(res.data.pagination?.page || 1);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch {
      setError('Failed to load webhook events');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    setLoading(true);
    fetchWebhooks(1);
  }, [fetchWebhooks]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWebhooks(1);
  }, [fetchWebhooks]);

  return (
    <SafeContainer>
      <Header title="Webhook Events" showBack />
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
        {/* Status filter tabs */}
        <View style={styles.filterRow}>
          {STATUS_FILTERS.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[styles.filterTab, statusFilter === f.value && styles.filterTabActive]}
              onPress={() => setStatusFilter(f.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterTabText, statusFilter === f.value && styles.filterTabTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading && <LoadingSpinner />}

        {error && !loading && (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Button title="Retry" onPress={() => fetchWebhooks(1)} variant="secondary" />
          </Card>
        )}

        {!loading && !error && items.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No Events</Text>
            <Text style={styles.emptyText}>No webhook events found for the selected filter.</Text>
          </View>
        )}

        {!loading && !error && items.map((item) => {
          const badge = STATUS_BADGE[item.status] || { label: item.status, status: 'default' as const };
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(`/(admin)/webhooks/${item.id}` as never)}
              activeOpacity={0.7}
            >
              <Card style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventType} numberOfLines={1}>
                    {item.eventType || 'unknown'}
                  </Text>
                  <Badge label={badge.label} status={badge.status} />
                </View>
                <Text style={styles.eventId} numberOfLines={1}>
                  {item.stripeEventId}
                </Text>
                {item.errorMessage && (
                  <Text style={styles.errorMsg} numberOfLines={2}>
                    {item.errorMessage}
                  </Text>
                )}
                <View style={styles.eventFooter}>
                  <Text style={styles.eventDate}>{formatDate(item.processedAt)}</Text>
                  <Text style={styles.detailLink}>View details {'>'}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}

        {totalPages > 1 && (
          <View style={styles.pagination}>
            <Button
              title="Previous"
              onPress={() => fetchWebhooks(page - 1)}
              disabled={page <= 1}
              variant="secondary"
            />
            <Text style={styles.pageText}>
              Page {page} of {totalPages}
            </Text>
            <Button
              title="Next"
              onPress={() => fetchWebhooks(page + 1)}
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
  eventCard: {
    marginBottom: Spacing.md,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  eventType: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  eventId: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
    fontFamily: 'monospace',
  },
  errorMsg: {
    fontSize: Typography.sizes.xs,
    color: Colors.error,
    marginBottom: Spacing.xs,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.xs,
    marginTop: Spacing.xs,
  },
  eventDate: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  detailLink: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
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
