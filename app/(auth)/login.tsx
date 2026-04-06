import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeContainer } from '../../components/layout';
import { Button, Input } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useAuth } from '../../store/auth';

export default function LoginScreen() {
  const router = useRouter();
  const { returnUrl } = useLocalSearchParams<{ returnUrl?: string }>();
  const { requestOtp } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRequestOtp() {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setError('Please enter your email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await requestOtp(email.trim().toLowerCase());
      router.push({ pathname: '/(auth)/otp', params: { email: email.trim().toLowerCase(), returnUrl: returnUrl || '' } });
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to send code. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.logo}>{'♔'}</Text>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>
            Enter your email to receive a one-time code
          </Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Input
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Button
            title="Get Code"
            onPress={handleRequestOtp}
            loading={loading}
            style={styles.btn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing['3xl'],
  },
  logo: {
    fontSize: 56,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing['3xl'],
  },
  error: {
    color: Colors.error,
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  btn: {
    marginTop: Spacing.sm,
  },
});
