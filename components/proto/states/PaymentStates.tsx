import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import { ProtoNavTop, ProtoBottomNav } from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

// ─── Tournament Info Card ────────────────────────────────────────────────────

function TournamentInfo() {
  return (
    <View style={s.tournamentCard}>
      <View style={s.tournamentHeader}>
        <View style={s.tournamentIcon}>
          <Feather name="award" size={20} color={Colors.gold} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.tournamentName}>Tbilisi Open 2025</Text>
          <View style={s.metaRow}>
            <Feather name="calendar" size={12} color={Colors.textMuted} />
            <Text style={s.metaText}>Jun 14-20, 2025</Text>
          </View>
          <View style={s.metaRow}>
            <Feather name="map-pin" size={12} color={Colors.textMuted} />
            <Text style={s.metaText}>Tbilisi, Georgia</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Payment Summary ─────────────────────────────────────────────────────────

function PaymentSummary() {
  return (
    <View style={s.summaryBox}>
      <Text style={s.summaryTitle}>Payment Summary</Text>
      <View style={s.summaryRow}>
        <Text style={s.summaryLabel}>Entry fee</Text>
        <Text style={s.summaryValue}>EUR 50.00</Text>
      </View>
      <View style={s.summaryRow}>
        <Text style={s.summaryLabel}>Processing fee</Text>
        <Text style={s.summaryValue}>EUR 0.00</Text>
      </View>
      <View style={s.summaryDivider} />
      <View style={s.summaryRow}>
        <Text style={s.summaryTotalLabel}>Total</Text>
        <Text style={s.summaryTotal}>EUR 50.00</Text>
      </View>
    </View>
  );
}

// ─── Card Form ───────────────────────────────────────────────────────────────

function CardForm({ disabled }: { disabled?: boolean }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  return (
    <View style={s.formSection}>
      <Text style={s.formTitle}>Card Details</Text>

      <View style={s.fieldGroup}>
        <Text style={s.label}>Card Number</Text>
        <View style={s.cardInputWrap}>
          <Feather name="credit-card" size={16} color={Colors.textMuted} />
          <TextInput
            style={[s.cardInput, disabled && s.inputDisabled]}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor={Colors.textMuted}
            value={cardNumber}
            onChangeText={setCardNumber}
            keyboardType="number-pad"
            editable={!disabled}
          />
        </View>
      </View>

      <View style={s.twoCol}>
        <View style={[s.fieldGroup, { flex: 1 }]}>
          <Text style={s.label}>Expiry</Text>
          <TextInput
            style={[s.input, disabled && s.inputDisabled]}
            placeholder="MM/YY"
            placeholderTextColor={Colors.textMuted}
            value={expiry}
            onChangeText={setExpiry}
            editable={!disabled}
          />
        </View>
        <View style={[s.fieldGroup, { flex: 1 }]}>
          <Text style={s.label}>CVV</Text>
          <TextInput
            style={[s.input, disabled && s.inputDisabled]}
            placeholder="123"
            placeholderTextColor={Colors.textMuted}
            value={cvv}
            onChangeText={setCvv}
            keyboardType="number-pad"
            secureTextEntry
            editable={!disabled}
          />
        </View>
      </View>

      <View style={s.fieldGroup}>
        <Text style={s.label}>Cardholder Name</Text>
        <TextInput
          style={[s.input, disabled && s.inputDisabled]}
          placeholder="Name on card"
          placeholderTextColor={Colors.textMuted}
          value={name}
          onChangeText={setName}
          editable={!disabled}
        />
      </View>
    </View>
  );
}

// ─── Security Note ───────────────────────────────────────────────────────────

function SecurityNote() {
  return (
    <View style={s.securityRow}>
      <Feather name="lock" size={14} color={Colors.textMuted} />
      <Text style={s.securityText}>Secure payment via Stripe</Text>
    </View>
  );
}

// ─── Default ─────────────────────────────────────────────────────────────────

function DefaultState() {
  return (
    <View style={s.page}>
      <View style={s.content}>
        <Text style={s.heading}>Payment</Text>
        <TournamentInfo />
        <PaymentSummary />
        <CardForm />
        <TouchableOpacity style={s.payBtn} activeOpacity={0.85}>
          <Text style={s.payBtnText}>Pay EUR 50.00</Text>
        </TouchableOpacity>
        <SecurityNote />
      </View>
    </View>
  );
}

// ─── Processing ──────────────────────────────────────────────────────────────

function ProcessingState() {
  return (
    <View style={s.page}>
      <View style={s.content}>
        <Text style={s.heading}>Payment</Text>
        <TournamentInfo />
        <PaymentSummary />
        <CardForm disabled />
        <TouchableOpacity style={[s.payBtn, s.payBtnDisabled]} disabled>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={s.payBtnText}>Processing...</Text>
        </TouchableOpacity>
        <SecurityNote />
      </View>
    </View>
  );
}

// ─── Success ─────────────────────────────────────────────────────────────────

function SuccessState() {
  return (
    <View style={s.page}>
      <View style={s.content}>
        <View style={s.resultCard}>
          <View style={s.successIcon}>
            <Feather name="check" size={32} color={Colors.white} />
          </View>
          <Text style={s.resultTitle}>Payment Successful!</Text>
          <Text style={s.resultDesc}>EUR 50.00 charged for Tbilisi Open 2025</Text>

          <View style={s.receiptBox}>
            <Text style={s.receiptTitle}>Transaction Details</Text>
            <View style={s.receiptRow}>
              <Text style={s.receiptLabel}>Tournament</Text>
              <Text style={s.receiptValue}>Tbilisi Open 2025</Text>
            </View>
            <View style={s.receiptRow}>
              <Text style={s.receiptLabel}>Amount</Text>
              <Text style={s.receiptValue}>EUR 50.00</Text>
            </View>
            <View style={s.receiptRow}>
              <Text style={s.receiptLabel}>Transaction ID</Text>
              <Text style={s.receiptValue}>TXN-2025-CT-48291</Text>
            </View>
            <View style={s.receiptRow}>
              <Text style={s.receiptLabel}>Date</Text>
              <Text style={s.receiptValue}>Jun 10, 2025</Text>
            </View>
          </View>

          <TouchableOpacity style={s.payBtn} activeOpacity={0.85}>
            <Text style={s.payBtnText}>View My Registrations</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Failed ──────────────────────────────────────────────────────────────────

function FailedState() {
  return (
    <View style={s.page}>
      <View style={s.content}>
        <View style={s.resultCard}>
          <View style={s.failIcon}>
            <Feather name="x" size={32} color={Colors.white} />
          </View>
          <Text style={s.resultTitle}>Payment Failed</Text>
          <Text style={s.resultDesc}>Your card was declined. Please try again with a different card.</Text>

          <View style={s.errorBanner}>
            <Feather name="alert-circle" size={16} color={Colors.error} />
            <Text style={s.errorBannerText}>The card issuer returned: insufficient funds. Please use a different payment method.</Text>
          </View>

          <TouchableOpacity style={s.payBtn} activeOpacity={0.85}>
            <Feather name="refresh-cw" size={16} color={Colors.primary} />
            <Text style={s.payBtnText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.cancelBtn} activeOpacity={0.7}>
            <Text style={s.cancelText}>Cancel Payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export default function PaymentStates() {
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Payment form with card inputs, tournament info, summary">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <ProtoNavTop variant="client" />
          <View style={{ flex: 1 }}>

        <DefaultState />
                </View>
          <ProtoBottomNav variant="client" activeTab="home" />
        </View>
</StateSection>

      <StateSection title="PROCESSING" description="Processing payment, spinner in button, fields disabled">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <ProtoNavTop variant="client" />
          <View style={{ flex: 1 }}>

        <ProcessingState />
                </View>
          <ProtoBottomNav variant="client" activeTab="home" />
        </View>
</StateSection>

      <StateSection title="SUCCESS" description="Payment successful with transaction details">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <ProtoNavTop variant="client" />
          <View style={{ flex: 1 }}>

        <SuccessState />
                </View>
          <ProtoBottomNav variant="client" activeTab="home" />
        </View>
</StateSection>

      <StateSection title="FAILED" description="Payment failed, card declined error, try again CTA">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <ProtoNavTop variant="client" />
          <View style={{ flex: 1 }}>

        <FailedState />
                </View>
          <ProtoBottomNav variant="client" activeTab="home" />
        </View>
</StateSection>
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    backgroundColor: Colors.background,

  },
  content: {
    padding: Spacing.md,
  },
  heading: {
    fontFamily: Typography.fontFamilyHeading,
    fontSize: Typography.sizes['2xl'],
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  tournamentCard: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tournamentHeader: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  tournamentIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tournamentName: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 2,
  },
  metaText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  summaryBox: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryTitle: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  summaryValue: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  summaryTotalLabel: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.text,
  },
  summaryTotal: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.lg,
    color: Colors.text,
  },
  formSection: {
    marginBottom: Spacing.lg,
  },
  formTitle: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  fieldGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamily,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  inputDisabled: {
    backgroundColor: Colors.backgroundAlt,
    opacity: 0.6,
  },
  cardInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background,
    gap: Spacing.sm,
  },
  cardInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamily,
    color: Colors.text,
  },
  twoCol: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  payBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.gold,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  payBtnDisabled: {
    opacity: 0.7,
  },
  payBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.primary,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingTop: Spacing.sm,
  },
  securityText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  // Result states
  resultCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.eloPositive,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  failIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  resultTitle: {
    fontFamily: Typography.fontFamilyHeading,
    fontSize: Typography.sizes['2xl'],
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  resultDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
    maxWidth: 300,
  },
  receiptBox: {
    width: '100%',
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  receiptTitle: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  receiptLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  receiptValue: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.statusErrorBg,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    width: '100%',
  },
  errorBannerText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.statusErrorText,
    lineHeight: 20,
  },
  cancelBtn: {
    paddingVertical: Spacing.sm,
  },
  cancelText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
});
