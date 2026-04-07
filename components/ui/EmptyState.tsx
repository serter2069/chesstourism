import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

export default function EmptyState({ icon, title, subtitle, style }: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: Spacing['4xl'],
    paddingHorizontal: Spacing.xl,
  },
  icon: {
    fontSize: Typography.sizes.icon,
    marginBottom: Spacing.lg,
    opacity: 0.5,
    color: Colors.text,
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
