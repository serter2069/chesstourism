import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

function SearchForm() {
  const [certId, setCertId] = useState('');
  return (
    <View style={s.searchSection}>
      <View style={s.formGroup}>
        <Text style={s.formLabel}>Certificate ID</Text>
        <TextInput
          style={s.formInput}
          placeholder="Enter certificate ID (e.g., CERT-2025-001234)"
          placeholderTextColor={Colors.textMuted}
          value={certId}
          onChangeText={setCertId}
        />
      </View>
      <TouchableOpacity style={s.verifyBtn} activeOpacity={0.85}>
        <Feather name="shield" size={16} color={Colors.primary} />
        <Text style={s.verifyBtnText}>Verify Certificate</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function CertVerifyStates() {
  const router = useRouter();
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Certificate lookup page with search field">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>

        <ProtoNav variant="public" />
        <View style={s.page}>
          <View style={s.headerSection}>
            <Feather name="award" size={40} color={Colors.gold} />
            <Text style={s.pageTitle}>Certificate Verification</Text>
            <Text style={s.pageSubtitle}>
              Verify the authenticity of a tournament certificate issued by the International Chess Tourism Association.
            </Text>
          </View>
          <SearchForm />
        </View>
              </View>
</StateSection>

      <StateSection title="VALID" description="Certificate found and verified">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>

        <ProtoNav variant="public" />
        <View style={s.page}>
          <View style={s.headerSection}>
            <Feather name="award" size={40} color={Colors.gold} />
            <Text style={s.pageTitle}>Certificate Verification</Text>
          </View>
          <SearchForm />

          <View style={s.validCard}>
            <View style={s.validHeader}>
              <View style={s.validIconWrap}>
                <Feather name="check-circle" size={28} color={Colors.eloPositive} />
              </View>
              <Text style={s.validTitle}>Certificate Verified</Text>
              <Text style={s.validSubtitle}>This certificate is authentic and valid</Text>
            </View>

            <View style={s.certDetails}>
              <View style={s.certRow}>
                <Text style={s.certLabel}>Player Name</Text>
                <Text style={s.certValue}>Magnus Eriksson</Text>
              </View>
              <View style={s.certDivider} />
              <TouchableOpacity style={s.certRow} onPress={() => router.push('/proto/states/tournament-detail' as any)} activeOpacity={0.7}>
                <Text style={s.certLabel}>Tournament</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={[s.certValue, { color: Colors.gold }]}>Tbilisi Open 2025</Text>
                  <Feather name="external-link" size={12} color={Colors.gold} />
                </View>
              </TouchableOpacity>
              <View style={s.certDivider} />
              <View style={s.certRow}>
                <Text style={s.certLabel}>Result</Text>
                <View style={s.resultBadge}>
                  <Text style={s.resultBadgeText}>3rd Place</Text>
                </View>
              </View>
              <View style={s.certDivider} />
              <View style={s.certRow}>
                <Text style={s.certLabel}>Date</Text>
                <Text style={s.certValue}>June 21, 2025</Text>
              </View>
              <View style={s.certDivider} />
              <View style={s.certRow}>
                <Text style={s.certLabel}>FIDE ID</Text>
                <Text style={s.certValue}>1234567</Text>
              </View>
              <View style={s.certDivider} />
              <View style={s.certRow}>
                <Text style={s.certLabel}>Issued By</Text>
                <Text style={s.certValue}>Giorgi Beridze</Text>
              </View>
            </View>

            <View style={s.actionRow}>
              <TouchableOpacity style={s.shareBtn} activeOpacity={0.85}>
                <Feather name="share-2" size={14} color={Colors.primary} />
                <Text style={s.shareBtnText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.downloadBtn} activeOpacity={0.85}>
                <Feather name="download" size={14} color={Colors.background} />
                <Text style={s.downloadBtnText}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
              </View>
</StateSection>

      <StateSection title="INVALID" description="Certificate not found or invalid">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>

        <ProtoNav variant="public" />
        <View style={s.page}>
          <View style={s.headerSection}>
            <Feather name="award" size={40} color={Colors.gold} />
            <Text style={s.pageTitle}>Certificate Verification</Text>
          </View>
          <SearchForm />

          <View style={s.invalidCard}>
            <View style={s.invalidIconWrap}>
              <Feather name="x-circle" size={36} color={Colors.error} />
            </View>
            <Text style={s.invalidTitle}>Certificate Not Found</Text>
            <Text style={s.invalidSubtitle}>
              The certificate ID you entered does not match any records in our system. This could mean the certificate is invalid, expired, or the ID was entered incorrectly.
            </Text>
            <TouchableOpacity style={s.retryBtn} activeOpacity={0.85}>
              <Text style={s.retryBtnText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
              </View>
</StateSection>

      <StateSection title="LOADING" description="Verifying certificate with spinner">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>

        <ProtoNav variant="public" />
        <View style={s.page}>
          <View style={s.headerSection}>
            <Feather name="award" size={40} color={Colors.gold} />
            <Text style={s.pageTitle}>Certificate Verification</Text>
          </View>
          <View style={s.searchSection}>
            <View style={s.formGroup}>
              <Text style={s.formLabel}>Certificate ID</Text>
              <TextInput
                style={s.formInput}
                value="CERT-2025-001234"
                editable={false}
              />
            </View>
            <View style={[s.verifyBtn, s.verifyBtnLoading]}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={s.verifyBtnText}>Verifying...</Text>
            </View>
          </View>

          <View style={s.loadingState}>
            <View style={s.spinner}>
              <ActivityIndicator size="large" color={Colors.gold} />
            </View>
            <Text style={s.loadingText}>Checking certificate authenticity...</Text>
            <Text style={s.loadingSubtext}>This may take a few seconds</Text>
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
    padding: Spacing.lg,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  pageTitle: {
    fontFamily: Typography.fontFamilyHeading,
    fontSize: Typography.sizes['2xl'],
    color: Colors.text,
  },
  pageSubtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '85%',
  },
  searchSection: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  formGroup: {
    gap: Spacing.xs,
  },
  formLabel: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  verifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.gold,
    paddingVertical: 14,
    borderRadius: 4,
  },
  verifyBtnLoading: {
    opacity: 0.8,
  },
  verifyBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.primary,
  },
  validCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.eloPositive,
    overflow: 'hidden',
  },
  validHeader: {
    alignItems: 'center',
    backgroundColor: Colors.statusSuccessBg,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  validIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  validTitle: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.lg,
    color: Colors.eloPositive,
  },
  validSubtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  certDetails: {
    padding: Spacing.lg,
  },
  certRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  certLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  certValue: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  certDivider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  resultBadge: {
    backgroundColor: Colors.statusWarningBg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 12,
  },
  resultBadgeText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.xs,
    color: Colors.statusWarningText,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.lg,
    paddingTop: 0,
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 4,
  },
  shareBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
  },
  downloadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 4,
  },
  downloadBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.background,
  },
  invalidCard: {
    alignItems: 'center',
    backgroundColor: Colors.statusErrorBg,
    borderRadius: 12,
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  invalidIconWrap: {
    marginBottom: Spacing.sm,
  },
  invalidTitle: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.lg,
    color: Colors.error,
  },
  invalidSubtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.statusErrorText,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  retryBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.error,
  },
  loadingState: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
    gap: Spacing.md,
  },
  spinner: {
    marginBottom: Spacing.sm,
  },
  loadingText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.text,
  },
  loadingSubtext: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
});
