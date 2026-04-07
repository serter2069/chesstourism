import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeContainer } from '../components/layout';
import { Button } from '../components/ui';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { Typography } from '../constants/typography';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <SafeContainer>
      <View style={styles.container}>
        <Text style={styles.icon}>{'♔'}</Text>
        <Text style={styles.code}>404</Text>
        <Text style={styles.title}>Page Not Found</Text>
        <Text style={styles.subtitle}>
          The page you're looking for has moved or doesn't exist.
        </Text>
        <View style={styles.actions}>
          <Button
            title="Back to Home"
            onPress={() => router.push('/')}
            style={styles.primaryButton}
          />
          <Button
            title="Browse Tournaments"
            onPress={() => router.push('/tournaments')}
            variant="secondary"
            style={styles.secondaryButton}
          />
        </View>
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    backgroundColor: Colors.primary,
  },
  icon: {
    fontSize: Typography.sizes.iconLg,
    color: Colors.gold,
    marginBottom: Spacing.lg,
  },
  code: {
    fontSize: 72,
    fontFamily: Typography.fontFamilyHeading,
    fontWeight: Typography.weights.bold,
    color: Colors.gold,
    lineHeight: 80,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.sizes['2xl'],
    fontFamily: Typography.fontFamilyHeading,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: Typography.sizes.base * Typography.lineHeights.normal,
    opacity: 0.8,
    marginBottom: Spacing['3xl'],
  },
  actions: {
    width: '100%',
    gap: Spacing.md,
    alignItems: 'center',
  },
  primaryButton: {
    minWidth: 220,
  },
  secondaryButton: {
    minWidth: 220,
  },
});
