import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';

type BadgeStatus = 'success' | 'warning' | 'error' | 'info' | 'default';

interface BadgeProps {
  label: string;
  status?: BadgeStatus;
  style?: ViewStyle;
}

const statusColors: Record<BadgeStatus, { bg: string; text: string }> = {
  success: { bg: '#E8F0E8', text: '#3D6B3F' },
  warning: { bg: '#F5EBD8', text: '#8B6530' },
  error: { bg: '#F5DDD8', text: '#A63A2C' },
  info: { bg: '#DDE8EF', text: '#4A6B7A' },
  default: { bg: Colors.bgSurface, text: Colors.textSecondary },
};

export default function Badge({ label, status = 'default', style }: BadgeProps) {
  const c = statusColors[status];

  return (
    <View style={[styles.badge, { backgroundColor: c.bg }, style]}>
      <Text style={[styles.text, { color: c.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
});
