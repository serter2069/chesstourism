import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import StateSection from '../StateSection';
import { ProtoNavTop, ProtoBottomNav } from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

export default function PaymentSuccessStates() {
  const router = useRouter();
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Full-screen payment success confirmation">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>

        <ProtoNavTop variant="none" />
        <View style={s.page}>
          <View style={s.content}>
            <View style={s.iconCircle}>
              <Feather name="check" size={40} color={Colors.gold} />
            </View>

            <Text style={s.title}>Payment Successful!</Text>
            <Text style={s.subtitle}>You are registered for Tbilisi Open 2025</Text>

            <View style={s.detailsCard}>
              <View style={s.detailRow}>
                <Text style={s.detailLabel}>Tournament</Text>
                <Text style={s.detailValue}>Tbilisi Open 2025</Text>
              </View>
              <View style={s.detailDivider} />
              <View style={s.detailRow}>
                <Text style={s.detailLabel}>Date</Text>
                <Text style={s.detailValue}>June 14-21, 2025</Text>
              </View>
              <View style={s.detailDivider} />
              <View style={s.detailRow}>
                <Text style={s.detailLabel}>Amount</Text>
                <Text style={s.detailAmount}>{'\u20AC'}50.00</Text>
              </View>
              <View style={s.detailDivider} />
              <View style={s.detailRow}>
                <Text style={s.detailLabel}>Transaction ID</Text>
                <Text style={s.detailValue}>TXN-8472910</Text>
              </View>
            </View>

            <View style={s.confirmInfo}>
              <Feather name="mail" size={14} color={Colors.textMuted} />
              <Text style={s.confirmText}>A confirmation email has been sent to your registered address</Text>
            </View>

            <View style={s.buttonGroup}>
              <TouchableOpacity style={s.primaryBtn} activeOpacity={0.85} onPress={() => router.push('/proto/states/my-registrations' as any)}>
                <Feather name="list" size={16} color={Colors.primary} />
                <Text style={s.primaryBtnText}>View My Registrations</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.secondaryBtn} activeOpacity={0.85} onPress={() => router.push('/proto/states/tournament-detail' as any)}>
                <Feather name="arrow-left" size={16} color={Colors.text} />
                <Text style={s.secondaryBtnText}>Back to Tournament</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
              </View>
</StateSection>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: {
    backgroundColor: Colors.background,
    minHeight: 600,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 3,
    borderColor: Colors.gold,
  },
  title: {
    fontFamily: Typography.fontFamilyHeading,
    fontSize: Typography.sizes['3xl'],
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.base,
    color: Colors.textMuted,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  detailsCard: {
    width: '100%',
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  detailLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  detailValue: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  detailAmount: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.lg,
    color: Colors.eloPositive,
  },
  detailDivider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  confirmInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  confirmText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    flex: 1,
  },
  buttonGroup: {
    width: '100%',
    gap: Spacing.md,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.gold,
    paddingVertical: 14,
    borderRadius: 4,
  },
  primaryBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.primary,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: 14,
    borderRadius: 4,
  },
  secondaryBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.text,
  },
});
