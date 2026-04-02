import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeContainer, Header } from '../../../../components/layout';
import { Button, Card, Badge, LoadingSpinner } from '../../../../components/ui';
import { Colors } from '../../../../constants/colors';
import { Spacing } from '../../../../constants/spacing';
import { Typography } from '../../../../constants/typography';
import api from '../../../../lib/api';

interface Registration {
  id: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    rating: number;
    city?: string;
    phone?: string;
  };
}

const STATUS_BADGE_MAP: Record<string, { label: string; status: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  PENDING: { label: 'Pending', status: 'warning' },
  APPROVED: { label: 'Approved', status: 'success' },
  REJECTED: { label: 'Rejected', status: 'error' },
  PAID: { label: 'Paid', status: 'info' },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function RegistrationsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRegistrations = useCallback(async () => {
    if (!id) return;
    try {
      setError(null);
      const res = await api.get(`/tournaments/${id}/registrations`);
      const data = res.data;
      setRegistrations(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load registrations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRegistrations();
  }, [fetchRegistrations]);

  async function handleUpdateStatus(regId: string, status: string) {
    try {
      setUpdatingId(regId);
      await api.put(`/tournaments/${id}/registrations/${regId}`, { status });
      await fetchRegistrations();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        'Failed to update registration';
      Alert.alert('Error', message);
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <SafeContainer>
        <Header title="Registrations" showBack />
        <LoadingSpinner />
      </SafeContainer>
    );
  }

  return (
    <SafeContainer>
      <Header title="Registrations" showBack />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {error && (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Button title="Retry" onPress={fetchRegistrations} variant="secondary" />
          </Card>
        )}

        {!error && registrations.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No Registrations</Text>
            <Text style={styles.emptyText}>
              No one has registered for this tournament yet.
            </Text>
          </View>
        )}

        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            Total: {registrations.length} | Approved: {registrations.filter(r => r.status === 'APPROVED').length} | Pending: {registrations.filter(r => r.status === 'PENDING').length}
          </Text>
        </View>

        {registrations.map((reg) => {
          const badge = STATUS_BADGE_MAP[reg.status] || { label: reg.status, status: 'default' as const };
          const isUpdating = updatingId === reg.id;

          return (
            <Card key={reg.id} style={styles.regCard}>
              <View style={styles.regHeader}>
                <View style={styles.regInfo}>
                  <Text style={styles.regName}>{reg.user.name || reg.user.email}</Text>
                  <Text style={styles.regEmail}>{reg.user.email}</Text>
                  {reg.user.rating > 0 && (
                    <Text style={styles.regMeta}>Rating: {reg.user.rating}</Text>
                  )}
                  {reg.user.city && (
                    <Text style={styles.regMeta}>{reg.user.city}</Text>
                  )}
                  <Text style={styles.regDate}>Registered: {formatDate(reg.createdAt)}</Text>
                </View>
                <Badge label={badge.label} status={badge.status} />
              </View>

              {reg.status === 'PENDING' && (
                <View style={styles.actionRow}>
                  <Button
                    title="Approve"
                    onPress={() => handleUpdateStatus(reg.id, 'APPROVED')}
                    loading={isUpdating}
                    disabled={isUpdating}
                    style={styles.actionBtn}
                  />
                  <Button
                    title="Reject"
                    variant="danger"
                    onPress={() => handleUpdateStatus(reg.id, 'REJECTED')}
                    loading={isUpdating}
                    disabled={isUpdating}
                    style={styles.actionBtn}
                  />
                </View>
              )}

              {reg.status === 'APPROVED' && (
                <View style={styles.actionRow}>
                  <Button
                    title="Reject"
                    variant="danger"
                    onPress={() => handleUpdateStatus(reg.id, 'REJECTED')}
                    loading={isUpdating}
                    disabled={isUpdating}
                    style={styles.actionBtn}
                  />
                </View>
              )}

              {reg.status === 'REJECTED' && (
                <View style={styles.actionRow}>
                  <Button
                    title="Approve"
                    onPress={() => handleUpdateStatus(reg.id, 'APPROVED')}
                    loading={isUpdating}
                    disabled={isUpdating}
                    style={styles.actionBtn}
                  />
                </View>
              )}
            </Card>
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
    maxWidth: 430,
    alignSelf: 'center',
    width: '100%',
    paddingBottom: Spacing['4xl'],
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
  summary: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  summaryText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
  regCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
  },
  regHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  regInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  regName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  regEmail: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  regMeta: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  regDate: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  actionBtn: {
    flex: 1,
    minHeight: 40,
    paddingVertical: Spacing.sm,
  },
  footer: {
    height: Spacing['2xl'],
  },
});
