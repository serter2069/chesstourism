import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
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
  format: string;
  status: string;
  commissarName?: string;
  commissar?: { name?: string; surname?: string };
  _count?: { participants: number };
}

const STATUS_BADGE: Record<string, { label: string; status: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  DRAFT: { label: 'Draft', status: 'default' },
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
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTournaments = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get('/admin/tournaments');
      const data = res.data;
      const items: Tournament[] = Array.isArray(data)
        ? data
        : data.items || data.tournaments || [];
      setTournaments(items);
    } catch {
      setError('Failed to load tournaments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTournaments();
  }, [fetchTournaments]);

  function getCommissarName(t: Tournament): string {
    if (t.commissarName) return t.commissarName;
    if (t.commissar) {
      const parts = [t.commissar.name, t.commissar.surname].filter(Boolean);
      return parts.length > 0 ? parts.join(' ') : 'Assigned';
    }
    return 'Unassigned';
  }

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
            tintColor={Colors.brandPrimary}
          />
        }
      >
        {/* Summary */}
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {loading ? '...' : tournaments.length}
          </Text>
          <Text style={styles.summaryLabel}>Total Tournaments</Text>
        </Card>

        {loading && <LoadingSpinner />}

        {error && !loading && (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Button title="Retry" onPress={fetchTournaments} variant="secondary" />
          </Card>
        )}

        {!loading && !error && tournaments.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No Tournaments</Text>
            <Text style={styles.emptyText}>
              No tournaments have been created yet.
            </Text>
          </View>
        )}

        {!loading &&
          tournaments.map((t) => {
            const badge = STATUS_BADGE[t.status] || { label: t.status, status: 'default' as const };
            return (
              <Card key={t.id} style={styles.tournamentCard}>
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
                    <Text style={styles.footerValue}>{getCommissarName(t)}</Text>
                  </View>
                  <View style={styles.footerItem}>
                    <Text style={styles.footerLabel}>Format</Text>
                    <Text style={styles.footerValue}>{t.format}</Text>
                  </View>
                  {t._count?.participants != null && (
                    <View style={styles.footerItem}>
                      <Text style={styles.footerLabel}>Players</Text>
                      <Text style={styles.footerValue}>{t._count.participants}</Text>
                    </View>
                  )}
                </View>
              </Card>
            );
          })}

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
  },
  summaryCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  summaryValue: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.brandPrimary,
    marginBottom: Spacing.xs,
  },
  summaryLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  errorCard: {
    marginTop: Spacing.lg,
  },
  errorText: {
    color: Colors.statusError,
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
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
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
  bottomSpacer: {
    height: Spacing['4xl'],
  },
});
