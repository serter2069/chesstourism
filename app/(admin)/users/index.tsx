import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeContainer, Header } from '../../../components/layout';
import { Card, Badge, LoadingSpinner, Button } from '../../../components/ui';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import { useAuth } from '../../../store/auth';
import api from '../../../lib/api';

interface UserItem {
  id: string;
  email: string;
  name: string | null;
  role: string;
  city: string | null;
  rating: number;
  fideId: string | null;
  fideRating: number | null;
  fideTitle: string | null;
  createdAt: string;
}

type RoleFilter = 'ALL' | 'PARTICIPANT' | 'COMMISSIONER' | 'ADMIN';

const ROLE_FILTERS: { label: string; value: RoleFilter }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Participants', value: 'PARTICIPANT' },
  { label: 'Commissioners', value: 'COMMISSIONER' },
  { label: 'Admins', value: 'ADMIN' },
];

const ROLE_BADGE: Record<string, { label: string; status: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  PARTICIPANT: { label: 'Participant', status: 'default' },
  COMMISSIONER: { label: 'Commissioner', status: 'info' },
  ADMIN: { label: 'Admin', status: 'warning' },
};

const ROLE_OPTIONS = ['PARTICIPANT', 'COMMISSIONER', 'ADMIN'] as const;

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminUsersScreen() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<RoleFilter>('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleChangeLoading, setRoleChangeLoading] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const fetchUsers = useCallback(async (p = 1) => {
    try {
      setError(null);
      const params: Record<string, string | number> = { page: p, limit: 20 };
      if (filter !== 'ALL') params.role = filter;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/admin/users', { params });
      const data = res.data;
      setUsers(data.items || []);
      setPage(data.pagination?.page || 1);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter, search]);

  useEffect(() => {
    setLoading(true);
    fetchUsers(1);
  }, [fetchUsers]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUsers(1);
  }, [fetchUsers]);

  function handleRoleChange(user: UserItem, newRole: string) {
    if (user.id === currentUser?.id && newRole !== 'ADMIN') {
      Alert.alert('Error', 'Cannot remove your own admin role.');
      return;
    }

    if (user.role === newRole) return;

    Alert.alert(
      'Change Role',
      `Change ${user.name || user.email} from ${user.role} to ${newRole}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setRoleChangeLoading(user.id);
            try {
              const res = await api.put(`/admin/users/${user.id}/role`, { role: newRole });
              setUsers((prev) =>
                prev.map((u) => (u.id === user.id ? { ...u, role: res.data.role } : u))
              );
              setExpandedUser(null);
            } catch (err: any) {
              const msg = err.response?.data?.error || 'Failed to change role';
              Alert.alert('Error', msg);
            } finally {
              setRoleChangeLoading(null);
            }
          },
        },
      ]
    );
  }

  return (
    <SafeContainer>
      <Header title="Users" showBack />
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
        {/* Search */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or email..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={() => { setLoading(true); fetchUsers(1); }}
          returnKeyType="search"
          autoCapitalize="none"
        />

        {/* Role filter tabs */}
        <View style={styles.filterRow}>
          {ROLE_FILTERS.map((f) => (
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
            <Button title="Retry" onPress={() => fetchUsers(1)} variant="secondary" />
          </Card>
        )}

        {!loading && !error && users.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No Users Found</Text>
            <Text style={styles.emptyText}>
              {search ? 'Try a different search term.' : 'No users match the selected filter.'}
            </Text>
          </View>
        )}

        {!loading &&
          users.map((u) => {
            const badge = ROLE_BADGE[u.role] || ROLE_BADGE.PARTICIPANT;
            const isExpanded = expandedUser === u.id;
            const isSelf = u.id === currentUser?.id;
            return (
              <Card key={u.id} style={styles.userCard}>
                <View style={styles.userHeader}>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                      {u.name || 'No name'}{isSelf ? ' (you)' : ''}
                    </Text>
                    <Text style={styles.userEmail}>{u.email}</Text>
                    {u.city && <Text style={styles.userMeta}>{u.city}</Text>}
                    <Text style={styles.userDate}>Joined {formatDate(u.createdAt)}</Text>
                  </View>
                  <Badge label={badge.label} status={badge.status} />
                </View>

                {(u.fideId || u.fideRating) && (
                  <View style={styles.fideRow}>
                    {u.fideId && <Text style={styles.fideText}>FIDE: {u.fideId}</Text>}
                    {u.fideRating && <Text style={styles.fideText}>Rating: {u.fideRating}</Text>}
                    {u.fideTitle && <Text style={styles.fideText}>{u.fideTitle}</Text>}
                  </View>
                )}

                <TouchableOpacity
                  style={styles.roleChangeBtn}
                  onPress={() => setExpandedUser(isExpanded ? null : u.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.roleChangeBtnText}>
                    {isExpanded ? 'Cancel' : 'Change Role'}
                  </Text>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.roleOptions}>
                    {ROLE_OPTIONS.map((role) => {
                      const isCurrentRole = u.role === role;
                      const disabled = (isSelf && role !== 'ADMIN') || roleChangeLoading === u.id;
                      return (
                        <TouchableOpacity
                          key={role}
                          style={[
                            styles.roleOption,
                            isCurrentRole && styles.roleOptionActive,
                            disabled && styles.roleOptionDisabled,
                          ]}
                          onPress={() => !disabled && handleRoleChange(u, role)}
                          activeOpacity={disabled ? 1 : 0.7}
                          disabled={disabled}
                        >
                          <Text
                            style={[
                              styles.roleOptionText,
                              isCurrentRole && styles.roleOptionTextActive,
                              disabled && !isCurrentRole && styles.roleOptionTextDisabled,
                            ]}
                          >
                            {role}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </Card>
            );
          })}

        {!loading && totalPages > 1 && (
          <View style={styles.pagination}>
            <Button
              title="Previous"
              onPress={() => fetchUsers(page - 1)}
              disabled={page <= 1}
              variant="secondary"
            />
            <Text style={styles.pageText}>
              Page {page} of {totalPages}
            </Text>
            <Button
              title="Next"
              onPress={() => fetchUsers(page + 1)}
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
  searchInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.sizes.base,
    color: Colors.text,
    marginBottom: Spacing.md,
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
  userCard: {
    marginBottom: Spacing.md,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  userInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  userName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  userMeta: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  userDate: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  fideRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  fideText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  roleChangeBtn: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
  },
  roleChangeBtnText: {
    fontSize: Typography.sizes.sm,
    color: Colors.gold,
    fontWeight: Typography.weights.semibold,
    textAlign: 'center',
  },
  roleOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    justifyContent: 'center',
  },
  roleOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundAlt,
  },
  roleOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  roleOptionDisabled: {
    opacity: 0.4,
  },
  roleOptionText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
  roleOptionTextActive: {
    color: Colors.white,
  },
  roleOptionTextDisabled: {
    color: Colors.textMuted,
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
