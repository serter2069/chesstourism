import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

// ─── Tab Bar ─────────────────────────────────────────────────────────────────

function TabBar({ tabs, active, onPress }: { tabs: { key: string; label: string }[]; active: string; onPress: (key: string) => void }) {
  return (
    <View style={s.tabBar}>
      {tabs.map((t) => (
        <TouchableOpacity
          key={t.key}
          style={[s.tab, active === t.key && s.tabActive]}
          activeOpacity={0.7}
          onPress={() => onPress(t.key)}
        >
          <Text style={[s.tabText, active === t.key && s.tabTextActive]}>{t.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const meta: Record<string, { bg: string; color: string }> = {
    OPEN: { bg: Colors.statusSuccessBg, color: '#1A6B3A' },
    DRAFT: { bg: Colors.statusWarningBg, color: '#7A5C1E' },
    COMPLETED: { bg: Colors.backgroundAlt, color: Colors.textMuted },
  };
  const m = meta[status] || meta.COMPLETED;
  return (
    <View style={[s.statusBadge, { backgroundColor: m.bg }]}>
      <Text style={[s.statusText, { color: m.color }]}>{status}</Text>
    </View>
  );
}

// ─── Tournament Management Card ──────────────────────────────────────────────

function TournamentCard({ name, dates, status, registered, capacity, actions }: {
  name: string; dates: string; status: string; registered: number; capacity: number;
  actions: { label: string; icon: string }[];
}) {
  return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={s.cardName}>{name}</Text>
          <View style={s.cardMeta}>
            <Feather name="calendar" size={12} color={Colors.textMuted} />
            <Text style={s.cardDates}>{dates}</Text>
          </View>
        </View>
        <StatusBadge status={status} />
      </View>
      <View style={s.cardStats}>
        <View style={s.progressBar}>
          <View style={[s.progressFill, { width: `${(registered / capacity) * 100}%` as any }]} />
        </View>
        <Text style={s.cardRegistered}>{registered}/{capacity} registered</Text>
      </View>
      <View style={s.cardActions}>
        {actions.map((a) => (
          <TouchableOpacity key={a.label} style={s.actionBtn} activeOpacity={0.7}>
            <Feather name={a.icon as any} size={14} color={Colors.primary} />
            <Text style={s.actionText}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─── Past Tournament Card ────────────────────────────────────────────────────

function PastCard({ name, dates, participants }: { name: string; dates: string; participants: number }) {
  return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={s.cardName}>{name}</Text>
          <Text style={s.cardDates}>{dates}</Text>
        </View>
        <StatusBadge status="COMPLETED" />
      </View>
      <View style={s.cardFooter}>
        <Text style={s.cardRegistered}>{participants} participants</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={s.linkText}>View Results</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Active Tab ──────────────────────────────────────────────────────────────

function ActiveTab() {
  const actions = [
    { label: 'Hub', icon: 'grid' },
    { label: 'Players', icon: 'users' },
    { label: 'Results', icon: 'bar-chart-2' },
    { label: 'Edit', icon: 'edit' },
  ];
  return (
    <View>
      <TournamentCard name="Tbilisi Open 2025" dates="Jun 14-21, 2025" status="OPEN" registered={87} capacity={120} actions={actions} />
      <View style={{ height: Spacing.md }} />
      <TournamentCard name="Warsaw Classical 2025" dates="Aug 10-17, 2025" status="OPEN" registered={34} capacity={80} actions={actions} />
    </View>
  );
}

// ─── Draft Tab ───────────────────────────────────────────────────────────────

function DraftTab() {
  return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={s.cardName}>Budapest Autumn Open 2025</Text>
          <Text style={s.cardDates}>Oct 5-12, 2025</Text>
        </View>
        <StatusBadge status="DRAFT" />
      </View>
      <View style={s.cardActions}>
        <TouchableOpacity style={[s.actionBtn, s.actionBtnGold]} activeOpacity={0.7}>
          <Feather name="globe" size={14} color={Colors.primary} />
          <Text style={[s.actionText, { color: Colors.primary }]}>Publish</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.actionBtn} activeOpacity={0.7}>
          <Feather name="edit" size={14} color={Colors.primary} />
          <Text style={s.actionText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Past Tab ────────────────────────────────────────────────────────────────

function PastTab() {
  const past = [
    { name: 'Oslo Rapid 2024', dates: 'Nov 8-10, 2024', participants: 64 },
    { name: 'Prague Masters 2024', dates: 'Sep 20-27, 2024', participants: 96 },
    { name: 'Tbilisi Summer Open 2024', dates: 'Jul 1-8, 2024', participants: 110 },
    { name: 'Yerevan Blitz 2024', dates: 'May 15-16, 2024', participants: 48 },
  ];
  return (
    <View style={{ gap: Spacing.md }}>
      {past.map((t) => <PastCard key={t.name} {...t} />)}
    </View>
  );
}

// ─── FAB ─────────────────────────────────────────────────────────────────────

function CreateFAB() {
  return (
    <TouchableOpacity style={s.fab} activeOpacity={0.85}>
      <Feather name="plus" size={20} color={Colors.primary} />
      <Text style={s.fabText}>Create Tournament</Text>
    </TouchableOpacity>
  );
}

// ─── Page Content ────────────────────────────────────────────────────────────

function PageContent({ tab }: { tab: 'active' | 'draft' | 'past' }) {
  const tabs = [
    { key: 'active', label: 'Active (2)' },
    { key: 'draft', label: 'Draft (1)' },
    { key: 'past', label: 'Past (9)' },
  ];
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <Text style={s.heading}>My Tournaments</Text>
        <TabBar tabs={tabs} active={tab} onPress={() => {}} />
        {tab === 'active' && <ActiveTab />}
        {tab === 'draft' && <DraftTab />}
        {tab === 'past' && <PastTab />}
        <CreateFAB />
      </View>
    </View>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyContent() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <Text style={s.heading}>My Tournaments</Text>
        <View style={s.emptyWrap}>
          <Feather name="plus-circle" size={56} color={Colors.border} />
          <Text style={s.emptyTitle}>No Tournaments Yet</Text>
          <Text style={s.emptyDesc}>Create your first tournament and start managing registrations, results, and more.</Text>
          <TouchableOpacity style={s.emptyCta} activeOpacity={0.85}>
            <Text style={s.emptyCtaText}>Create Your First Tournament</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export default function MyTournamentsStates() {
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Active tab with tournament management cards">
        <PageContent tab="active" />
      </StateSection>
      <StateSection title="DRAFT_TAB" description="Draft tournaments with Publish and Edit buttons">
        <PageContent tab="draft" />
      </StateSection>
      <StateSection title="PAST_TAB" description="Past tournaments with final participant counts">
        <PageContent tab="past" />
      </StateSection>
      <StateSection title="EMPTY" description="No tournaments created yet">
        <EmptyContent />
      </StateSection>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { backgroundColor: Colors.background, maxWidth: 430 },
  container: { padding: Spacing.md },
  heading: { fontFamily: Typography.fontFamilyHeading, fontSize: Typography.sizes['2xl'], color: Colors.text, marginBottom: Spacing.md },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.border, marginBottom: Spacing.lg },
  tab: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, marginRight: Spacing.xs },
  tabActive: { borderBottomWidth: 2, borderBottomColor: Colors.gold },
  tabText: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.sm, color: Colors.textMuted },
  tabTextActive: { color: Colors.gold, fontFamily: Typography.fontFamilySemiBold },
  card: {
    backgroundColor: Colors.background, borderRadius: 12, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: Spacing.sm },
  cardName: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.text },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: 4 },
  cardDates: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted },
  cardStats: { marginBottom: Spacing.md },
  progressBar: { height: 4, backgroundColor: Colors.border, borderRadius: 2, marginBottom: Spacing.xs },
  progressFill: { height: 4, backgroundColor: Colors.gold, borderRadius: 2 },
  cardRegistered: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted },
  cardActions: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2, borderRadius: 6,
    borderWidth: 1, borderColor: Colors.border,
  },
  actionBtnGold: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  actionText: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.xs, color: Colors.primary },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.sm },
  linkText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.sm, color: Colors.gold },
  statusBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: 12 },
  statusText: { fontFamily: Typography.fontFamilySemiBold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  fab: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.gold, borderRadius: 28, paddingVertical: 14, marginTop: Spacing.xl,
  },
  fabText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.primary },
  emptyWrap: { alignItems: 'center', paddingVertical: Spacing['3xl'] },
  emptyTitle: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.lg, color: Colors.text, marginTop: Spacing.md },
  emptyDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm, maxWidth: 280 },
  emptyCta: { backgroundColor: Colors.gold, borderRadius: 8, paddingVertical: 14, paddingHorizontal: Spacing.xl, marginTop: Spacing.lg },
  emptyCtaText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.primary },
});
