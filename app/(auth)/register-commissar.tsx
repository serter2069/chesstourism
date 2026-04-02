import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { SafeContainer } from '../../components/layout';
import { Button, Input } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import api from '../../lib/api';

export default function RegisterCommissarScreen() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirm_password: '',
    name: '',
    surname: '',
    country: '',
    city: '',
    license_number: '',
    experience_years: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update(field: keyof typeof form) {
    return (value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleRegister() {
    const {
      email, password, confirm_password, name, surname,
      country, city, license_number, experience_years,
    } = form;

    if (!email || !password || !name || !surname || !license_number || !experience_years) {
      setError('Please fill in all required fields');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirm_password) {
      setError('Passwords do not match');
      return;
    }
    if (isNaN(parseInt(experience_years, 10))) {
      setError('Experience years must be a number');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register/commissar', {
        email: email.trim(),
        password,
        name: name.trim(),
        surname: surname.trim(),
        country: country.trim() || undefined,
        city: city.trim() || undefined,
        license_number: license_number.trim(),
        experience_years: parseInt(experience_years, 10),
      });
      router.replace('/(auth)/verify-email-sent');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
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
          <Text style={styles.title}>Commissar Registration</Text>
          <Text style={styles.subtitle}>Register as an official chess commissar</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Input
            label="Email *"
            placeholder="your@email.com"
            value={form.email}
            onChangeText={update('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Input
            label="Name *"
            placeholder="First name"
            value={form.name}
            onChangeText={update('name')}
            autoComplete="given-name"
          />

          <Input
            label="Surname *"
            placeholder="Last name"
            value={form.surname}
            onChangeText={update('surname')}
            autoComplete="family-name"
          />

          <Input
            label="Country"
            placeholder="Your country"
            value={form.country}
            onChangeText={update('country')}
          />

          <Input
            label="City"
            placeholder="Your city"
            value={form.city}
            onChangeText={update('city')}
          />

          <Input
            label="License Number *"
            placeholder="FIDE license number"
            value={form.license_number}
            onChangeText={update('license_number')}
          />

          <Input
            label="Experience Years *"
            placeholder="Years of experience"
            value={form.experience_years}
            onChangeText={update('experience_years')}
            keyboardType="numeric"
          />

          <Input
            label="Password *"
            placeholder="Min 8 characters"
            value={form.password}
            onChangeText={update('password')}
            secureTextEntry
            autoCapitalize="none"
          />

          <Input
            label="Confirm Password *"
            placeholder="Repeat password"
            value={form.confirm_password}
            onChangeText={update('confirm_password')}
            secureTextEntry
            autoCapitalize="none"
          />

          <Button
            title="Register"
            onPress={handleRegister}
            loading={loading}
            style={styles.btn}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login">
              <Text style={styles.footerLink}>Sign in</Text>
            </Link>
          </View>
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
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing['3xl'],
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
  btn: {
    marginTop: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    paddingBottom: Spacing['2xl'],
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
