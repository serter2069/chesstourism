import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeContainer } from '../components/layout';
import { Button, Card, Badge } from '../components/ui';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { Typography } from '../constants/typography';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeContainer>
      <View style={styles.content}>
        <Text style={styles.logo}>{'♔'}</Text>
        <Text style={styles.title}>ChesTourism</Text>
        <Text style={styles.subtitle}>International Chess Tourism Association</Text>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Welcome</Text>
          <Text style={styles.cardText}>
            Discover chess tournaments and travel experiences around the world.
          </Text>
          <View style={styles.badges}>
            <Badge label="Tournaments" status="info" />
            <Badge label="Travel" status="success" />
            <Badge label="Community" status="warning" />
          </View>
        </Card>

        <Button title="Get Started" onPress={() => router.push('/(auth)/register')} style={styles.cta} />
        <Button title="Sign In" onPress={() => router.push('/(auth)/login')} variant="secondary" />
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
    fontSize: 64,
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
    marginBottom: Spacing['2xl'],
  },
  cardTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  cardText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.sizes.sm * Typography.lineHeights.normal,
    marginBottom: Spacing.lg,
  },
  badges: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  cta: {
    marginBottom: Spacing.md,
  },
});
