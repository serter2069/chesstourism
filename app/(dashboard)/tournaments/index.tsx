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

interface TournamentRegistration {
  id: string;
  tournamentId: string;
  status: string;
  paid: boolean;
  place: number | null;
  eloChange: number | null;
  eloBefore: number | null;
  eloAfter: number | null;
  tournament: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    city: string;
    country: string;
    status: string;
  };
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatEloChange(before: number | null, after: number | null): string {
  if (before == null || after == null) return '-';
  const diff = after - before;
  const sign = diff >= 0 ? '+' : '';
  return `${before} -> ${after} (${sign}${diff})`;
}

export default function MyTournamentsScreen() {
  const [registrations, setRegistrations] = useState<TournamentRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get('/users/me/tournaments');
      const items: TournamentRegistration[] = Array.isArray(res.data)
        ? res.data
        : res.data.items || [];
      // Sort by start date descending (newest first)
      items.sort(
        (a, b) => new Date(b.tournament.startDate).getTime() - new Date(a.tournament.startDate).getTime(),
      );
      setRegistrations(items);
    } catch {
      setError('Failed to load your tournaments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  return (
    <SafeContainer>
      <Header title="My Tournaments" showBack />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brandPrimary} />
        }
      >
        {loading && <LoadingSpinner />}

        {error && !loading && (
          <View style={styles.section}>
            <Card>
              <Text style={styles.errorText}>{error}</Text>
              <Button title="Retry" onPress={fetchData} variant="secondary" />
            </Card>
          </View>
        )}

        {!loading && !error && registrations.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{'\u265E'}</Text>
            <Text style={styles.emptyTitle}>No Tournaments Yet</Text>
            <Text style={styles.emptyText}>Register for a tournament to see your history here.</Text>
          </View>
        )}

        {!loading &&
          registrations.map((reg) => (
            <View key={reg.id} style={styles.section}>
              <Card>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {reg.tournament.title}
                  </Text>
                  <Badge
                    label={reg.paid ? 'Paid' : 'Unpaid'}
                    status={reg.paid ? 'success' : 'warning'}
                  />
                </View>

                <View style={styles.metaBlock}>
                  <Text style={styles.metaText}>
                    {formatDate(reg.tournament.startDate)} - {formatDate(reg.tournament.endDate)}
                  </Text>
                  <Text style={styles.metaText}>
                    {reg.tournament.city}, {reg.tournament.country}
                  </Text>
                </View>

                <View style={styles.detailsRow}>
                  {reg.place != null && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Place</Text>
                      <Text style={styles.detailValue}>#{reg.place}</Text>
                    </View>
                  )}
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>ELO Change</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        reg.eloAfter != null && reg.eloBefore != null
                          ? (reg.eloAfter - reg.eloBefore) >= 0
                            ? { color: Colors.statusSuccess }
                            : { color: Colors.statusError }
                          : {},
                      ]}
                    >
                      {formatEloChange(reg.eloBefore, reg.eloAfter)}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <Text style={styles.detailValue}>{reg.tournament.status.replace(/_/g, ' ')}</Text>
                  </View>
                </View>
              </Card>
            </View>
          ))}

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
  section: {
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
  metaBlock: {
    marginBottom: Spacing.md,
  },
  metaText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDefault,
    paddingTop: Spacing.sm,
  },
  detailItem: {},
  detailLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    fontWeight: Typography.weights.medium,
  },
  // Empty state
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
  errorText: {
    color: Colors.statusError,
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.md,
  },
  footer: {
    height: Spacing['2xl'],
  },
});
