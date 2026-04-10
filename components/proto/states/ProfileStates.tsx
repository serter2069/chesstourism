import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import ProtoPlaceholderImage from '../ProtoPlaceholderImage';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

// ─── Form Field ──────────────────────────────────────────────────────────────

function Field({
  label,
  value,
  placeholder,
  editable = false,
  multiline,
  onChangeText,
}: {
  label: string;
  value: string;
  placeholder?: string;
  editable?: boolean;
  multiline?: boolean;
  onChangeText?: (v: string) => void;
}) {
  return (
    <View style={s.fieldGroup}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        style={[
          s.input,
          !editable && s.inputReadonly,
          multiline && s.inputMultiline,
        ]}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        editable={editable}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        onChangeText={onChangeText}
      />
    </View>
  );
}

// ─── Profile Content ─────────────────────────────────────────────────────────

function ProfileContent({
  editing,
  saving,
  saved,
  fideLinked,
}: {
  editing?: boolean;
  saving?: boolean;
  saved?: boolean;
  fideLinked?: boolean;
}) {
  const [name, setName] = useState('Magnus Carlsen');
  const [bio, setBio] = useState('Professional chess player. World Chess Champion. Love exploring new cities through tournaments.');
  const [country, setCountry] = useState('Norway');

  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="profile" />
      <View style={s.content}>
        {saved && (
          <View style={s.successBanner}>
            <Feather name="check-circle" size={16} color={Colors.statusSuccessText} />
            <Text style={s.successText}>Profile updated successfully</Text>
          </View>
        )}

        {/* Avatar section */}
        <View style={s.avatarRow}>
          <ProtoPlaceholderImage type="avatar" size={80} borderRadius={40} label="MC" />
          <View style={s.avatarInfo}>
            <Text style={s.avatarName}>Magnus Carlsen</Text>
            <Text style={s.avatarEmail}>magnus@example.com</Text>
            <TouchableOpacity style={s.editAvatarBtn} activeOpacity={0.7}>
              <Feather name="edit-2" size={14} color={Colors.gold} />
              <Text style={s.editAvatarText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Personal Info */}
        <Text style={s.sectionTitle}>Personal Information</Text>
        <Field
          label="Display Name"
          value={name}
          editable={editing}
          onChangeText={setName}
          placeholder="Your name"
        />
        <Field
          label="Country"
          value={country}
          editable={editing}
          onChangeText={setCountry}
          placeholder="Select country"
        />
        <Field
          label="Bio"
          value={bio}
          editable={editing}
          multiline
          onChangeText={setBio}
          placeholder="Tell us about yourself"
        />

        {/* Chess Info */}
        <Text style={s.sectionTitle}>Chess Information</Text>
        <View style={s.fieldGroup}>
          <Text style={s.label}>FIDE ID</Text>
          <View style={s.fideRow}>
            <TextInput
              style={[s.input, { flex: 1 }, !editing && s.inputReadonly]}
              value={fideLinked ? '1000017' : ''}
              placeholder="Enter your FIDE ID"
              placeholderTextColor={Colors.textMuted}
              editable={editing && !fideLinked}
            />
            {fideLinked && (
              <View style={s.verifiedBadge}>
                <Feather name="check-circle" size={16} color="#2E7D32" />
                <Text style={s.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
        </View>
        <View style={s.fieldGroup}>
          <Text style={s.label}>Rating</Text>
          <View style={s.ratingDisplay}>
            <Text style={s.ratingValue}>2156</Text>
            <Text style={s.ratingLabel}>ELO</Text>
          </View>
        </View>

        {/* Account */}
        <Text style={s.sectionTitle}>Account</Text>
        <View style={s.accountRow}>
          <Feather name="mail" size={16} color={Colors.textMuted} />
          <Text style={s.accountEmail}>magnus@example.com</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={s.linkGold}>Change Email</Text>
          </TouchableOpacity>
        </View>
        <View style={s.accountRow}>
          <Feather name="lock" size={16} color={Colors.textMuted} />
          <Text style={s.accountEmail}>Password</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={s.linkGold}>Change Password</Text>
          </TouchableOpacity>
        </View>

        {/* Save button */}
        <TouchableOpacity
          style={[s.saveBtn, saving && s.saveBtnDisabled]}
          activeOpacity={0.85}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Text style={s.saveBtnText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── States ──────────────────────────────────────────────────────────────────

export default function ProfileStates() {
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Profile view mode, fields read-only">
        <ProfileContent />
      </StateSection>

      <StateSection title="EDITING" description="Fields active and editable">
        <ProfileContent editing />
      </StateSection>

      <StateSection title="SAVING" description="Save button with spinner, fields locked">
        <ProfileContent saving />
      </StateSection>

      <StateSection title="SAVED" description="Success toast banner after save">
        <ProfileContent saved />
      </StateSection>

      <StateSection title="FIDE_LINKED" description="FIDE ID verified with green checkmark badge">
        <ProfileContent fideLinked />
      </StateSection>
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    backgroundColor: Colors.background,
    maxWidth: 430,
  },
  content: {
    padding: Spacing.md,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  avatarInfo: {
    flex: 1,
  },
  avatarName: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.lg,
    color: Colors.text,
  },
  avatarEmail: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  editAvatarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  editAvatarText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.gold,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.text,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.sm,
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
  inputReadonly: {
    backgroundColor: Colors.backgroundAlt,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  fideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.statusSuccessBg,
    borderRadius: 16,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  verifiedText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.xs,
    color: '#2E7D32',
  },
  ratingDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignSelf: 'flex-start',
  },
  ratingValue: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.xl,
    color: Colors.gold,
  },
  ratingLabel: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.xs,
    color: Colors.white,
    opacity: 0.6,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  accountEmail: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  linkGold: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.gold,
  },
  saveBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.primary,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.statusSuccessBg,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  successText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.statusSuccessText,
  },
});
