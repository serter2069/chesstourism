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
  success: { bg: '#E8F5E9', text: '#1B5E20' },
  warning: { bg: '#FFF8E1', text: '#E65100' },
  error: { bg: '#FFEBEE', text: '#B71C1C' },
  info: { bg: '#E3F2FD', text: '#0D47A1' },
  default: { bg: Colors.backgroundAlt, text: Colors.textMuted },
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
