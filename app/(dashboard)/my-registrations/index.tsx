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
import { Card, Badge, LoadingSpinner, EmptyState } from '../../../components/ui';
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
  // NOTE: the API can return status='EXPIRED' (set by the checkout.session.expired webhook
  // when a Stripe Checkout session times out without payment). The union type here only
  // lists the statuses the UI explicitly handles — EXPIRED is missing intentionally
  // until the badge map below is updated. At runtime, an EXPIRED registration will
  // still render correctly via the REG_STATUS_BADGE fallback (unstyled grey badge).
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID' | 'EXPIRED';
  id: string;
  createdAt: string;
  tournament: RegistrationTournament;
}

/**
 * Badge display config for each registration status.
 *
 * KNOWN GAP — EXPIRED status is not mapped here.
 * When the checkout.session.expired webhook fires, Registration.status is set to EXPIRED
 * (see api/src/routes/payments.ts → checkout.session.expired handler).
 * Because EXPIRED has no entry in this map, it falls back to:
 *   { label: 'EXPIRED', status: 'default' }  — an unstyled grey badge.
 * This is functional but not ideal UX. To fix: add an EXPIRED entry with status: 'error'
 * and label: 'Payment Expired'. Tracked as a separate UI task.
 */
const REG_STATUS_BADGE: Record<string, { label: string; status: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  PENDING: { label: 'Pending', status: 'warning' },
  APPROVED: { label: 'Approved', status: 'success' },
  REJECTED: { label: 'Rejected', status: 'error' },
  PAID: { label: 'Paid', status: 'success' },
  // EXPIRED intentionally omitted — see JSDoc above
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {loading && <LoadingSpinner />}

        {error && !loading && (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!loading && !error && items.length === 0 && (
          <EmptyState
            icon="♟"
            title="No Registrations"
            subtitle="You haven't registered for any tournaments yet. Browse tournaments and apply!"
          />
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
    color: Colors.error,
    fontSize: Typography.sizes.sm,
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
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  footerLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
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
