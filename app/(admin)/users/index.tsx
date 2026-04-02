import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeContainer, Header } from '../../../components/layout';
import { Card } from '../../../components/ui';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

export default function AdminUsersScreen() {
  return (
    <SafeContainer>
      <Header title="Users" showBack />
      <View style={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.title}>User Management</Text>
          <Text style={styles.subtitle}>Coming soon</Text>
          <Text style={styles.description}>
            User management features including account blocking, role changes, and activity monitoring will be available here.
          </Text>
        </Card>

        <Card style={styles.statsCard}>
          <Text style={styles.statsTitle}>User Statistics</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>--</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>--</Text>
              <Text style={styles.statLabel}>Participants</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>--</Text>
              <Text style={styles.statLabel}>Commissars</Text>
            </View>
          </View>
        </Card>
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  card: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.brandPrimary,
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.sizes.sm * Typography.lineHeights.normal,
    paddingHorizontal: Spacing.lg,
  },
  statsCard: {
    paddingVertical: Spacing.xl,
  },
  statsTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.brandPrimary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
});
