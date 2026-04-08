import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeContainer } from '../../components/layout';
import { Button } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useAuth } from '../../store/auth';

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SEC = 60;

/**
 * Validates returnUrl to prevent open-redirect attacks.
 * Accepts only relative paths starting with "/" (not "//").
 *
 * Tested vectors (all safe):
 * - "//evil.com"          → blocked (regex: must start with / but not //)
 * - "%2F%2Fevil.com"     → blocked (expo-router decodes before safeReturnUrl, becomes "//evil.com")
 * - "javascript:alert()" → blocked (no leading /)
 * - "\\/evil.com"         → blocked (no leading /)
 * - undefined/empty       → fallback to "/"
 * - "/%2Fevil.com"        → passes regex, stays on same domain (not protocol-relative in router.replace)
 *
 * Note: router.replace() (React Navigation) does not expose raw strings to window.location,
 * so protocol-relative and javascript: vectors are neutralized even if they bypass regex.
 */
function safeReturnUrl(url?: string): string {
  if (!url) return '/';
  if (/^\/(?!\/)/.test(url)) return url;
  return '/';
}

export default function OtpScreen() {
  const router = useRouter();
  const { email, returnUrl } = useLocalSearchParams<{ email: string; returnUrl?: string }>();
  const { verifyOtp, requestOtp } = useAuth();

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [resent, setResent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(RESEND_COOLDOWN_SEC);

  const inputs = useRef<(TextInput | null)[]>([]);

  // 60-second resend timer
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  function handleDigitChange(index: number, value: string) {
    // Allow only digits
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError('');

    if (digit && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(index: number, key: string) {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  async function handleVerify() {
    const code = digits.join('');
    if (code.length < CODE_LENGTH) {
      setError('Please enter all 6 digits');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await verifyOtp(email, code);
      router.replace(safeReturnUrl(returnUrl) as any);
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Invalid code. Please try again.';
      setError(msg);
      // Clear the entered code on error
      setDigits(Array(CODE_LENGTH).fill(''));
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (resendCountdown > 0) return;
    setResending(true);
    setError('');
    try {
      await requestOtp(email);
      setResent(true);
      setResendCountdown(RESEND_COOLDOWN_SEC);
      setDigits(Array(CODE_LENGTH).fill(''));
      inputs.current[0]?.focus();
      setTimeout(() => setResent(false), 5000);
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to resend code. Please try again.';
      setError(msg);
    } finally {
      setResending(false);
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
          <Text style={styles.title}>Check Your Email</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to{'\n'}
            <Text style={styles.emailText}>{email}</Text>
          </Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {resent ? <Text style={styles.success}>Code resent!</Text> : null}

          <View style={styles.codeRow}>
            {digits.map((digit, i) => (
              <TextInput
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                style={[styles.cell, digit ? styles.cellFilled : null]}
                value={digit}
                onChangeText={(val) => handleDigitChange(i, val)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                textContentType="oneTimeCode"
                autoComplete={i === 0 ? 'one-time-code' : 'off'}
              />
            ))}
          </View>

          <Button
            title="Verify"
            onPress={handleVerify}
            loading={loading}
            style={styles.btn}
          />

          <View style={styles.resendRow}>
            <Text style={styles.resendText}>Didn't receive it? </Text>
            <TouchableOpacity
              onPress={handleResend}
              disabled={resending || resendCountdown > 0}
            >
              <Text
                style={[
                  styles.resendLink,
                  (resending || resendCountdown > 0) && styles.resendLinkDisabled,
                ]}
              >
                {resending
                  ? 'Sending...'
                  : resendCountdown > 0
                    ? `Resend in ${resendCountdown}s`
                    : 'Resend code'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>← Change email</Text>
          </TouchableOpacity>
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
    lineHeight: Typography.sizes.base * 1.5,
  },
  emailText: {
    color: Colors.text,
    fontWeight: Typography.weights.semibold,
  },
  error: {
    color: Colors.error,
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  success: {
    color: Colors.primary,
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  cell: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  cellFilled: {
    borderColor: Colors.primary,
  },
  btn: {
    marginTop: Spacing.sm,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  resendText: {
    color: Colors.textMuted,
    fontSize: Typography.sizes.sm,
  },
  resendLink: {
    color: Colors.primary,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  resendLinkDisabled: {
    opacity: 0.5,
  },
  backBtn: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  backText: {
    color: Colors.textMuted,
    fontSize: Typography.sizes.sm,
  },
});
