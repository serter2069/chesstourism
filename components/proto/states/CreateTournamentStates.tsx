import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

// ─── Progress Indicator ──────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  const steps = ['Basics', 'Schedule', 'Review'];
  return (
    <View style={s.stepRow}>
      {steps.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <View key={label} style={s.stepItem}>
            <View style={[s.stepCircle, active && s.stepCircleActive, done && s.stepCircleDone]}>
              {done ? (
                <Feather name="check" size={14} color={Colors.background} />
              ) : (
                <Text style={[s.stepNum, (active || done) && s.stepNumActive]}>{step}</Text>
              )}
            </View>
            <Text style={[s.stepLabel, active && s.stepLabelActive]}>{label}</Text>
            {i < steps.length - 1 && <View style={[s.stepLine, done && s.stepLineDone]} />}
          </View>
        );
      })}
    </View>
  );
}

// ─── Field ───────────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={s.field}>
      <Text style={s.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

// ─── Select ──────────────────────────────────────────────────────────────────

function Select({ value, options }: { value: string; options: string[] }) {
  return (
    <TouchableOpacity style={s.select} activeOpacity={0.7}>
      <Text style={s.selectText}>{value}</Text>
      <Feather name="chevron-down" size={16} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

// ─── Summary Row ─────────────────────────────────────────────────────────────

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.summaryRow}>
      <Text style={s.summaryLabel}>{label}</Text>
      <Text style={s.summaryValue}>{value}</Text>
    </View>
  );
}

// ─── Step 1: Basics ──────────────────────────────────────────────────────────

function Step1() {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [city, setCity] = useState('');
  const [venue, setVenue] = useState('');
  const [maxPart, setMaxPart] = useState('');

  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <Text style={s.heading}>Create Tournament</Text>
        <StepIndicator current={1} />

        <Field label="Tournament Name">
          <TextInput style={s.input} value={name} onChangeText={setName} placeholder="e.g. Tbilisi Open 2025" placeholderTextColor={Colors.textMuted} />
        </Field>
        <Field label="Description">
          <TextInput style={[s.input, s.textarea]} value={desc} onChangeText={setDesc} placeholder="Describe the tournament..." placeholderTextColor={Colors.textMuted} multiline numberOfLines={4} />
        </Field>
        <Field label="Country">
          <Select value="Select country..." options={[]} />
        </Field>
        <Field label="City">
          <TextInput style={s.input} value={city} onChangeText={setCity} placeholder="City name" placeholderTextColor={Colors.textMuted} />
        </Field>
        <Field label="Venue Name">
          <TextInput style={s.input} value={venue} onChangeText={setVenue} placeholder="Venue or club name" placeholderTextColor={Colors.textMuted} />
        </Field>
        <Field label="Max Participants">
          <TextInput style={[s.input, { width: 120 }]} value={maxPart} onChangeText={setMaxPart} placeholder="120" placeholderTextColor={Colors.textMuted} keyboardType="numeric" />
        </Field>

        <TouchableOpacity style={s.btnPrimary} activeOpacity={0.85}>
          <Text style={s.btnPrimaryText}>Next</Text>
          <Feather name="arrow-right" size={16} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Step 2: Schedule ────────────────────────────────────────────────────────

function Step2() {
  const [fee, setFee] = useState('');
  const [rounds, setRounds] = useState('');

  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <Text style={s.heading}>Create Tournament</Text>
        <StepIndicator current={2} />

        <Field label="Start Date">
          <TouchableOpacity style={s.select} activeOpacity={0.7}>
            <Feather name="calendar" size={14} color={Colors.textMuted} />
            <Text style={s.selectText}>Select start date...</Text>
          </TouchableOpacity>
        </Field>
        <Field label="End Date">
          <TouchableOpacity style={s.select} activeOpacity={0.7}>
            <Feather name="calendar" size={14} color={Colors.textMuted} />
            <Text style={s.selectText}>Select end date...</Text>
          </TouchableOpacity>
        </Field>
        <Field label="Time Control">
          <Select value="Classical 90+30" options={['Classical 90+30', 'Rapid 15+10', 'Blitz 3+2', 'Custom']} />
        </Field>
        <Field label="Number of Rounds">
          <TextInput style={[s.input, { width: 100 }]} value={rounds} onChangeText={setRounds} placeholder="7" placeholderTextColor={Colors.textMuted} keyboardType="numeric" />
        </Field>
        <Field label="Entry Fee">
          <View style={s.feeRow}>
            <TextInput style={[s.input, { flex: 1 }]} value={fee} onChangeText={setFee} placeholder="50" placeholderTextColor={Colors.textMuted} keyboardType="numeric" />
            <Select value="EUR" options={['EUR', 'USD', 'GEL']} />
          </View>
        </Field>

        <View style={s.btnRow}>
          <TouchableOpacity style={s.btnOutline} activeOpacity={0.7}>
            <Feather name="arrow-left" size={16} color={Colors.primary} />
            <Text style={s.btnOutlineText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.btnPrimary, { flex: 1 }]} activeOpacity={0.85}>
            <Text style={s.btnPrimaryText}>Next</Text>
            <Feather name="arrow-right" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Step 3: Review ──────────────────────────────────────────────────────────

function Step3() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <Text style={s.heading}>Create Tournament</Text>
        <StepIndicator current={3} />

        <View style={s.summaryCard}>
          <Text style={s.summaryTitle}>Tournament Summary</Text>
          <SummaryRow label="Name" value="Tbilisi Open 2025" />
          <SummaryRow label="Description" value="Open FIDE-rated classical tournament in the heart of Tbilisi." />
          <SummaryRow label="Location" value="Tbilisi, Georgia" />
          <SummaryRow label="Venue" value="Tbilisi Chess Club" />
          <SummaryRow label="Max Participants" value="120" />
          <SummaryRow label="Dates" value="Jun 14-21, 2025" />
          <SummaryRow label="Time Control" value="Classical 90+30" />
          <SummaryRow label="Rounds" value="7" />
          <SummaryRow label="Entry Fee" value="50 EUR" />
        </View>

        <TouchableOpacity style={s.btnGold} activeOpacity={0.85}>
          <Text style={s.btnGoldText}>Publish Tournament</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.btnOutline, { alignSelf: 'stretch', marginTop: Spacing.sm }]} activeOpacity={0.7}>
          <Text style={s.btnOutlineText}>Save as Draft</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Publishing State ────────────────────────────────────────────────────────

