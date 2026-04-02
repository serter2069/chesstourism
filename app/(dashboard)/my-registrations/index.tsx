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
import { Card, Badge, LoadingSpinner } from '../../../components/ui';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import api from '../../../lib/api';

interface RegistrationTournament {
  id: string;
  title: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface Registration {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  createdAt: string;
  tournament: RegistrationTournament;
}

const REG_STATUS_BADGE: Record<string, { label: string; status: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  PENDING: { label: 'Pending', status: 'warning' },
  APPROVED: { label: 'Approved', status: 'success' },
  REJECTED: { label: 'Rejected', status: 'error' },
  PAID: { label: 'Paid', status: 'success' },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function MyRegistrationsScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRegistrations = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get('/my-registrations');
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load registrations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRegistrations();
  }, [fetchRegistrations]);

  return (
    <SafeContainer>
      <Header title="My Registrations" showBack />
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
            <Text style={styles.emptyTitle}>No Registrations</Text>
            <Text style={styles.emptyText}>
              You haven't registered for any tournaments yet. Browse tournaments and apply!
            </Text>
          </View>
        )}

        {!loading && items.map((reg) => {
          const t = reg.tournament;
          const regBadge = REG_STATUS_BADGE[reg.status] || { label: reg.status, status: 'default' as const };
          return (
            <TouchableOpacity
              key={reg.id}
              onPress={() => router.push(`/tournaments/${t.id}`)}
              activeOpacity={0.7}
              style={styles.cardWrapper}
            >
              <Card>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{t.title}</Text>
                  <Badge label={regBadge.label} status={regBadge.status} />
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
                  <Text style={styles.footerLabel}>Applied</Text>
                  <Text style={styles.footerValue}>{formatDate(reg.createdAt)}</Text>
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
    maxWidth: 430,
    alignSelf: 'center' as const,
    width: '100%' as unknown as number,
  },
  errorWrap: {
    padding: Spacing.lg,
  },
  errorText: {
    color: Colors.statusError,
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
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
