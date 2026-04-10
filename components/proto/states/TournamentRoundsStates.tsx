import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const ROUNDS = [
  { num: 1, date: 'Jun 15', status: 'Completed', pairings: 44 },
  { num: 2, date: 'Jun 16', status: 'Completed', pairings: 44 },
  { num: 3, date: 'Jun 16', status: 'Completed', pairings: 44 },
  { num: 4, date: 'Jun 17', status: 'Active', pairings: 44 },
  { num: 5, date: 'Jun 17', status: 'Upcoming', pairings: 0 },
  { num: 6, date: 'Jun 18', status: 'Upcoming', pairings: 0 },
  { num: 7, date: 'Jun 20', status: 'Upcoming', pairings: 0 },
];

const PAIRINGS = [
  { board: 1, white: 'Magnus Eriksson', black: 'Elena Kozlov', result: '--' },
  { board: 2, white: 'Carlos Mendez', black: 'Giorgi Tabidze', result: '--' },
  { board: 3, white: 'Anna Petrov', black: 'Piotr Nowak', result: '--' },
  { board: 4, white: 'Ibrahim Hassan', black: 'Yuki Tanaka', result: '--' },
  { board: 5, white: 'David Okonkwo', black: 'Sergei Volkov', result: '--' },
];

// ─── Status Badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const meta: Record<string, { bg: string; color: string }> = {
    Completed: { bg: Colors.statusSuccessBg, color: '#1A6B3A' },
    Active: { bg: Colors.statusInfoBg, color: Colors.primary },
    Upcoming: { bg: Colors.backgroundAlt, color: Colors.textMuted },
  };
  const m = meta[status] || meta.Upcoming;
  return (
    <View style={[s.badge, { backgroundColor: m.bg }]}>
      <Text style={[s.badgeText, { color: m.color }]}>{status}</Text>
    </View>
  );
}

// ─── Round Row ───────────────────────────────────────────────────────────────

function RoundRow({ round, showActions }: { round: typeof ROUNDS[0]; showActions?: boolean }) {
  return (
    <View style={s.roundRow}>
      <View style={s.roundNum}>
        <Text style={s.roundNumText}>{round.num}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.roundTitle}>Round {round.num}</Text>
        <View style={s.roundMeta}>
          <Text style={s.roundDate}>{round.date}</Text>
          {round.pairings > 0 && <Text style={s.roundPairings}>{round.pairings} pairings</Text>}
        </View>
      </View>
      <StatusBadge status={round.status} />
      {showActions && (
        <TouchableOpacity style={s.roundAction} activeOpacity={0.7}>
          <Feather
            name={round.status === 'Upcoming' ? 'settings' : 'eye'}
            size={16}
            color={Colors.textMuted}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Default View ────────────────────────────────────────────────────────────

function DefaultView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <Text style={s.heading}>Rounds Management</Text>
        <Text style={s.subtext}>7 rounds total -- 3 completed, 1 active, 3 upcoming</Text>

        {ROUNDS.map((r) => <RoundRow key={r.num} round={r} showActions />)}

        <TouchableOpacity style={s.generateBtn} activeOpacity={0.85}>
          <Feather name="cpu" size={16} color={Colors.primary} />
          <Text style={s.generateBtnText}>Generate Next Round Pairings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Pairings View ───────────────────────────────────────────────────────────

function PairingsView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <TouchableOpacity style={s.backRow} activeOpacity={0.7}>
          <Feather name="arrow-left" size={16} color={Colors.textMuted} />
          <Text style={s.backText}>Back to Rounds</Text>
        </TouchableOpacity>

        <Text style={s.heading}>Round 4 Pairings</Text>
        <StatusBadge status="Active" />

        <View style={s.tableHeader}>
          <Text style={[s.thText, { width: 30 }]}>#</Text>
          <Text style={[s.thText, { flex: 1, textAlign: 'right' }]}>White</Text>
          <Text style={[s.thText, { width: 40, textAlign: 'center' }]}>vs</Text>
          <Text style={[s.thText, { flex: 1 }]}>Black</Text>
        </View>

        {PAIRINGS.map((p) => (
          <View key={p.board} style={s.pairingRow}>
            <Text style={[s.boardNum, { width: 30 }]}>{p.board}</Text>
            <Text style={[s.pairingName, { flex: 1, textAlign: 'right' }]} numberOfLines={1}>{p.white}</Text>
            <Text style={[s.vsText, { width: 40 }]}>vs</Text>
            <Text style={[s.pairingName, { flex: 1 }]} numberOfLines={1}>{p.black}</Text>
          </View>
        ))}

        <TouchableOpacity style={s.publishBtn} activeOpacity={0.85}>
          <Feather name="send" size={16} color={Colors.primary} />
          <Text style={s.publishBtnText}>Publish Pairings</Text>
        </TouchableOpacity>
        <Text style={s.publishNote}>Players will be notified via the app.</Text>
      </View>
    </View>
  );
}

// ─── Generating View ─────────────────────────────────────────────────────────

function GeneratingView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={[s.container, s.centerContent]}>
        <ActivityIndicator size="large" color={Colors.gold} />
        <Text style={s.genTitle}>Generating Swiss Pairings...</Text>
        <Text style={s.genDesc}>Calculating optimal pairings based on standings and Buchholz tiebreaks.</Text>
      </View>
    </View>
  );
}