function Publishing() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={[s.container, s.centerContent]}>
        <ActivityIndicator size="large" color={Colors.gold} />
        <Text style={s.publishingText}>Publishing your tournament...</Text>
        <Text style={s.publishingDesc}>This may take a moment while we set everything up.</Text>
      </View>
    </View>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export default function CreateTournamentStates() {
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="STEP1_BASICS" description="Step 1 of 3 - Basic tournament info">
        <Step1 />
      </StateSection>
      <StateSection title="STEP2_SCHEDULE" description="Step 2 of 3 - Schedule and pricing">
        <Step2 />
      </StateSection>
      <StateSection title="STEP3_REVIEW" description="Step 3 of 3 - Summary and publish">
        <Step3 />
      </StateSection>
      <StateSection title="PUBLISHING" description="Publishing in progress">
        <Publishing />
      </StateSection>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { backgroundColor: Colors.background, maxWidth: 430 },
  container: { padding: Spacing.md },
  heading: { fontFamily: Typography.fontFamilyHeading, fontSize: Typography.sizes['2xl'], color: Colors.text, marginBottom: Spacing.md },
  stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl, gap: 0 },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepCircle: {
    width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  stepCircleActive: { borderColor: Colors.gold, backgroundColor: Colors.gold },
  stepCircleDone: { borderColor: Colors.gold, backgroundColor: Colors.gold },
  stepNum: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.sm, color: Colors.textMuted },
  stepNumActive: { color: Colors.primary },
  stepLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted, marginLeft: 4, marginRight: Spacing.sm },
  stepLabelActive: { color: Colors.gold, fontFamily: Typography.fontFamilySemiBold },
  stepLine: { width: 24, height: 2, backgroundColor: Colors.border, marginRight: Spacing.sm },
  stepLineDone: { backgroundColor: Colors.gold },
  field: { marginBottom: Spacing.md },
  fieldLabel: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.sm, color: Colors.text, marginBottom: Spacing.xs },
  input: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: Spacing.md,
    paddingVertical: 10, fontFamily: Typography.fontFamily, fontSize: Typography.sizes.base, color: Colors.text,
    backgroundColor: Colors.background,
  },
  textarea: { height: 100, textAlignVertical: 'top' },
  select: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: Spacing.md,
    paddingVertical: 12, backgroundColor: Colors.background,
  },
  selectText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.base, color: Colors.textMuted },
  feeRow: { flexDirection: 'row', gap: Spacing.sm },
  btnPrimary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.gold, borderRadius: 8, paddingVertical: 14, marginTop: Spacing.lg,
  },
  btnPrimaryText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.primary },
  btnOutline: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 8, paddingVertical: 12, paddingHorizontal: Spacing.lg,
  },
  btnOutlineText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.sm, color: Colors.primary },
  btnRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.lg },
  btnGold: {
    backgroundColor: Colors.gold, borderRadius: 8, paddingVertical: 16,
    alignItems: 'center', marginTop: Spacing.lg,
  },
  btnGoldText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.lg, color: Colors.primary },
  summaryCard: {
    backgroundColor: Colors.backgroundAlt, borderRadius: 12, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  summaryTitle: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.lg, color: Colors.text, marginBottom: Spacing.md },
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  summaryLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.textMuted, flex: 1 },
  summaryValue: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.sm, color: Colors.text, flex: 1.5, textAlign: 'right' },
  centerContent: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing['3xl'] },
  publishingText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.lg, color: Colors.text, marginTop: Spacing.lg },
  publishingDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.textMuted, marginTop: Spacing.sm },
});
