import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import StateSection from '../StateSection';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

// ─── Color Swatch ──────────────────────────────────────────────────────────

function ColorSwatch({ name, hex, usage }: { name: string; hex: string; usage: string }) {
  return (
    <View style={s.colorCard}>
      <View style={[s.colorSwatch, { backgroundColor: hex }]} />
      <View style={s.colorInfo}>
        <Text style={s.colorName}>{name}</Text>
        <Text style={s.colorHex}>{hex}</Text>
        <Text style={s.colorUsage}>{usage}</Text>
      </View>
    </View>
  );
}

// ─── Typography Row ────────────────────────────────────────────────────────

function TypeRow({ label, font, size, weight }: { label: string; font: string; size: number; weight: string }) {
  return (
    <View style={s.typeRow}>
      <Text style={[s.typeLabel, { fontFamily: font as any, fontSize: size, fontWeight: weight as any }]}>{label}</Text>
      <Text style={s.typeMeta}>{size}px / {weight}</Text>
    </View>
  );
}

// ─── Spacing Bar ───────────────────────────────────────────────────────────

function SpacingBar({ name, value }: { name: string; value: number }) {
  return (
    <View style={s.spacingRow}>
      <Text style={s.spacingName}>{name}</Text>
      <View style={[s.spacingBar, { width: value }]} />
      <Text style={s.spacingValue}>{value}px</Text>
    </View>
  );
}

// ─── Radius Box ────────────────────────────────────────────────────────────

