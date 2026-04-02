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
import { Button, Card, Badge, LoadingSpinner } from '../../../components/ui';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import { useAuth } from '../../../store/auth';
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
  commissarId?: string;
  commissar_id?: string;
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

export default function CommissarTournamentsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTournaments = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await api.get('/tournaments');
      const data = res.data;
      const items: Tournament[] = Array.isArray(data) ? data : data.items || data.tournaments || [];

      // Filter by commissar — client-side since API may not support commissar=me
      const mine = items.filter(
        (t) => (t.commissarId || t.commissar_id) === user?.id,
      );
      setTournaments(mine);
    } catch {
      setError('Failed to load tournaments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTournaments();
  }, [fetchTournaments]);

  return (
    <SafeContainer>
      <Header title="My Tournaments" showBack />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Create button */}
        <View style={styles.createRow}>
          <Button
            title="Create Tournament"
            onPress={() => router.push('/(dashboard)/tournaments/create' as never)}
          />
        </View>

        {loading && <LoadingSpinner />}

        {error && !loading && (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Button title="Retry" onPress={fetchTournaments} variant="secondary" />
          </Card>
        )}

        {!loading && !error && tournaments.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No Tournaments Yet</Text>
            <Text style={styles.emptyText}>
              Create your first tournament to get started.
            </Text>
          </View>
        )}

        {!loading &&
          tournaments.map((t) => {
            const badge = STATUS_BADGE[t.status] || { label: t.status, status: 'default' as const };
            return (
              <TouchableOpacity
                key={t.id}
                onPress={() => router.push(`/(dashboard)/tournaments/${t.id}/edit` as never)}
                activeOpacity={0.7}
                style={styles.cardWrapper}
              >
                <Card>
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
  },
  createRow: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  errorCard: {
    marginHorizontal: Spacing.lg,
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
  footer: {
    height: Spacing['2xl'],
  },
});
