import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

// ─── Login Card ──────────────────────────────────────────────────────────────

function LoginCard({
  email,
  onChangeEmail,
  loading,
  error,
  rateLimited,
}: {
  email: string;
  onChangeEmail: (v: string) => void;
  loading?: boolean;
  error?: string;
  rateLimited?: boolean;
}) {
  const disabled = loading || rateLimited;
  return (
    <View style={s.cardWrap}>
      <View style={s.card}>
        <Text style={s.heading}>Welcome back</Text>
        <Text style={s.subtitle}>Sign in to your Chess Tourism account</Text>

        {rateLimited && (
          <View style={s.warningBanner}>
            <Feather name="clock" size={16} color={Colors.statusWarningText} />
            <Text style={s.warningText}>Too many attempts. Please wait 5 minutes.</Text>
          </View>
        )}

        {error && (
          <View style={s.errorBox}>
            <Feather name="alert-circle" size={16} color={Colors.error} />
            <Text style={s.errorText}>{error}</Text>
          </View>
        )}

        <View style={s.fieldGroup}>
          <Text style={s.label}>Email address</Text>
          <TextInput
            style={[s.input, disabled && s.inputDisabled, error ? s.inputError : null]}
            placeholder="you@example.com"
            placeholderTextColor={Colors.textMuted}
            value={email}
            onChangeText={onChangeEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!disabled}
          />
        </View>

        <TouchableOpacity
          style={[s.btnGold, email.length > 0 && !disabled && s.btnGoldActive]}
          activeOpacity={0.85}
          disabled={disabled}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Text style={s.btnGoldText}>Send Code</Text>
          )}
        </TouchableOpacity>

        <View style={s.dividerRow}>
          <View style={s.dividerLine} />
          <Text style={s.dividerText}>or</Text>
          <View style={s.dividerLine} />
        </View>

        <TouchableOpacity style={s.btnOutline} activeOpacity={0.85} disabled={disabled}>
          <Feather name="chrome" size={18} color={Colors.primary} />
          <Text style={s.btnOutlineText}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={s.linkRow}>
          <Text style={s.linkMuted}>New here? </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={s.linkGold}>Create account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── States ──────────────────────────────────────────────────────────────────

export default function LoginStates() {
  const [email1, setEmail1] = useState('');
  const [email2, setEmail2] = useState('magnus@example.com');

  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Centered login card with email input, gold CTA, Google sign-in">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="auth" />
          <LoginCard email={email1} onChangeEmail={setEmail1} />
        </View>
      </StateSection>

      <StateSection title="EMAIL_ENTERED" description="Email filled, Send Code button highlighted">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="auth" />
          <LoginCard email={email2} onChangeEmail={setEmail2} />
        </View>
      </StateSection>

      <StateSection title="LOADING" description="Sending code, spinner in button, fields disabled">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="auth" />
          <LoginCard email="magnus@example.com" onChangeEmail={() => {}} loading />
        </View>
      </StateSection>

      <StateSection title="ERROR" description="No account found error below email field">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="auth" />
          <LoginCard
            email="unknown@example.com"
            onChangeEmail={() => {}}
            error="No account found with this email. Try again or create account."
          />
        </View>
      </StateSection>

      <StateSection title="RATE_LIMITED" description="Too many attempts warning with countdown">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="auth" />
          <LoginCard email="magnus@example.com" onChangeEmail={() => {}} rateLimited />
        </View>
      </StateSection>
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    backgroundColor: Colors.backgroundAlt,
    minHeight: 600,
  },
  cardWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['3xl'],
    paddingHorizontal: Spacing.md,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: Spacing.xl,
    width: '100%',

    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  heading: {
    fontFamily: Typography.fontFamilyHeading,
    fontSize: Typography.sizes['2xl'],
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  fieldGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamily,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  inputDisabled: {
    backgroundColor: Colors.backgroundAlt,
    opacity: 0.6,
  },
  inputError: {
    borderColor: Colors.error,
  },
  btnGold: {
    backgroundColor: Colors.gold,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
    marginBottom: Spacing.md,
  },
  btnGoldActive: {
    opacity: 1,
  },
  btnGoldText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.primary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.md,
  },
  btnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: Spacing.lg,
  },
  btnOutlineText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  linkMuted: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  linkGold: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.gold,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.statusErrorBg,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  errorText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.statusErrorText,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.statusWarningBg,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  warningText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.statusWarningText,
  },
});
