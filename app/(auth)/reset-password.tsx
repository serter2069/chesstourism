import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, Link, useRouter } from 'expo-router';
import { SafeContainer } from '../../components/layout';
import { Button, Input } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import api from '../../lib/api';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleReset() {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!token) {
      setError('Invalid reset link. Please request a new one.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setSuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Reset failed. Please try again.';
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
        <View style={styles.content}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Enter your new password</Text>

          {success ? (
            <View>
              <Text style={styles.success}>
                Password reset successfully! You can now sign in with your new password.
              </Text>
              <Button
                title="Go to Sign In"
                onPress={() => router.replace('/(auth)/login')}
                style={styles.btn}
              />
            </View>
          ) : (
            <View>
              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Input
                label="New Password"
                placeholder="Min 8 characters"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <Input
                label="Confirm Password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <Button
                title="Reset Password"
                onPress={handleReset}
                loading={loading}
                style={styles.btn}
              />

              <View style={styles.footer}>
                <Link href="/(auth)/login">
                  <Text style={styles.footerLink}>Back to Sign In</Text>
                </Link>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
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
  error: {
    color: Colors.statusError,
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  success: {
    color: Colors.statusSuccess,
    fontSize: Typography.sizes.base,
    textAlign: 'center',
    lineHeight: Typography.sizes.base * Typography.lineHeights.normal,
    marginBottom: Spacing.xl,
  },
  btn: {
    marginTop: Spacing.sm,
  },
  footer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  footerLink: {
    color: Colors.brandPrimary,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
});
