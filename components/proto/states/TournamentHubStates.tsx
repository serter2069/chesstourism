import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

// ─── Status Badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const meta: Record<string, { bg: string; color: string }> = {
    OPEN: { bg: Colors.statusSuccessBg, color: '#1A6B3A' },
    'IN PROGRESS': { bg: Colors.statusInfoBg, color: Colors.primary },
    COMPLETED: { bg: Colors.backgroundAlt, color: Colors.textMuted },
  };
  const m = meta[status] || meta.OPEN;
  return (
    <View style={[s.statusBadge, { backgroundColor: m.bg }]}>
      <Text style={[s.statusText, { color: m.color }]}>{status}</Text>
    </View>
  );
}

// ─── Quick Stat ──────────────────────────────────────────────────────────────

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.quickStat}>
      <Text style={s.quickStatValue}>{value}</Text>
      <Text style={s.quickStatLabel}>{label}</Text>
    </View>
  );
}

// ─── Action Card ─────────────────────────────────────────────────────────────

function ActionCard({ icon, label, count }: { icon: string; label: string; count?: number }) {
  return (
    <TouchableOpacity style={s.actionCard} activeOpacity={0.8}>
      <View style={s.actionIconWrap}>
        <Feather name={icon as any} size={22} color={Colors.gold} />
      </View>
      <Text style={s.actionLabel}>{label}</Text>
      {count !== undefined && (
        <View style={s.countBadge}>
          <Text style={s.countText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Hub Content ─────────────────────────────────────────────────────────────

function HubContent({ status, currentRound, showStartNext, showFinalResults }: {
  status: string; currentRound: number; showStartNext?: boolean; showFinalResults?: boolean;
}) {
  const actions = [
    { icon: 'users', label: 'Registrations', count: 87 },
    { icon: 'layers', label: 'Rounds', count: 7 },
    { icon: 'bar-chart-2', label: 'Results', count: currentRound > 0 ? currentRound : undefined },
    { icon: 'camera', label: 'Photos', count: 12 },
    { icon: 'bell', label: 'Announcements', count: 5 },
    { icon: 'settings', label: 'Edit Details' },
  ];

  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        {/* Header */}
        <View style={s.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.heading}>Tbilisi Open 2025</Text>
            <Text style={s.subheading}>Jun 14-21, 2025 -- Tbilisi Chess Club</Text>
          </View>
          <StatusBadge status={status} />
        </View>

        {/* Quick Stats */}
        <View style={s.statsRow}>
          <QuickStat label="Registered" value="87" />
          <QuickStat label="Rounds" value="7" />
          <QuickStat label="Current Round" value={String(currentRound)} />
        </View>

        {/* Start Next Round / View Final Results */}
        {showStartNext && (
          <TouchableOpacity style={s.prominentBtn} activeOpacity={0.85}>
            <Feather name="play" size={18} color={Colors.primary} />
            <Text style={s.prominentBtnText}>Start Round {currentRound + 1}</Text>
          </TouchableOpacity>
        )}
        {showFinalResults && (
          <View style={{ gap: Spacing.sm }}>
            <TouchableOpacity style={s.prominentBtn} activeOpacity={0.85}>
              <Feather name="bar-chart-2" size={18} color={Colors.primary} />
              <Text style={s.prominentBtnText}>View Final Results</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.secondaryBtn} activeOpacity={0.85}>
              <Feather name="award" size={16} color={Colors.gold} />
              <Text style={s.secondaryBtnText}>Issue Certificates</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Action Grid */}
        <Text style={s.sectionTitle}>Management</Text>
        <View style={s.actionGrid}>
          {actions.map((a) => (
            <ActionCard key={a.label} icon={a.icon} label={a.label} count={a.count} />
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export default function TournamentHubStates() {
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Tournament hub with status OPEN, action cards grid">
        <HubContent status="OPEN" currentRound={3} />
      </StateSection>
      <StateSection title="IN_PROGRESS" description="Tournament in progress, Start Next Round button visible">
        <HubContent status="IN PROGRESS" currentRound={3} showStartNext />
      </StateSection>
      <StateSection title="COMPLETED" description="Tournament completed, final results and certificates">
        <HubContent status="COMPLETED" currentRound={7} showFinalResults />
      </StateSection>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { backgroundColor: Colors.background, maxWidth: 430 },
  container: { padding: Spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: Spacing.lg },
  heading: { fontFamily: Typography.fontFamilyHeading, fontSize: Typography.sizes['2xl'], color: Colors.text },
  subheading: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.textMuted, marginTop: 4 },
  statusBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontFamily: Typography.fontFamilySemiBold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  quickStat: {
    flex: 1, backgroundColor: Colors.backgroundAlt, borderRadius: 8, padding: Spacing.md,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  quickStatValue: { fontFamily: Typography.fontFamilyBold, fontSize: Typography.sizes['2xl'], color: Colors.primary },
  quickStatLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted, marginTop: 2 },
  prominentBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.gold, borderRadius: 8, paddingVertical: 16, marginBottom: Spacing.md,
  },
  prominentBtnText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.primary },
  secondaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    borderWidth: 1.5, borderColor: Colors.gold, borderRadius: 8, paddingVertical: 14, marginBottom: Spacing.md,
  },
  secondaryBtnText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.sm, color: Colors.gold },
  sectionTitle: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.lg, color: Colors.text, marginBottom: Spacing.md },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  actionCard: {
    width: '48%' as any, backgroundColor: Colors.backgroundAlt, borderRadius: 12, padding: Spacing.md,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.border, position: 'relative',
  },
  actionIconWrap: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm,
  },
  actionLabel: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.sm, color: Colors.text },
  countBadge: {
    position: 'absolute', top: Spacing.sm, right: Spacing.sm,
    backgroundColor: Colors.gold, borderRadius: 10, minWidth: 20, height: 20,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  countText: { fontFamily: Typography.fontFamilySemiBold, fontSize: 10, color: Colors.primary },
});