function RadiusBox({ name, value }: { name: string; value: number }) {
  return (
    <View style={s.radiusItem}>
      <View style={[s.radiusBox, { borderRadius: value }]} />
      <Text style={s.radiusLabel}>{name}</Text>
      <Text style={s.radiusValue}>{value}px</Text>
    </View>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function BrandStates() {
  return (
    <ScrollView style={s.root} contentContainerStyle={s.content}>
      {/* Background Color — MUST be first block */}
      <StateSection title="DEFAULT" description="Brand design tokens for ChessTourism">
        <View style={s.pageShell}>
          {/* Background Color Block */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Background</Text>
            <View style={[s.bgBlock, { backgroundColor: Colors.background }]}>
              <Text style={s.bgHex}>background: {Colors.background}</Text>
              <Text style={s.bgDesc}>Main background for ALL screens</Text>
            </View>
          </View>

          {/* Color Palette */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Color Palette</Text>
            <View style={s.colorGrid}>
              <ColorSwatch name="primary" hex="#1A2B4A" usage="Headers, buttons, nav" />
              <ColorSwatch name="accent (gold)" hex="#C8A96E" usage="Highlights, CTAs, badges" />
              <ColorSwatch name="surface" hex="#F5F6FA" usage="Cards, alternate sections" />
              <ColorSwatch name="text" hex="#0D1B3E" usage="Body text" />
              <ColorSwatch name="textMuted" hex="#6B7A99" usage="Secondary text, labels" />
              <ColorSwatch name="error" hex="#C0392B" usage="Errors, destructive actions" />
              <ColorSwatch name="border" hex="#DDE1EC" usage="Borders, dividers" />
              <ColorSwatch name="white" hex="#FFFFFF" usage="Card backgrounds, contrast" />
            </View>
          </View>

          {/* Status Colors */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Status Colors</Text>
            <View style={s.colorGrid}>
              <ColorSwatch name="successBg" hex="#EAF3E8" usage="Success states" />
              <ColorSwatch name="successText" hex="#1A6B3A" usage="Success text" />
              <ColorSwatch name="warningBg" hex="#FDF5E6" usage="Warning states" />
              <ColorSwatch name="warningText" hex="#7A5C1E" usage="Warning text" />
              <ColorSwatch name="errorBg" hex="#FAEAEA" usage="Error states" />
              <ColorSwatch name="infoBg" hex="#EEF1F8" usage="Info states" />
            </View>
          </View>

          {/* Typography */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Typography</Text>
            <View style={s.typeTable}>
              <TypeRow label="Heading — Playfair Display" font="PlayfairDisplay_700Bold" size={30} weight="700" />
              <TypeRow label="Heading Large" font="PlayfairDisplay_700Bold" size={24} weight="700" />
              <TypeRow label="Body Bold" font="Inter_700Bold" size={16} weight="700" />
              <TypeRow label="Body Semibold" font="Inter_600SemiBold" size={16} weight="600" />
              <TypeRow label="Body Regular" font="Inter_400Regular" size={16} weight="400" />
              <TypeRow label="Small" font="Inter_500Medium" size={14} weight="500" />
              <TypeRow label="Caption" font="Inter_700Bold" size={12} weight="700" />
            </View>
          </View>

          {/* Spacing */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Spacing Scale</Text>
            <View style={s.spacingList}>
              <SpacingBar name="xs" value={4} />
              <SpacingBar name="sm" value={8} />
              <SpacingBar name="md" value={16} />
              <SpacingBar name="lg" value={24} />
              <SpacingBar name="xl" value={32} />
              <SpacingBar name="2xl" value={48} />
              <SpacingBar name="3xl" value={64} />
              <SpacingBar name="4xl" value={80} />
            </View>
          </View>

          {/* Border Radius */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Border Radius</Text>
            <View style={s.radiusRow}>
              <RadiusBox name="sm" value={2} />
              <RadiusBox name="md" value={4} />
              <RadiusBox name="lg" value={8} />
              <RadiusBox name="xl" value={16} />
              <RadiusBox name="full" value={9999} />
            </View>
          </View>

          {/* Shadows */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Shadows</Text>
            <View style={s.shadowRow}>
              <View style={s.shadowItem}>
                <View style={[s.shadowBox, { shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3 }]} />
                <Text style={s.shadowLabel}>sm</Text>
              </View>
              <View style={s.shadowItem}>
                <View style={[s.shadowBox, { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 8 }]} />
                <Text style={s.shadowLabel}>md</Text>
              </View>
              <View style={s.shadowItem}>
                <View style={[s.shadowBox, { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 20 }]} />
                <Text style={s.shadowLabel}>lg</Text>
              </View>
            </View>
          </View>
        </View>
      </StateSection>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.backgroundAlt },
  content: { padding: Spacing.lg, paddingBottom: Spacing['3xl'] },
  pageShell: { gap: Spacing.xl },
  section: { gap: Spacing.md },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fontFamilyBold,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: Colors.gold,
  },
  // Background block
  bgBlock: {
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  bgHex: {
    fontSize: Typography.sizes['2xl'],
    fontFamily: Typography.fontFamilyBold,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  bgDesc: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  // Color grid
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  colorCard: {
    width: '47%',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  colorSwatch: { height: 80 },
  colorInfo: { padding: Spacing.md },
  colorName: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilySemiBold,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  colorHex: {
    fontSize: Typography.sizes.xs,
    fontFamily: 'monospace',
    color: Colors.textMuted,
    marginTop: 2,
  },
  colorUsage: {
    fontSize: 11,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
    marginTop: 4,
  },
  // Typography
  typeTable: { gap: Spacing.sm },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  typeLabel: { color: Colors.text, flex: 1 },
  typeMeta: {
    fontSize: Typography.sizes.xs,
    fontFamily: 'monospace',
    color: Colors.textMuted,
  },
  // Spacing
  spacingList: { gap: Spacing.xs },
  spacingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  spacingName: {
    width: 40,
    fontSize: Typography.sizes.xs,
    fontFamily: 'monospace',
    color: Colors.textMuted,
  },
  spacingBar: {
    height: 12,
    backgroundColor: Colors.gold,
    borderRadius: 2,
  },
  spacingValue: {
    fontSize: Typography.sizes.xs,
    fontFamily: 'monospace',
    color: Colors.textMuted,
  },
  // Radius
  radiusRow: { flexDirection: 'row', gap: Spacing.lg, flexWrap: 'wrap' },
  radiusItem: { alignItems: 'center' },
  radiusBox: {
    width: 60,
    height: 60,
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  radiusLabel: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  radiusValue: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: Colors.textMuted,
  },
  // Shadows
  shadowRow: { flexDirection: 'row', gap: Spacing.xl },
  shadowItem: { alignItems: 'center' },
  shadowBox: {
    width: 80,
    height: 60,
    backgroundColor: Colors.white,
    borderRadius: 8,
    shadowColor: Colors.primary,
    elevation: 3,
  },
  shadowLabel: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
});
