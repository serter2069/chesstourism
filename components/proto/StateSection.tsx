import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';

interface StateSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function StateSection({ title, description, children }: StateSectionProps) {
  const webProps = Platform.OS === 'web' ? { 'data-state-name': title } : {};

  return (
    <View {...webProps} style={styles.wrapper}>
      <View style={styles.header}>
        <View style={styles.accent} />
        <View style={styles.labelRow}>
          <Text style={styles.label}>STATE: {title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing['2xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 4,
    overflow: 'hidden',
  },
  accent: {
    width: 4,
    alignSelf: 'stretch',
    backgroundColor: Colors.primary,
  },
  labelRow: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  label: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilyBold,
    fontWeight: Typography.weights.bold,
    color: Colors.gold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
    marginTop: 2,
  },
  content: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
