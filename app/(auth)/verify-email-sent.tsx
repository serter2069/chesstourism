import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { SafeContainer } from '../../components/layout';
import { Card } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';

export default function VerifyEmailSentScreen() {
  return (
    <SafeContainer>
      <View style={styles.content}>
        <Text style={styles.icon}>{'✉'}</Text>
        <Text style={styles.title}>Check Your Email</Text>

        <Card style={styles.card}>
          <Text style={styles.cardText}>
            We sent a verification link to your email address. Please check your inbox and click the link to activate your account.
          </Text>
          <Text style={styles.hint}>
            If you don't see the email, check your spam folder.
          </Text>
        </Card>

        <View style={styles.footer}>
          <Link href="/(auth)/login">
            <Text style={styles.footerLink}>Back to Sign In</Text>
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
  icon: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
  },
  card: {
    marginBottom: Spacing.xl,
  },
  cardText: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    lineHeight: Typography.sizes.base * Typography.lineHeights.normal,
    marginBottom: Spacing.lg,
  },
  hint: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    lineHeight: Typography.sizes.sm * Typography.lineHeights.normal,
  },
  footer: {
    alignItems: 'center',
  },
  footerLink: {
    color: Colors.brandPrimary,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
  },
});
