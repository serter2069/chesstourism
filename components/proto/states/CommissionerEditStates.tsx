import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Image, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import { ProtoNavTop, ProtoBottomNav } from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

// ─── Chip ────────────────────────────────────────────────────────────────────

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity
      style={[s.chip, selected && s.chipSelected]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Text style={[s.chipText, selected && s.chipTextSelected]}>{label}</Text>
      {selected && <Feather name="x" size={12} color={Colors.background} />}
    </TouchableOpacity>
  );
}

// ─── Form Field ──────────────────────────────────────────────────────────────

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <View style={s.field}>
      <Text style={[s.fieldLabel, error ? { color: Colors.error } : null]}>{label}{error ? ' *' : ''}</Text>
      {children}
      {error && <Text style={s.fieldError}>{error}</Text>}
    </View>
  );
}

// ─── Form Content ────────────────────────────────────────────────────────────

function EditForm({ saving, saved, errors }: { saving?: boolean; saved?: boolean; errors?: Record<string, string> }) {
  const [name, setName] = useState('Alexander Petrov');
  const [bio, setBio] = useState('Experienced FIDE arbiter with 12 years in tournament organization across Eastern Europe and the Caucasus.');
  const [country, setCountry] = useState('Georgia');
  const [years, setYears] = useState('12');
  const [languages, setLanguages] = useState(['English', 'Russian', 'Georgian']);
  const [specs, setSpecs] = useState(['Classical', 'Rapid']);

  const allLanguages = ['English', 'Russian', 'Georgian', 'Armenian'];
  const allSpecs = ['Classical', 'Rapid', 'Blitz'];

  return (
    <View style={s.page}>
      <View style={s.container}>
        <Text style={s.heading}>Edit Profile</Text>

        {saved && (
          <View style={s.successBanner}>
            <Feather name="check-circle" size={16} color={Colors.successGreen} />
            <Text style={s.successText}>Profile updated successfully</Text>
          </View>
        )}

        {/* Avatar */}
        <View style={s.avatarSection}>
          <Image
            source={{ uri: 'https://picsum.photos/seed/commissar-profile/200/200' }}
            style={{ width: 80, height: 80, borderRadius: 40 }}
            resizeMode="cover"
          />
          <TouchableOpacity style={s.changePhotoBtn} activeOpacity={0.8}>
            <Feather name="camera" size={14} color={Colors.gold} />
            <Text style={s.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Fields */}
        <Field label="Display Name" error={errors?.name}>
          <TextInput
            style={[s.input, errors?.name ? s.inputError : null]}
            value={name}
            onChangeText={setName}
            placeholder="Your display name"
            placeholderTextColor={Colors.textMuted}
          />
        </Field>

        <Field label="Bio" error={errors?.bio}>
          <TextInput
            style={[s.input, s.textarea, errors?.bio ? s.inputError : null]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell players about yourself..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={4}
          />
        </Field>

        <Field label="Country">
          <TextInput
            style={s.input}
            value={country}
            onChangeText={setCountry}
            placeholder="Country"
            placeholderTextColor={Colors.textMuted}
          />
        </Field>

        <Field label="Languages Spoken">
          <View style={s.chipRow}>
            {allLanguages.map((l) => (
              <Chip
                key={l}
                label={l}
                selected={languages.includes(l)}
                onPress={() => setLanguages(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l])}
              />
            ))}
          </View>
        </Field>

        <Field label="Specializations">
          <View style={s.chipRow}>
            {allSpecs.map((sp) => (
              <Chip
                key={sp}
                label={sp}
                selected={specs.includes(sp)}
                onPress={() => setSpecs(prev => prev.includes(sp) ? prev.filter(x => x !== sp) : [...prev, sp])}
              />
            ))}
          </View>
        </Field>

        <Field label="Years of Experience">
          <TextInput
            style={[s.input, { width: 100 }]}
            value={years}
            onChangeText={setYears}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={Colors.textMuted}
          />
        </Field>

        {/* Save Button */}
        <TouchableOpacity style={s.saveBtn} activeOpacity={0.85} disabled={saving}>
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

// ─── Export ──────────────────────────────────────────────────────────────────

export default function CommissionerEditStates() {
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Edit commissioner profile form">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <ProtoNavTop variant="client" />
          <View style={{ flex: 1 }}>

        <EditForm />
                </View>
          <ProtoBottomNav variant="client" activeTab="cabinet" />
        </View>
</StateSection>
      <StateSection title="SAVING" description="Save in progress">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <ProtoNavTop variant="client" />
          <View style={{ flex: 1 }}>

        <EditForm saving />
                </View>
          <ProtoBottomNav variant="client" activeTab="cabinet" />
        </View>
</StateSection>
      <StateSection title="SAVED" description="Success banner shown">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <ProtoNavTop variant="client" />
          <View style={{ flex: 1 }}>

        <EditForm saved />
                </View>
          <ProtoBottomNav variant="client" activeTab="cabinet" />
        </View>
</StateSection>
      <StateSection title="VALIDATION_ERROR" description="Required fields highlighted in red">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          <ProtoNavTop variant="client" />
          <View style={{ flex: 1 }}>

        <EditForm errors={{ name: 'Display name is required', bio: 'Bio is required' }} />
                </View>
          <ProtoBottomNav variant="client" activeTab="cabinet" />
        </View>
</StateSection>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { backgroundColor: Colors.background },
  container: { padding: Spacing.md },
  heading: { fontFamily: Typography.fontFamilyHeading, fontSize: Typography.sizes['2xl'], color: Colors.text, marginBottom: Spacing.lg },
  successBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.statusSuccessBg, padding: Spacing.md, borderRadius: 8, marginBottom: Spacing.md,
  },
  successText: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.sm, color: Colors.successGreen },
  avatarSection: { alignItems: 'center', marginBottom: Spacing.lg },
  changePhotoBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    marginTop: Spacing.sm, paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md,
  },
  changePhotoText: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.sm, color: Colors.gold },
  field: { marginBottom: Spacing.md },
  fieldLabel: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.sm, color: Colors.text, marginBottom: Spacing.xs },
  fieldError: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.error, marginTop: 4 },
  input: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: Spacing.md,
    paddingVertical: 10, fontFamily: Typography.fontFamily, fontSize: Typography.sizes.base, color: Colors.text,
    backgroundColor: Colors.background,
  },
  inputError: { borderColor: Colors.error },
  textarea: { height: 100, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2, borderRadius: 20,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.backgroundAlt,
  },
  chipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.sm, color: Colors.textMuted },
  chipTextSelected: { color: Colors.background },
  saveBtn: {
    backgroundColor: Colors.gold, borderRadius: 8, paddingVertical: 14,
    alignItems: 'center', marginTop: Spacing.lg,
  },
  saveBtnText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.primary },
});
