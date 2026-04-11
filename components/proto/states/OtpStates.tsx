import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

// ─── OTP Digit Box ───────────────────────────────────────────────────────────

function OtpBox({
  value,
  hasError,
  disabled,
}: {
  value: string;
  hasError?: boolean;
  disabled?: boolean;
}) {
  const [val, setVal] = useState(value);
  return (
    <TextInput
      style={[
        s.otpBox,
        val.length > 0 && s.otpBoxFilled,
        hasError && s.otpBoxError,
        disabled && s.otpBoxDisabled,
      ]}
      value={val}
      onChangeText={(t) => setVal(t.slice(0, 1))}
      maxLength={1}
      keyboardType="number-pad"
      editable={!disabled}
      textAlign="center" // RN prop, not in stylesheet
    />
  );
}

// ─── OTP Card ────────────────────────────────────────────────────────────────

function OtpCard({
  digits,
  loading,
  error,
  resent,
  hasError,
}: {
  digits: string[];
  loading?: boolean;
  error?: string;
  resent?: boolean;
  hasError?: boolean;
}) {
  const allFilled = digits.every((d) => d.length > 0);
  return (
    <View style={s.cardWrap}>
      <View style={s.card}>
        <View style={s.iconCircle}>
          <Feather name="mail" size={28} color={Colors.gold} />
        </View>
        <Text style={s.heading}>Check your email</Text>
        <Text style={s.subtitle}>We sent a 6-digit code to magnus@example.com</Text>

        {resent && (
          <View style={s.successBanner}>
            <Feather name="check-circle" size={16} color={Colors.statusSuccessText} />
            <Text style={s.successText}>New code sent to magnus@example.com</Text>
          </View>
        )}

        {error && (
          <View style={s.errorBox}>
            <Feather name="alert-circle" size={16} color={Colors.error} />
            <Text style={s.errorText}>{error}</Text>
          </View>
        )}

        <View style={s.otpRow}>
          {digits.map((d, i) => (
            <OtpBox key={i} value={d} hasError={hasError} disabled={loading} />
          ))}
        </View>

        <TouchableOpacity
          style={[s.btnGold, allFilled && !loading && s.btnGoldActive]}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Text style={s.btnGoldText}>Verify</Text>
          )}
        </TouchableOpacity>

        <View style={s.linksCol}>
          {resent ? (
            <Text style={s.countdownText}>Resend in 59s</Text>
          ) : (
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={s.linkGold}>Resend code</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={s.linkMuted}>Wrong email? Go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── States ──────────────────────────────────────────────────────────────────

export default function OtpStates() {
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Empty OTP boxes, waiting for user input">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="auth" />
          <OtpCard digits={['', '', '', '', '', '']} />
        </View>
      </StateSection>

      <StateSection title="CODE_ENTERING" description="3 of 6 digits entered">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="auth" />
          <OtpCard digits={['4', '7', '2', '', '', '']} />
        </View>
      </StateSection>

      <StateSection title="CODE_ENTERED" description="All 6 digits filled, Verify button active">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="auth" />
          <OtpCard digits={['4', '7', '2', '9', '0', '1']} />
        </View>
      </StateSection>

      <StateSection title="LOADING" description="Verifying OTP code, spinner in button">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="auth" />
          <OtpCard digits={['4', '7', '2', '9', '0', '1']} loading />
        </View>
      </StateSection>

      <StateSection title="ERROR" description="Invalid code, 2 attempts remaining, red borders">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="auth" />
          <OtpCard
            digits={['', '', '', '', '', '']}
            error="Invalid code. 2 attempts remaining."
            hasError
          />
        </View>
      </StateSection>

      <StateSection title="RESENT" description="New code sent, countdown timer shown">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="auth" />
          <OtpCard digits={['', '', '', '', '', '']} resent />
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

    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
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
    lineHeight: 20,
  },
  otpRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 8,
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.fontFamilyBold,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  otpBoxFilled: {
    borderColor: Colors.gold,
    backgroundColor: Colors.statusWarningBg,
  },
  otpBoxError: {
    borderColor: Colors.error,
    backgroundColor: Colors.statusErrorBg,
  },
  otpBoxDisabled: {
    opacity: 0.5,
  },
  btnGold: {
    backgroundColor: Colors.gold,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    opacity: 0.6,
    marginBottom: Spacing.lg,
  },
  btnGoldActive: {
    opacity: 1,
  },
  btnGoldText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.primary,
  },
  linksCol: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  linkGold: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.gold,
  },
  linkMuted: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  countdownText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.statusErrorBg,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    width: '100%',
  },
  errorText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.statusErrorText,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.statusSuccessBg,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    width: '100%',
  },
  successText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.statusSuccessText,
  },
});
