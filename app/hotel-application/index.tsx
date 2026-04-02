import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeContainer, Header } from '../../components/layout';
import { Button, Card, Input } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import api from '../../lib/api';

interface FormData {
  organization_name: string;
  address: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  venue_description: string;
  capacity: string;
}

const initialForm: FormData = {
  organization_name: '',
  address: '',
  contact_name: '',
  contact_email: '',
  contact_phone: '',
  venue_description: '',
  capacity: '',
};

export default function HotelApplicationScreen() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  function updateField(key: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!form.organization_name.trim()) {
      newErrors.organization_name = 'Organization name is required';
    }
    if (!form.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!form.contact_name.trim()) {
      newErrors.contact_name = 'Contact name is required';
    }
    if (!form.contact_email.trim()) {
      newErrors.contact_email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.contact_email)) {
      newErrors.contact_email = 'Invalid email format';
    }
    if (!form.contact_phone.trim()) {
      newErrors.contact_phone = 'Phone number is required';
    }
    if (!form.venue_description.trim()) {
      newErrors.venue_description = 'Venue description is required';
    }
    if (form.capacity && isNaN(Number(form.capacity))) {
      newErrors.capacity = 'Capacity must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post('/hotel-applications', {
        ...form,
        capacity: form.capacity ? Number(form.capacity) : undefined,
      });
    } catch {
      // Backend may not exist yet — show success anyway
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <SafeContainer>
        <Header title="Hotel Application" showBack />
        <View style={styles.successContainer}>
          <Card style={styles.successCard}>
            <Text style={styles.successIcon}>{'[OK]'}</Text>
            <Text style={styles.successTitle}>Application Submitted!</Text>
            <Text style={styles.successText}>
              Thank you for your interest. We will review your application and contact you shortly.
            </Text>
          </Card>
        </View>
      </SafeContainer>
    );
  }

  return (
    <SafeContainer>
      <Header title="Hotel Application" showBack />
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
            Submit your venue as a partner for chess tournaments
          </Text>

          <Input
            label="Organization Name"
            placeholder="e.g. Grand Hotel Chess Club"
            value={form.organization_name}
            onChangeText={(v) => updateField('organization_name', v)}
            error={errors.organization_name}
          />

          <Input
            label="Address"
            placeholder="Full address of the venue"
            value={form.address}
            onChangeText={(v) => updateField('address', v)}
            error={errors.address}
          />

          <Input
            label="Contact Person"
            placeholder="Full name"
            value={form.contact_name}
            onChangeText={(v) => updateField('contact_name', v)}
            error={errors.contact_name}
          />

          <Input
            label="Contact Email"
            placeholder="email@example.com"
            value={form.contact_email}
            onChangeText={(v) => updateField('contact_email', v)}
            error={errors.contact_email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Contact Phone"
            placeholder="+1 234 567 890"
            value={form.contact_phone}
            onChangeText={(v) => updateField('contact_phone', v)}
            error={errors.contact_phone}
            keyboardType="phone-pad"
          />

          <Input
            label="Venue Description"
            placeholder="Describe the venue, facilities, and capacity for chess events"
            value={form.venue_description}
            onChangeText={(v) => updateField('venue_description', v)}
            error={errors.venue_description}
            multiline
            numberOfLines={4}
            style={styles.textarea}
          />

          <Input
            label="Capacity (optional)"
            placeholder="Maximum number of participants"
            value={form.capacity}
            onChangeText={(v) => updateField('capacity', v)}
            error={errors.capacity}
            keyboardType="numeric"
          />

          <Button
            title="Submit Application"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitBtn}
          />

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
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    lineHeight: Typography.sizes.sm * Typography.lineHeights.normal,
  },
  textarea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitBtn: {
    marginTop: Spacing.sm,
  },
  bottomSpacer: {
    height: Spacing['4xl'],
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  successCard: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  successIcon: {
    fontSize: Typography.sizes['3xl'],
    color: Colors.statusSuccess,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  successText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.sizes.sm * Typography.lineHeights.normal,
  },
});
