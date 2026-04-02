import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeContainer, Header } from '../../components/layout';
import { Card, LoadingSpinner } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import api from '../../lib/api';

interface Stats {
  totalTournaments: number;
  totalUsers: string;
  tournamentsLoading: boolean;
}

interface QuickLink {
  title: string;
  description: string;
  href: string;
}

const quickLinks: QuickLink[] = [
  {
    title: 'Moderation',
    description: 'Review pending applications',
    href: '/(admin)/moderation',
  },
  {
    title: 'Users',
    description: 'Manage user accounts',
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
  },
];

export default function AdminDashboardScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalTournaments: 0,
    totalUsers: 'Coming soon',
    tournamentsLoading: true,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get('/admin/tournaments');
        const data = res.data;
        const items = Array.isArray(data) ? data : data.items || data.tournaments || [];
        setStats((prev) => ({
          ...prev,
          totalTournaments: items.length,
          tournamentsLoading: false,
        }));
      } catch {
        setStats((prev) => ({ ...prev, tournamentsLoading: false }));
      }
    }
    fetchStats();
  }, []);

  return (
    <SafeContainer>
      <Header title="Admin Dashboard" showBack />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>
              {stats.tournamentsLoading ? '...' : stats.totalTournaments}
            </Text>
            <Text style={styles.statLabel}>Tournaments</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>--</Text>
            <Text style={styles.statLabel}>Users</Text>
            <Text style={styles.comingSoon}>Coming soon</Text>
          </Card>
        </View>

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
                <Text style={styles.linkArrow}>{'>'}</Text>
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
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  statValue: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.brandPrimary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  comingSoon: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
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
  linkTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  linkDescription: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  linkArrow: {
    fontSize: Typography.sizes.lg,
    color: Colors.textMuted,
    marginLeft: Spacing.md,
  },
  bottomSpacer: {
    height: Spacing['4xl'],
  },
});