// ─── Completed View ──────────────────────────────────────────────────────────

function CompletedView() {
  const allCompleted = ROUNDS.map((r) => ({ ...r, status: 'Completed', pairings: 44 }));
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <View style={s.completedBanner}>
          <Feather name="check-circle" size={20} color={Colors.gold} />
          <View style={{ flex: 1 }}>
            <Text style={s.completedTitle}>All Rounds Complete</Text>
            <Text style={s.completedDesc}>7 of 7 rounds finished. Ready to finalize results.</Text>
          </View>
        </View>

        <Text style={s.heading}>Rounds Management</Text>

        {allCompleted.map((r) => <RoundRow key={r.num} round={r} />)}

        <TouchableOpacity style={s.finalizeBtn} activeOpacity={0.85}>
          <Feather name="check-square" size={16} color={Colors.primary} />
          <Text style={s.finalizeBtnText}>Finalize Results</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export default function TournamentRoundsStates() {
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Round list with statuses and actions">
        <DefaultView />
      </StateSection>
      <StateSection title="PAIRINGS_VIEW" description="Expanded round showing pairing table">
        <PairingsView />
      </StateSection>
      <StateSection title="GENERATING" description="Generating Swiss pairings spinner">
        <GeneratingView />
      </StateSection>
      <StateSection title="COMPLETED_ROUND" description="All rounds complete, finalize CTA">
        <CompletedView />
      </StateSection>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { backgroundColor: Colors.background },
  container: { padding: Spacing.md },
  heading: { fontFamily: Typography.fontFamilyHeading, fontSize: Typography.sizes['2xl'], color: Colors.text, marginBottom: Spacing.sm },
  subtext: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.textMuted, marginBottom: Spacing.lg },
  roundRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  roundNum: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  roundNumText: { fontFamily: Typography.fontFamilyBold, fontSize: Typography.sizes.sm, color: Colors.gold },
  roundTitle: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.text },
  roundMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 2 },
  roundDate: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted },
  roundPairings: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted },
  roundAction: { padding: Spacing.xs },
  badge: { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: 12 },
  badgeText: { fontFamily: Typography.fontFamilySemiBold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  generateBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.gold, borderRadius: 8, paddingVertical: 14, marginTop: Spacing.lg,
  },
  generateBtnText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.primary },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.md },
  backText: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.sm, color: Colors.textMuted },
  tableHeader: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: 8,
    borderBottomLeftRadius: 0, borderBottomRightRadius: 0, marginTop: Spacing.lg, marginBottom: 1,
  },
  thText: { fontFamily: Typography.fontFamilySemiBold, fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.5 },
  pairingRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  boardNum: { fontFamily: Typography.fontFamilyBold, fontSize: Typography.sizes.sm, color: Colors.textMuted, textAlign: 'center' },
  pairingName: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.sm, color: Colors.text },
  vsText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted, textAlign: 'center' },
  publishBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.gold, borderRadius: 8, paddingVertical: 14, marginTop: Spacing.lg,
  },
  publishBtnText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.primary },
  publishNote: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm },
  centerContent: { alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing['3xl'] },
  genTitle: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.lg, color: Colors.text, marginTop: Spacing.lg },
  genDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm, maxWidth: 280 },
  completedBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: 12, marginBottom: Spacing.lg,
  },
  completedTitle: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.gold },
  completedDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  finalizeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.gold, borderRadius: 8, paddingVertical: 14, marginTop: Spacing.lg,
  },
  finalizeBtnText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.primary },
});
