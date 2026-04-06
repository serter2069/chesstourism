import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeContainer, Header } from '../../components/layout';
import { Button, Card, Input } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import api from '../../lib/api';

interface FormData {
  organizationName: string;
  contactName: string;
  email: string;
  phone: string;
  description: string;
}

const initialForm: FormData = {
  organizationName: '',
  contactName: '',
  email: '',
  phone: '',
  description: '',
};

export default function OrganizationApplyScreen() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitError, setSubmitError] = useState('');

  function updateField(key: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!form.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }
    if (!form.contactName.trim()) {
      newErrors.contactName = 'Contact person is required';
    }
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!form.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setLoading(true);
    setSubmitError('');
    try {
      await api.post('/organizations/request', {
        organizationName: form.organizationName.trim(),
        contactName: form.contactName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        description: form.description.trim(),
      });
      setSubmitted(true);
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to submit application. Please try again.';
      setSubmitError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <SafeContainer>
        <Header title="Organization Application" showBack />
        <View style={styles.successContainer}>
          <Card style={styles.successCard}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successTitle}>Application Submitted!</Text>
            <Text style={styles.successText}>
              Your application has been submitted. We will contact you within 3 business days.
            </Text>
            <Button
              title="Back to Home"
              onPress={() => router.replace('/')}
              variant="secondary"
              style={styles.successBtn}
            />
          </Card>
        </View>
      </SafeContainer>
    );
  }

  return (
    <SafeContainer>
      <Header title="Organization Application" showBack />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.subtitle}>
            Submit an application to host a tournament through the federation. An administrator will review it within 3 business days.
          </Text>

          <Input
            label="Organization Name"
            placeholder="e.g., Chess Club «Ladya»"
            value={form.organizationName}
            onChangeText={(v) => updateField('organizationName', v)}
            error={errors.organizationName}
          />

          <Input
            label="Contact Person"
            placeholder="Full Name"
            value={form.contactName}
            onChangeText={(v) => updateField('contactName', v)}
            error={errors.contactName}
          />

          <Input
            label="Email"
            placeholder="email@example.com"
            value={form.email}
            onChangeText={(v) => updateField('email', v)}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Phone (optional)"
            placeholder="+1 234 567 8900"
            value={form.phone}
            onChangeText={(v) => updateField('phone', v)}
            error={errors.phone}
            keyboardType="phone-pad"
          />

          <Input
            label="Application Description"
            placeholder="Describe the tournament: format, expected dates, venue, anticipated number of participants"
            value={form.description}
            onChangeText={(v) => updateField('description', v)}
            error={errors.description}
            multiline
            numberOfLines={5}
            style={styles.textarea}
          />

          <Button
            title="Submit Application"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitBtn}
          />

          {submitError ? <Text style={styles.submitError}>{submitError}</Text> : null}

          <View style={styles.bottomSpacer} />
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
    flex: 1,
    maxWidth: 430,
    alignSelf: 'center',
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.xl,
    lineHeight: Typography.sizes.sm * Typography.lineHeights.normal,
  },
  textarea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitBtn: {
    marginTop: Spacing.sm,
  },
  submitError: {
    color: Colors.error,
    fontSize: Typography.sizes.sm,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: Spacing['4xl'],
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    maxWidth: 430,
    alignSelf: 'center',
    width: '100%',
  },
  successCard: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  successIcon: {
    fontSize: Typography.sizes['3xl'],
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  successText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: Typography.sizes.sm * Typography.lineHeights.normal,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  successBtn: {
    alignSelf: 'stretch',
  },
});
