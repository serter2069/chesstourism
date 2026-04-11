import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Image, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import StateSection from '../StateSection';
import { ProtoNavTop, ProtoBottomNav } from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

function FormField({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  multiline,
  keyboardType,
}: {
  label: string;
  placeholder: string;
  value?: string;
  onChangeText?: (v: string) => void;
  error?: string;
  multiline?: boolean;
  keyboardType?: string;
}) {
  return (
    <View style={s.formGroup}>
      <Text style={s.formLabel}>{label}</Text>
      <TextInput
        style={[
          s.formInput,
          multiline && s.formTextarea,
          error && s.formInputError,
        ]}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
      {error && <Text style={s.errorText}>{error}</Text>}
    </View>
  );
}

function ApplicationForm({ errors }: { errors?: Record<string, string> }) {
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <View style={s.page}>
      <Text style={s.pageTitle}>Apply to Host Tournaments</Text>
      <Text style={s.pageSubtitle}>
        Submit your organization details to become a certified tournament host on the ChessTourism platform.
      </Text>

      <View style={s.form}>
        <FormField
          label="Organization Name"
          placeholder="Enter your organization name"
          value={orgName}
          onChangeText={setOrgName}
          error={errors?.orgName}
        />
        <FormField
          label="Country"
          placeholder="Select your country"
          error={errors?.country}
        />
        <FormField
          label="Contact Email"
          placeholder="contact@organization.com"
          value={email}
          onChangeText={setEmail}
          error={errors?.email}
        />
        <FormField
          label="Phone"
          placeholder="+1 234 567 8900"
          value={phone}
          onChangeText={setPhone}
          error={errors?.phone}
        />
        <FormField
          label="FIDE Federation Code"
          placeholder="e.g., GEO, NOR, ARM"
          error={errors?.fideCode}
        />
        <FormField
          label="Venue Capacity"
          placeholder="Number of players your venue can accommodate"
          error={errors?.capacity}
        />
        <FormField
          label="Description"
          placeholder="Tell us about your organization and experience hosting chess events..."
          multiline
          error={errors?.description}
        />

        <View style={s.formGroup}>
          <Text style={s.formLabel}>Organization Logo</Text>
          <TouchableOpacity style={s.uploadArea} activeOpacity={0.7}>
            <Image
              source={{ uri: 'https://picsum.photos/seed/chess-venue/200/200' }}
              style={{ width: 60, height: 60, borderRadius: 8 }}
              resizeMode="cover"
            />
            <View style={s.uploadInfo}>
              <Text style={s.uploadText}>Upload your logo</Text>
              <Text style={s.uploadHint}>PNG, JPG up to 2MB</Text>
            </View>
            <Feather name="upload" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={s.submitBtn} activeOpacity={0.85}>
          <Text style={s.submitBtnText}>Submit Application</Text>
          <Feather name="arrow-right" size={16} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function OrgApplyStates() {
  const router = useRouter();
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Clean application form with all fields">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>

        <ProtoNavTop variant="public" />
        <ApplicationForm />
              </View>
</StateSection>

      <StateSection title="FORM_VALIDATION" description="Validation errors on required fields">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>

        <ProtoNavTop variant="public" />
        <ApplicationForm errors={{
          orgName: 'Organization name is required',
          country: 'Please select a country',
          email: 'Please enter a valid email address',
          fideCode: 'FIDE Federation Code must be 3 letters',
          capacity: 'Please enter a valid number',
        }} />
              </View>
</StateSection>

      <StateSection title="SUBMITTING" description="Submit button with loading spinner">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>

        <ProtoNavTop variant="public" />
        <View style={s.page}>
          <Text style={s.pageTitle}>Apply to Host Tournaments</Text>
          <View style={s.form}>
            <FormField label="Organization Name" placeholder="" value="Georgian Chess Federation" />
            <FormField label="Country" placeholder="" value="Georgia" />
            <FormField label="Contact Email" placeholder="" value="info@geochess.org" />
            <TouchableOpacity style={[s.submitBtn, s.submitBtnLoading]} activeOpacity={1}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={s.submitBtnText}>Submitting...</Text>
            </TouchableOpacity>
          </View>
        </View>
              </View>
</StateSection>

      <StateSection title="SUCCESS" description="Application submitted successfully">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>

        <ProtoNavTop variant="public" />
        <View style={s.page}>
          <View style={s.successState}>
            <View style={s.successIcon}>
              <Feather name="check" size={32} color={Colors.eloPositive} />
            </View>
            <Text style={s.successTitle}>Application Submitted!</Text>
            <Text style={s.successSubtitle}>
              Thank you for your interest in hosting chess tournaments. Our team will review your application and respond within 5 business days.
            </Text>
            <View style={s.successInfo}>
              <Feather name="mail" size={14} color={Colors.textMuted} />
              <Text style={s.successInfoText}>A confirmation email has been sent to info@geochess.org</Text>
            </View>
            <TouchableOpacity style={s.homeBtn} activeOpacity={0.85} onPress={() => router.push('/proto/states/landing' as any)}>
              <Feather name="arrow-left" size={16} color={Colors.primary} />
              <Text style={s.homeBtnText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
              </View>
</StateSection>

      <StateSection title="REJECTED" description="Application rejected with reason and options">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>

        <ProtoNavTop variant="public" />
        <View style={s.page}>
          <View style={s.rejectedState}>
            <View style={s.rejectedIcon}>
              <Feather name="x" size={32} color={Colors.error} />
            </View>
            <Text style={s.rejectedTitle}>Application Not Approved</Text>
            <View style={s.rejectedReason}>
              <Text style={s.rejectedReasonLabel}>Reason:</Text>
              <Text style={s.rejectedReasonText}>
                Your organization does not currently meet the minimum venue capacity requirement of 50 players. Additionally, we were unable to verify the FIDE Federation Code provided.
              </Text>
            </View>
            <View style={s.rejectedActions}>
              <TouchableOpacity style={s.appealBtn} activeOpacity={0.85}>
                <Feather name="message-circle" size={16} color={Colors.primary} />
                <Text style={s.appealBtnText}>Appeal Decision</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.reapplyBtn} activeOpacity={0.85}>
                <Feather name="refresh-cw" size={16} color={Colors.gold} />
                <Text style={s.reapplyBtnText}>Reapply</Text>
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
    padding: Spacing.lg,
  },
  pageTitle: {
    fontFamily: Typography.fontFamilyHeading,
    fontSize: Typography.sizes['2xl'],
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  pageSubtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  form: {
    gap: Spacing.md,
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
    paddingVertical: 10,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    backgroundColor: Colors.background,
  },
  formTextarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formInputError: {
    borderColor: Colors.error,
    borderWidth: 1.5,
  },
  errorText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.error,
    marginTop: 2,
  },
  uploadArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: Spacing.md,
  },
  uploadInfo: {
    flex: 1,
  },
  uploadText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  uploadHint: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.gold,
    paddingVertical: 14,
    borderRadius: 4,
    marginTop: Spacing.sm,
  },
  submitBtnLoading: {
    opacity: 0.8,
  },
  submitBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.primary,
  },
  successState: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.statusSuccessBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontFamily: Typography.fontFamilyHeading,
    fontSize: Typography.sizes['2xl'],
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  successSubtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: '85%',
  },
  successInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    backgroundColor: Colors.backgroundAlt,
    padding: Spacing.md,
    borderRadius: 8,
  },
  successInfoText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    flex: 1,
  },
  homeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 10,
    borderRadius: 4,
  },
  homeBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
  },
  rejectedState: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  rejectedIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.statusErrorBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  rejectedTitle: {
    fontFamily: Typography.fontFamilyHeading,
    fontSize: Typography.sizes['2xl'],
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  rejectedReason: {
    backgroundColor: Colors.statusErrorBg,
    borderRadius: 8,
    padding: Spacing.md,
    width: '100%',
    marginBottom: Spacing.lg,
  },
  rejectedReasonLabel: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.error,
    marginBottom: Spacing.xs,
  },
  rejectedReasonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.statusErrorText,
    lineHeight: 22,
  },
  rejectedActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  appealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: 4,
  },
  appealBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
  },
  reapplyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: 4,
  },
  reapplyBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
  },
});
