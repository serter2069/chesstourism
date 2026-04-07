import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeContainer, Header } from '../../../components/layout';
import { Card, Badge, LoadingSpinner, Button } from '../../../components/ui';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import api from '../../../lib/api';

// ── Types ───────────────────────────────────────────────

interface WebhookEventDetail {
  id: string;
  stripeEventId: string;
  eventType: string | null;
  status: string;
  processedAt: string;
  errorMessage: string | null;
  rawRef: string | null;
}

// ── Constants ───────────────────────────────────────────

const STATUS_BADGE: Record<string, { label: string; status: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  processed: { label: 'Processed', status: 'success' },
  failed: { label: 'Failed', status: 'error' },
  pending: { label: 'Pending', status: 'warning' },
};

// ── Helpers ─────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ── Component ───────────────────────────────────────────

export default function AdminWebhookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<WebhookEventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    if (!id) return;
    try {
      setError(null);
      const res = await api.get<WebhookEventDetail>(`/admin/webhooks/${id}`);
      setEvent(res.data);
    } catch {
      setError('Failed to load webhook event');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEvent();
  }, [fetchEvent]);

  const handleRetry = useCallback(async () => {
    if (!id || !event) return;
    const confirm = () => new Promise<boolean>((resolve) => {
      if (Platform.OS === 'web') {
        resolve(window.confirm('Mark this event as pending for retry?'));
      } else {
        Alert.alert('Retry Event', 'Mark this event as pending for retry?', [
          { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
          { text: 'Retry', style: 'default', onPress: () => resolve(true) },
        ]);
      }
    });

    const ok = await confirm();
    if (!ok) return;

    try {
      setRetrying(true);
      const res = await api.patch<WebhookEventDetail>(`/admin/webhooks/${id}/retry`);
      setEvent(res.data);
    } catch {
      if (Platform.OS === 'web') {
        window.alert('Failed to mark event for retry');
      } else {
        Alert.alert('Error', 'Failed to mark event for retry');
      }
    } finally {
      setRetrying(false);
    }
  }, [id, event]);

  const badge = event ? (STATUS_BADGE[event.status] || { label: event.status, status: 'default' as const }) : null;

  return (
    <SafeContainer>
      <Header title="Webhook Detail" showBack />
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
            <Button title="Retry" onPress={fetchEvent} variant="secondary" />
          </Card>
        )}

        {!loading && !error && event && badge && (
          <>
            {/* Status + type */}
            <Card style={styles.headerCard}>
              <View style={styles.statusRow}>
                <Text style={styles.eventType}>{event.eventType || 'unknown'}</Text>
                <Badge label={badge.label} status={badge.status} />
              </View>
              <Text style={styles.timestamp}>{formatDate(event.processedAt)}</Text>
            </Card>

            {/* IDs */}
            <Card style={styles.section}>
              <Text style={styles.fieldLabel}>Internal ID</Text>
              <Text style={styles.fieldValue}>{event.id}</Text>
              <View style={styles.divider} />
              <Text style={styles.fieldLabel}>Stripe Event ID</Text>
              <Text style={styles.fieldValue}>{event.stripeEventId}</Text>
              {event.rawRef && (
                <>
                  <View style={styles.divider} />
                  <Text style={styles.fieldLabel}>Raw Ref</Text>
                  <Text style={styles.fieldValue}>{event.rawRef}</Text>
                </>
              )}
            </Card>

            {/* Error message */}
            {event.errorMessage && (
              <Card style={[styles.section, styles.errorSection]}>
                <Text style={styles.fieldLabel}>Error</Text>
                <Text style={styles.errorMsg}>{event.errorMessage}</Text>
              </Card>
            )}

            {/* Retry button — only for failed events */}
            {event.status === 'failed' && (
              <Button
                title={retrying ? 'Marking for retry...' : 'Mark for Retry'}
                onPress={handleRetry}
                disabled={retrying}
                variant="primary"
                style={styles.retryBtn}
              />
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
  headerCard: {
    marginBottom: Spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  eventType: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  timestamp: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  section: {
    marginBottom: Spacing.md,
  },
  errorSection: {
    borderWidth: 1,
    borderColor: Colors.error + '40',
  },
  fieldLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  fieldValue: {
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    fontFamily: 'monospace',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  errorMsg: {
    fontSize: Typography.sizes.sm,
    color: Colors.error,
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  bottomSpacer: {
    height: Spacing['4xl'],
  },
});
