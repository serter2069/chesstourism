import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

// ─── Field ───────────────────────────────────────────────────────────────────

function Field({ label, locked, children }: { label: string; locked?: boolean; children: React.ReactNode }) {
  return (
    <View style={s.field}>
      <View style={s.fieldLabelRow}>
        <Text style={s.fieldLabel}>{label}</Text>
        {locked && (
          <View style={s.lockedBadge}>
            <Feather name="lock" size={10} color={Colors.textMuted} />
            <Text style={s.lockedText}>Locked</Text>
          </View>
        )}
      </View>
      {children}
    </View>
  );
}

// ─── Section Title ───────────────────────────────────────────────────────────

function SectionTitle({ title }: { title: string }) {
  return <Text style={s.sectionTitle}>{title}</Text>;
}

// ─── Edit Form ───────────────────────────────────────────────────────────────

function EditForm({ activeTournament, saving, saved, showCancel }: {
  activeTournament?: boolean; saving?: boolean; saved?: boolean; showCancel?: boolean;
}) {
  const [name, setName] = useState('Tbilisi Open 2025');
  const [desc, setDesc] = useState('Open FIDE-rated classical tournament in the heart of Tbilisi.');
  const [venue, setVenue] = useState('Tbilisi Chess Club');

  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <Text style={s.heading}>Edit Tournament</Text>

        {activeTournament && (
          <View style={s.warningBanner}>
            <Feather name="alert-triangle" size={16} color={Colors.statusWarningText} />
            <Text style={s.warningText}>Editing an active tournament. Some fields are locked.</Text>
          </View>
        )}

        {saved && (
          <View style={s.successBanner}>
            <Feather name="check-circle" size={16} color={Colors.successGreen} />
            <Text style={s.successText}>Tournament updated successfully</Text>
          </View>
        )}

        {/* Basic Info */}
        <SectionTitle title="Basic Info" />
        <Field label="Tournament Name">
          <TextInput style={s.input} value={name} onChangeText={setName} placeholderTextColor={Colors.textMuted} />
        </Field>
        <Field label="Description">
          <TextInput style={[s.input, s.textarea]} value={desc} onChangeText={setDesc} multiline numberOfLines={4} placeholderTextColor={Colors.textMuted} />
        </Field>
        <Field label="Country">
          <TouchableOpacity style={s.select} activeOpacity={0.7}>
            <Text style={s.selectValue}>Georgia</Text>
            <Feather name="chevron-down" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </Field>
        <Field label="Venue Name">
          <TextInput style={s.input} value={venue} onChangeText={setVenue} placeholderTextColor={Colors.textMuted} />
        </Field>

        {/* Schedule */}
        <SectionTitle title="Schedule" />
        <Field label="Start Date" locked={activeTournament}>
          <TouchableOpacity style={[s.select, activeTournament && s.inputLocked]} activeOpacity={activeTournament ? 1 : 0.7} disabled={activeTournament}>
            <Text style={[s.selectValue, activeTournament && s.textLocked]}>Jun 14, 2025</Text>
          </TouchableOpacity>
        </Field>
        <Field label="End Date" locked={activeTournament}>
          <TouchableOpacity style={[s.select, activeTournament && s.inputLocked]} activeOpacity={activeTournament ? 1 : 0.7} disabled={activeTournament}>
            <Text style={[s.selectValue, activeTournament && s.textLocked]}>Jun 21, 2025</Text>
          </TouchableOpacity>
        </Field>

        {/* Settings */}
        <SectionTitle title="Settings" />
        <Field label="Time Control">
          <TouchableOpacity style={s.select} activeOpacity={0.7}>
            <Text style={s.selectValue}>Classical 90+30</Text>
            <Feather name="chevron-down" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </Field>
        <Field label="Max Participants" locked={activeTournament}>
          <TextInput
            style={[s.input, { width: 120 }, activeTournament && s.inputLocked]}
            value="120"
            editable={!activeTournament}
            placeholderTextColor={Colors.textMuted}
          />
        </Field>

        {/* Actions */}
        <TouchableOpacity style={s.saveBtn} activeOpacity={0.85} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Text style={s.saveBtnText}>Save Changes</Text>
          )}
        </TouchableOpacity>

        {!showCancel && (
          <TouchableOpacity style={s.cancelBtn} activeOpacity={0.7}>
            <Text style={s.cancelBtnText}>Cancel Tournament</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Cancel Confirmation Modal */}
      {showCancel && (
        <View style={s.modalOverlay}>
          <View style={s.modal}>
            <Feather name="alert-triangle" size={32} color={Colors.error} />
            <Text style={s.modalTitle}>Cancel Tournament?</Text>
            <Text style={s.modalDesc}>This action cannot be undone. All registered players will be notified and refunds will be issued for paid entries.</Text>
            <TouchableOpacity style={s.modalDangerBtn} activeOpacity={0.85}>
              <Text style={s.modalDangerText}>Confirm Cancellation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.modalBackBtn} activeOpacity={0.7}>
              <Text style={s.modalBackText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export default function TournamentEditStates() {
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Edit form with pre-filled values">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          null
          <View style={{ flex: 1 }}>

        <EditForm />
                </View>
          null
        </View>
</StateSection>
      <StateSection title="EDITING_ACTIVE" description="Active tournament - some fields locked">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          null
          <View style={{ flex: 1 }}>

        <EditForm activeTournament />
                </View>
          null
        </View>
</StateSection>
      <StateSection title="SAVING" description="Save in progress">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          null
          <View style={{ flex: 1 }}>

        <EditForm saving />
                </View>
          null
        </View>
</StateSection>
      <StateSection title="SAVED" description="Success banner shown">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          null
          <View style={{ flex: 1 }}>

        <EditForm saved />
                </View>
          null
        </View>
</StateSection>
      <StateSection title="CANCEL_CONFIRM" description="Cancel tournament confirmation modal">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          null
          <View style={{ flex: 1 }}>

        <EditForm showCancel />
                </View>
          null
        </View>
</StateSection>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { backgroundColor: Colors.background, position: 'relative' as any },
  container: { padding: Spacing.md },
  heading: { fontFamily: Typography.fontFamilyHeading, fontSize: Typography.sizes['2xl'], color: Colors.text, marginBottom: Spacing.md },
  warningBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.statusWarningBg, padding: Spacing.md, borderRadius: 8, marginBottom: Spacing.md,
  },
  warningText: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.sm, color: Colors.statusWarningText, flex: 1 },
  successBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.statusSuccessBg, padding: Spacing.md, borderRadius: 8, marginBottom: Spacing.md,
  },
  successText: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.sm, color: Colors.successGreen },
  sectionTitle: {
    fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.lg, color: Colors.text,
    marginTop: Spacing.lg, marginBottom: Spacing.md, paddingTop: Spacing.md,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  field: { marginBottom: Spacing.md },
  fieldLabelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xs },
  fieldLabel: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.sm, color: Colors.text },
  lockedBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  lockedText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted },
  input: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: Spacing.md,
    paddingVertical: 10, fontFamily: Typography.fontFamily, fontSize: Typography.sizes.base, color: Colors.text,
    backgroundColor: Colors.background,
  },
  inputLocked: { backgroundColor: Colors.backgroundAlt, borderColor: Colors.border },
  textLocked: { color: Colors.textMuted },
  textarea: { height: 100, textAlignVertical: 'top' },
  select: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: Spacing.md,
    paddingVertical: 12, backgroundColor: Colors.background,
  },
  selectValue: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.base, color: Colors.text },
  saveBtn: {
    backgroundColor: Colors.gold, borderRadius: 8, paddingVertical: 14,
    alignItems: 'center', marginTop: Spacing.lg,
  },
  saveBtnText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.primary },
  cancelBtn: { alignItems: 'center', marginTop: Spacing.md, paddingVertical: Spacing.sm },
  cancelBtnText: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.sm, color: Colors.error },
  modalOverlay: {
    position: 'absolute' as any, top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: Colors.overlay, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl,
  },
  modal: {
    backgroundColor: Colors.background, borderRadius: 16, padding: Spacing.xl,
    alignItems: 'center', width: '100%', maxWidth: 360,
  },
  modalTitle: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.xl, color: Colors.text, marginTop: Spacing.md },
  modalDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm, lineHeight: 22 },
  modalDangerBtn: {
    backgroundColor: Colors.error, borderRadius: 8, paddingVertical: 14,
    paddingHorizontal: Spacing.xl, alignSelf: 'stretch', alignItems: 'center', marginTop: Spacing.lg,
  },
  modalDangerText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.background },
  modalBackBtn: { alignItems: 'center', paddingVertical: Spacing.sm, marginTop: Spacing.sm },
  modalBackText: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.sm, color: Colors.textMuted },
});
