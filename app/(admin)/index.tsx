import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeContainer, Header } from '../../components/layout';
import { Card, LoadingSpinner } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import api from '../../lib/api';

interface Stats {
  totalUsers: number;
  totalTournaments: number;
  totalRegistrations: number;
  totalRevenue: number;
  pendingOrgRequests: number;
}

interface QuickLink {
  title: string;
  description: string;
  href: string;
  badgeCount?: number;
}

export default function AdminDashboardScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchStats() {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch {
      // Stats fetch failed — show zeroes
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  function onRefresh() {
    setRefreshing(true);
    fetchStats();
  }

  const quickLinks: QuickLink[] = [
    {
      title: 'Moderation',
      description: 'Review pending applications',
      href: '/(admin)/moderation',
    },
    {
      title: 'Users',
      description: 'Manage user accounts and roles',
      href: '/(admin)/users',
    },
    {
      title: 'Tournaments',
      description: 'View all tournaments',
      href: '/(admin)/tournaments',
    },
    {
      title: 'Finances',
      description: 'Payments and reports',
      href: '/(admin)/finances',
    },
    {
      title: 'Organizations',
      description: 'Tournament requests from organizations',
      href: '/(admin)/organizations',
      badgeCount: stats?.pendingOrgRequests || 0,
    },
    {
      title: 'Webhook Events',
      description: 'Stripe webhook event log and retry',
      href: '/(admin)/webhooks',
    },
  ];

  return (
    <SafeContainer>
      <Header title="Admin Dashboard" showBack />
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
        {/* Stats */}
        <Text style={styles.sectionTitle}>Overview</Text>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <View style={styles.statsRow}>
              <Card style={styles.statCard}>
                <Text style={styles.statValueGold}>{stats?.totalUsers ?? 0}</Text>
                <Text style={styles.statLabel}>Users</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text style={styles.statValueGold}>{stats?.totalTournaments ?? 0}</Text>
                <Text style={styles.statLabel}>Tournaments</Text>
              </Card>
            </View>
            <View style={styles.statsRow}>
              <Card style={styles.statCard}>
                <Text style={styles.statValueGold}>{stats?.totalRegistrations ?? 0}</Text>
                <Text style={styles.statLabel}>Registrations</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text style={styles.statValueGold}>
                  ${stats?.totalRevenue?.toFixed(0) ?? '0'}
                </Text>
                <Text style={styles.statLabel}>Revenue</Text>
              </Card>
            </View>
            {(stats?.pendingOrgRequests ?? 0) > 0 && (
              <Card style={styles.alertCard}>
                <Text style={styles.alertText}>
                  {stats!.pendingOrgRequests} pending organization request{stats!.pendingOrgRequests > 1 ? 's' : ''}
                </Text>
              </Card>
            )}
          </>
        )}

        {/* Quick Links */}
        <Text style={styles.sectionTitle}>Quick Links</Text>
        {quickLinks.map((link) => (
          <TouchableOpacity
            key={link.href}
            onPress={() => router.push(link.href as never)}
            activeOpacity={0.7}
            style={styles.linkWrapper}
          >
            <Card style={styles.linkCard}>
              <View style={styles.linkContent}>
                <View style={styles.linkText}>
                  <Text style={styles.linkTitle}>{link.title}</Text>
                  <Text style={styles.linkDescription}>{link.description}</Text>
                </View>
                <View style={styles.linkRight}>
                  {(link.badgeCount ?? 0) > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{link.badgeCount}</Text>
                    </View>
                  )}
                  <Text style={styles.linkArrow}>{'>'}</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
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
    maxWidth: 430,
    alignSelf: 'center' as const,
    width: '100%',
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.primary,
  },
  statValueGold: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.gold,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.white,
  },
  alertCard: {
    backgroundColor: Colors.gold + '15',
    borderWidth: 1,
    borderColor: Colors.gold,
    marginBottom: Spacing.md,
  },
  alertText: {
    fontSize: Typography.sizes.sm,
    color: Colors.gold,
    fontWeight: Typography.weights.semibold,
    textAlign: 'center',
  },
  linkWrapper: {
    marginBottom: Spacing.sm,
  },
  linkCard: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  linkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkText: {
    flex: 1,
  },
  linkRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  linkTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  linkDescription: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  linkArrow: {
    fontSize: Typography.sizes.lg,
    color: Colors.textMuted,
  },
  badge: {
    backgroundColor: Colors.gold,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
  },
  bottomSpacer: {
    height: Spacing['4xl'],
  },
});
