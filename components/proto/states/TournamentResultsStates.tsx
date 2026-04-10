import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const ROUND3_RESULTS = [
  { board: 1, white: 'Magnus Eriksson', black: 'Anna Petrov', result: '1-0' },
  { board: 2, white: 'Giorgi Tabidze', black: 'Ibrahim Hassan', result: '1/2' },
  { board: 3, white: 'Piotr Nowak', black: 'Elena Kozlov', result: '0-1' },
  { board: 4, white: 'Carlos Mendez', black: 'Yuki Tanaka', result: '1-0' },
  { board: 5, white: 'David Okonkwo', black: 'Sergei Volkov', result: '1/2' },
];

const STANDINGS = [
  { rank: 1, name: 'Magnus Eriksson', points: '2.5/3', buchholz: '7.5' },
  { rank: 2, name: 'Elena Kozlov', points: '2.5/3', buchholz: '7.0' },
  { rank: 3, name: 'Carlos Mendez', points: '2.0/3', buchholz: '6.5' },
  { rank: 4, name: 'Giorgi Tabidze', points: '2.0/3', buchholz: '6.0' },
  { rank: 5, name: 'Anna Petrov', points: '1.5/3', buchholz: '6.5' },
  { rank: 6, name: 'Ibrahim Hassan', points: '1.5/3', buchholz: '5.5' },
  { rank: 7, name: 'Piotr Nowak', points: '1.0/3', buchholz: '5.0' },
  { rank: 8, name: 'Yuki Tanaka', points: '1.0/3', buchholz: '4.5' },
];

// ─── Round Tabs ──────────────────────────────────────────────────────────────

