import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeContainer, Header } from '../../../components/layout';
import { Card, Button, Badge, LoadingSpinner } from '../../../components/ui';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import api from '../../../lib/api';

type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface OrgRequest {
  id: string;
  organizationName: string;
  contactName: string;
  email: string;
  phone?: string | null;
  description: string;
  status: RequestStatus;
  createdAt: string;
}

const STATUS_FILTERS: { label: string; value: RequestStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

const STATUS_BADGE: Record<RequestStatus, { label: string; status: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  PENDING:  { label: 'Pending',  status: 'warning' },
  APPROVED: { label: 'Approved', status: 'success' },
  REJECTED: { label: 'Rejected', status: 'error'   },
};

export default function AdminOrganizationsScreen() {
  const [requests, setRequests] = useState<OrgRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<RequestStatus | 'ALL'>('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setError(null);
      const params: Record<string, string> = {};
      if (filter !== 'ALL') params.status = filter;
      const res = await api.get('/organizations/requests', { params });
      const data = res.data?.data || res.data;
      setRequests(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load organization requests');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useEffect(() => {
    setLoading(true);
    fetchRequests();
  }, [fetchRequests]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRequests();
  }, [fetchRequests]);

  async function handleUpdateStatus(item: OrgRequest, status: 'APPROVED' | 'REJECTED') {
    const action = status === 'APPROVED' ? 'approve' : 'reject';
    Alert.alert(
      status === 'APPROVED' ? 'Approve Request' : 'Reject Request',
      `${status === 'APPROVED' ? 'Approve' : 'Reject'} request from ${item.organizationName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: status === 'APPROVED' ? 'Approve' : 'Reject',
          style: status === 'REJECTED' ? 'destructive' : 'default',
          onPress: async () => {
            setActionLoading(item.id);
            try {
              await api.put(`/organizations/requests/${item.id}`, { status });
              setRequests((prev) =>
                prev.map((r) => (r.id === item.id ? { ...r, status } : r))
              );
            } catch {
              Alert.alert('Error', `Failed to ${action} request. Please try again.`);
            } finally {
              setActionLoading(null);
            }
          },
        },
      ]
    );
  }

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  return (
    <SafeContainer>
      <Header title="Organization Requests" showBack />
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
        {/* Filter tabs */}
        <View style={styles.filterRow}>
          {STATUS_FILTERS.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[styles.filterTab, filter === f.value && styles.filterTabActive]}
              onPress={() => setFilter(f.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterTabText, filter === f.value && styles.filterTabTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading && <LoadingSpinner />}

        {error && !loading && (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Button title="Retry" onPress={fetchRequests} variant="secondary" />
          </Card>
        )}

        {!loading && !error && requests.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No Requests</Text>
            <Text style={styles.emptyText}>
              {filter === 'ALL' ? 'No organization requests yet.' : `No ${filter.toLowerCase()} requests.`}
            </Text>
          </View>
        )}

        {!loading &&
          requests.map((item) => {
            const badge = STATUS_BADGE[item.status] || STATUS_BADGE.PENDING;
            const isPending = item.status === 'PENDING';
            return (
              <Card key={item.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.orgName}>{item.organizationName}</Text>
                    <Text style={styles.contactName}>{item.contactName}</Text>
                    <Text style={styles.metaText}>{item.email}</Text>
                    {item.phone ? <Text style={styles.metaText}>{item.phone}</Text> : null}
                    <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
                  </View>
                  <Badge label={badge.label} status={badge.status} />
                </View>

                <Text style={styles.descriptionLabel}>Description:</Text>
                <Text style={styles.descriptionText}>{item.description}</Text>

                {isPending && (
                  <View style={styles.actions}>
                    <Button
                      title="Approve"
                      onPress={() => handleUpdateStatus(item, 'APPROVED')}
                      loading={actionLoading === item.id}
                      style={styles.approveBtn}
                    />
                    <Button
                      title="Reject"
                      onPress={() => handleUpdateStatus(item, 'REJECTED')}
                      variant="danger"
                      disabled={actionLoading === item.id}
                      style={styles.rejectBtn}
                    />
                  </View>
                )}
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
    maxWidth: 430,
    alignSelf: 'center',
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
    color: '#FFFFFF',
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
  itemCard: {
    marginBottom: Spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  itemInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  orgName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  contactName: {
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  metaText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  dateText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  descriptionLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  descriptionText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    lineHeight: Typography.sizes.sm * Typography.lineHeights.normal,
    marginBottom: Spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
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
