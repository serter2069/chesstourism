import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { SafeContainer } from '../../components/layout';
import { Card } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <SafeContainer>
      <View style={styles.content}>
        <Text style={styles.logo}>{'♔'}</Text>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Choose your account type</Text>

        <Pressable onPress={() => router.push('/(auth)/register-participant')}>
          <Card style={styles.card}>
            <Text style={styles.cardIcon}>{'♟'}</Text>
            <Text style={styles.cardTitle}>Participant</Text>
            <Text style={styles.cardText}>
              Join tournaments, track your games, and explore chess destinations.
            </Text>
          </Card>
        </Pressable>

        <Pressable onPress={() => router.push('/(auth)/register-commissar')}>
          <Card style={styles.card}>
            <Text style={styles.cardIcon}>{'♛'}</Text>
            <Text style={styles.cardTitle}>Commissar</Text>
            <Text style={styles.cardText}>
              Organize and oversee tournaments as an official chess commissar.
            </Text>
          </Card>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/(auth)/login">
            <Text style={styles.footerLink}>Sign in</Text>
          </Link>
        </View>
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  logo: {
    fontSize: 56,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing['3xl'],
  },
  card: {
    marginBottom: Spacing.lg,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  cardText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.sizes.sm * Typography.lineHeights.normal,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: Typography.sizes.sm,
  },
  footerLink: {
    color: Colors.brandPrimary,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
});
