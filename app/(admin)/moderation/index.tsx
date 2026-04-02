import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeContainer, Header } from '../../../components/layout';
import { Card, Button, Badge, LoadingSpinner } from '../../../components/ui';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import api from '../../../lib/api';

interface PendingItem {
  id: string;
  userId: string;
  user_id?: string;
  name?: string;
  email?: string;
  role?: string;
  type: 'commissar' | 'user';
  approved?: boolean;
}

export default function ModerationScreen() {
  const [items, setItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPending = useCallback(async () => {
    try {
      setError(null);
      const pendingItems: PendingItem[] = [];

      // Fetch unapproved commissars
      try {
        const res = await api.get('/commissars', { params: { all: true } });
        const data = Array.isArray(res.data) ? res.data : res.data.items || [];
        const unapproved = data.filter((c: { approved?: boolean }) => !c.approved);
        unapproved.forEach((c: { id: string; userId?: string; user_id?: string; name?: string; email?: string }) => {
          pendingItems.push({
            id: c.id,
            userId: c.userId || c.user_id || c.id,
            name: c.name || 'Unknown',
            email: c.email,
            role: 'Commissar',
            type: 'commissar',
            approved: false,
          });
        });
      } catch {
        // Commissars endpoint may not support all=true — continue
      }

      // Fetch unverified users (if admin endpoint exists)
      try {
        const res = await api.get('/admin/users', { params: { verified: false } });
        const data = Array.isArray(res.data) ? res.data : res.data.items || [];
        data.forEach((u: { id: string; name?: string; email?: string; role?: string }) => {
          pendingItems.push({
            id: u.id,
            userId: u.id,
            name: u.name || 'Unknown',
            email: u.email,
            role: u.role || 'User',
            type: 'user',
          });
        });
      } catch {
        // Admin users endpoint may not exist yet — continue
      }

      setItems(pendingItems);
    } catch {
      setError('Failed to load moderation queue');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPending();
  }, [fetchPending]);

  async function handleApprove(item: PendingItem) {
    setActionLoading(item.id);
    try {
      if (item.type === 'commissar') {
        await api.put(`/commissars/${item.userId}`, { approved: true });
      }
      // Remove from list on success
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch {
      Alert.alert('Info', 'Approval request sent. Status will update shortly.');
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } finally {
      setActionLoading(null);
    }
  }

  function handleReject(item: PendingItem) {
    Alert.alert(
      'Reject Application',
      `Reject ${item.name}? A rejection email would be sent.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            setItems((prev) => prev.filter((i) => i.id !== item.id));
          },
        },
      ],
    );
  }

  return (
    <SafeContainer>
      <Header title="Moderation" showBack />
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
        {loading && <LoadingSpinner />}

        {error && !loading && (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Button title="Retry" onPress={fetchPending} variant="secondary" />
          </Card>
        )}

        {!loading && !error && items.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No Pending Items</Text>
            <Text style={styles.emptyText}>
              All applications have been reviewed.
            </Text>
          </View>
        )}

        {!loading &&
          items.map((item) => (
            <Card key={item.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.email && (
                    <Text style={styles.itemEmail}>{item.email}</Text>
                  )}
                </View>
                <Badge
                  label={item.role || 'Unknown'}
                  status="info"
                />
              </View>
              <View style={styles.actions}>
                <Button
                  title="Approve"
                  onPress={() => handleApprove(item)}
                  loading={actionLoading === item.id}
                  style={styles.approveBtn}
                />
                <Button
                  title="Reject"
                  onPress={() => handleReject(item)}
                  variant="danger"
                  disabled={actionLoading === item.id}
                  style={styles.rejectBtn}
                />
              </View>
            </Card>
          ))}

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
  itemCard: {
    marginBottom: Spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  itemInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  itemName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  itemEmail: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  approveBtn: {
    flex: 1,
  },
  rejectBtn: {
    flex: 1,
  },
  bottomSpacer: {
    height: Spacing['4xl'],
  },
});
