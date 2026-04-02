import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeContainer, Header } from '../../../components/layout';
import { Card } from '../../../components/ui';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

export default function AdminFinancesScreen() {
  return (
    <SafeContainer>
      <Header title="Finances" showBack />
      <View style={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.title}>Financial Reports</Text>
          <Text style={styles.subtitle}>Coming soon</Text>
          <Text style={styles.description}>
            Payment tracking, tournament fees, and financial reporting will be available here.
          </Text>
        </Card>

        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>$0</Text>
            <Text style={styles.statLabel}>Total Revenue</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Payments</Text>
          </Card>
        </View>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>$0</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Refunds</Text>
          </Card>
        </View>
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    maxWidth: 430,
    alignSelf: 'center' as const,
    width: '100%',
  },
  card: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: Typography.sizes.sm * Typography.lineHeights.normal,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
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
  },
  statValue: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
});