function RoundTabs({ active }: { active: number }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.roundTabs}>
      {[1, 2, 3, 4, 5, 6, 7].map((r) => (
        <TouchableOpacity key={r} style={[s.roundTab, active === r && s.roundTabActive]} activeOpacity={0.7}>
          <Text style={[s.roundTabText, active === r && s.roundTabTextActive]}>{r}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ─── Result Row ──────────────────────────────────────────────────────────────

function ResultRow({ board, white, black, result, editable }: {
  board: number; white: string; black: string; result: string; editable?: boolean;
}) {
  const resultDisplay = result === '1/2' ? '\u00BD-\u00BD' : result;
  const resultBg = result === '1-0' ? Colors.statusSuccessBg : result === '0-1' ? Colors.statusErrorBg : Colors.statusWarningBg;
  const resultColor = result === '1-0' ? '#1A6B3A' : result === '0-1' ? Colors.error : '#7A5C1E';

  return (
    <View style={s.resultRow}>
      <Text style={s.boardNum}>{board}</Text>
      <Text style={[s.playerName, { flex: 1, textAlign: 'right' }]} numberOfLines={1}>{white}</Text>
      <TouchableOpacity
        style={[s.resultBadge, { backgroundColor: resultBg }]}
        activeOpacity={editable ? 0.7 : 1}
        disabled={!editable}
      >
        <Text style={[s.resultText, { color: resultColor }]}>{resultDisplay}</Text>
      </TouchableOpacity>
      <Text style={[s.playerName, { flex: 1 }]} numberOfLines={1}>{black}</Text>
    </View>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function Skeleton({ h = 20, w = '100%', mb = 0 }: { h?: number; w?: string | number; mb?: number }) {
  return <View style={{ height: h, width: w as any, backgroundColor: '#E8ECF0', borderRadius: 6, marginBottom: mb }} />;
}

// ─── Default View ────────────────────────────────────────────────────────────

function DefaultView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <Text style={s.heading}>Round 3 Results</Text>
        <RoundTabs active={3} />

        {/* Table Header */}
        <View style={s.tableHeader}>
          <Text style={[s.thText, { width: 30 }]}>#</Text>
          <Text style={[s.thText, { flex: 1, textAlign: 'right' }]}>White</Text>
          <Text style={[s.thText, { width: 60, textAlign: 'center' }]}>Result</Text>
          <Text style={[s.thText, { flex: 1 }]}>Black</Text>
        </View>

        {ROUND3_RESULTS.map((r) => (
          <ResultRow key={r.board} {...r} editable />
        ))}

        <TouchableOpacity style={s.saveBtn} activeOpacity={0.85}>
          <Text style={s.saveBtnText}>Save Round Results</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Results Saved ───────────────────────────────────────────────────────────

function SavedView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <View style={s.successBanner}>
          <Feather name="check-circle" size={16} color="#1A6B3A" />
          <Text style={s.successText}>Round 3 results saved and locked</Text>
        </View>
        <Text style={s.heading}>Round 3 Results</Text>
        <RoundTabs active={3} />

        <View style={s.tableHeader}>
          <Text style={[s.thText, { width: 30 }]}>#</Text>
          <Text style={[s.thText, { flex: 1, textAlign: 'right' }]}>White</Text>
          <Text style={[s.thText, { width: 60, textAlign: 'center' }]}>Result</Text>
          <Text style={[s.thText, { flex: 1 }]}>Black</Text>
        </View>

        {ROUND3_RESULTS.map((r) => (
          <ResultRow key={r.board} {...r} />
        ))}

        <TouchableOpacity style={s.finalizeBtn} activeOpacity={0.85}>
          <Feather name="check-square" size={16} color={Colors.primary} />
          <Text style={s.finalizeBtnText}>Finalize Tournament Results</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Standings View ──────────────────────────────────────────────────────────

function StandingsView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <Text style={s.heading}>Standings</Text>

        <View style={s.tableHeader}>
          <Text style={[s.thText, { width: 30 }]}>#</Text>
          <Text style={[s.thText, { flex: 1 }]}>Player</Text>
          <Text style={[s.thText, { width: 60, textAlign: 'right' }]}>Points</Text>
          <Text style={[s.thText, { width: 60, textAlign: 'right' }]}>Bchz</Text>
        </View>

        {STANDINGS.map((p, i) => (
          <View key={p.rank} style={[s.standingRow, i % 2 === 0 && s.standingRowAlt]}>
            <Text style={[s.standingRank, { width: 30 }]}>{p.rank}</Text>
            <Text style={[s.standingName, { flex: 1 }]}>{p.name}</Text>
            <Text style={[s.standingPoints, { width: 60 }]}>{p.points}</Text>
            <Text style={[s.standingBuchholz, { width: 60 }]}>{p.buchholz}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Loading View ────────────────────────────────────────────────────────────

function LoadingView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <Skeleton h={28} w={200} mb={Spacing.md} />
        <Skeleton h={36} mb={Spacing.lg} />
        <Skeleton h={32} mb={Spacing.sm} />
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={s.resultRow}>
            <Skeleton h={14} w={20} />
            <Skeleton h={14} w="30%" />
            <Skeleton h={24} w={50} />
            <Skeleton h={14} w="30%" />
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Finalized View ──────────────────────────────────────────────────────────

function FinalizedView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <View style={s.finalizedBanner}>
          <Feather name="award" size={20} color={Colors.gold} />
          <View style={{ flex: 1 }}>
            <Text style={s.finalizedTitle}>Tournament Finalized</Text>
            <Text style={s.finalizedDesc}>All 7 rounds completed. Results are official.</Text>
          </View>
        </View>

        <Text style={s.heading}>Final Standings</Text>

        <View style={s.tableHeader}>
          <Text style={[s.thText, { width: 30 }]}>#</Text>
          <Text style={[s.thText, { flex: 1 }]}>Player</Text>
          <Text style={[s.thText, { width: 60, textAlign: 'right' }]}>Points</Text>
          <Text style={[s.thText, { width: 60, textAlign: 'right' }]}>Bchz</Text>
        </View>

        {STANDINGS.map((p, i) => (
          <View key={p.rank} style={[s.standingRow, i % 2 === 0 && s.standingRowAlt]}>
            <Text style={[s.standingRank, { width: 30 }]}>{p.rank}</Text>
            <Text style={[s.standingName, { flex: 1 }]}>{p.name}</Text>
            <Text style={[s.standingPoints, { width: 60 }]}>{p.points}</Text>
            <Text style={[s.standingBuchholz, { width: 60 }]}>{p.buchholz}</Text>
          </View>
        ))}

        <TouchableOpacity style={s.certBtn} activeOpacity={0.85}>
          <Feather name="award" size={16} color={Colors.primary} />
          <Text style={s.certBtnText}>Issue Certificates</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export default function TournamentResultsStates() {
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Round results entry with editable result badges">
        <DefaultView />
      </StateSection>
      <StateSection title="RESULTS_SAVED" description="Results locked, finalize button visible">
        <SavedView />
      </StateSection>
      <StateSection title="STANDINGS" description="Standings table with points and Buchholz">
        <StandingsView />
      </StateSection>
      <StateSection title="LOADING" description="Skeleton loading state">
        <LoadingView />
      </StateSection>
      <StateSection title="FINALIZED" description="All results submitted, certificates available">
        <FinalizedView />
      </StateSection>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { backgroundColor: Colors.background, maxWidth: 430 },
  container: { padding: Spacing.md },
  heading: { fontFamily: Typography.fontFamilyHeading, fontSize: Typography.sizes['2xl'], color: Colors.text, marginBottom: Spacing.md },
  roundTabs: { marginBottom: Spacing.lg },
  roundTab: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.backgroundAlt,
    alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  roundTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  roundTabText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.sm, color: Colors.textMuted },
  roundTabTextActive: { color: Colors.gold },
  tableHeader: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: 8,
    borderBottomLeftRadius: 0, borderBottomRightRadius: 0, marginBottom: 1,
  },
  thText: { fontFamily: Typography.fontFamilySemiBold, fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.5 },
  resultRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  boardNum: { fontFamily: Typography.fontFamilyBold, fontSize: Typography.sizes.sm, color: Colors.textMuted, width: 24, textAlign: 'center' },
  playerName: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.sm, color: Colors.text },
  resultBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: 8, minWidth: 48, alignItems: 'center' },
  resultText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.sm },
  saveBtn: {
    backgroundColor: Colors.gold, borderRadius: 8, paddingVertical: 14,
    alignItems: 'center', marginTop: Spacing.lg,
  },
  saveBtnText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.primary },
  successBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.statusSuccessBg, padding: Spacing.md, borderRadius: 8, marginBottom: Spacing.md,
  },
  successText: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.sm, color: '#1A6B3A' },
  finalizeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.gold, borderRadius: 8, paddingVertical: 14, marginTop: Spacing.lg,
  },
  finalizeBtnText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.primary },
  standingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: 10 },
  standingRowAlt: { backgroundColor: Colors.backgroundAlt },
  standingRank: { fontFamily: Typography.fontFamilyBold, fontSize: Typography.sizes.sm, color: Colors.textMuted },
  standingName: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.sm, color: Colors.text },
  standingPoints: { fontFamily: Typography.fontFamilyBold, fontSize: Typography.sizes.sm, color: Colors.primary, textAlign: 'right' },
  standingBuchholz: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.textMuted, textAlign: 'right' },
  finalizedBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: 12, marginBottom: Spacing.lg,
  },
  finalizedTitle: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.gold },
  finalizedDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  certBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.gold, borderRadius: 8, paddingVertical: 14, marginTop: Spacing.lg,
  },
  certBtnText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.primary },
});
