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
  success: { bg: Colors.statusSuccess + '22', text: Colors.statusSuccess },
  warning: { bg: Colors.statusWarning + '22', text: Colors.statusWarning },
  error: { bg: Colors.statusError + '22', text: Colors.statusError },
  info: { bg: Colors.statusInfo + '22', text: Colors.statusInfo },
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
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
});
