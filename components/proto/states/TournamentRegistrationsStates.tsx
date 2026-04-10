import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const REGISTRATIONS = [
  { name: 'Magnus Eriksson', country: 'Sweden', fide: '1000017', date: 'Jun 2, 2025', status: 'Confirmed' },
  { name: 'Anna Petrov', country: 'Russia', fide: '4153234', date: 'Jun 3, 2025', status: 'Confirmed' },
  { name: 'Giorgi Tabidze', country: 'Georgia', fide: '13601234', date: 'Jun 5, 2025', status: 'Pending' },
  { name: 'Ibrahim Hassan', country: 'Egypt', fide: '10456789', date: 'Jun 5, 2025', status: 'Confirmed' },
  { name: 'Piotr Nowak', country: 'Poland', fide: '11234567', date: 'Jun 6, 2025', status: 'Confirmed' },
  { name: 'Elena Kozlov', country: 'Ukraine', fide: '14567890', date: 'Jun 7, 2025', status: 'Pending' },
];

// ─── Status Badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const isConfirmed = status === 'Confirmed';
  return (
    <View style={[s.statusBadge, { backgroundColor: isConfirmed ? Colors.statusSuccessBg : Colors.statusWarningBg }]}>
      <Text style={[s.statusText, { color: isConfirmed ? Colors.successGreen : Colors.statusWarningText }]}>{status}</Text>
    </View>
  );
}

// ─── Filter Tabs ─────────────────────────────────────────────────────────────

function FilterTabs({ active }: { active: string }) {
  const tabs = ['All', 'Pending', 'Confirmed', 'Cancelled'];
  return (
    <View style={s.filterRow}>
      {tabs.map((t) => (
        <TouchableOpacity key={t} style={[s.filterTab, active === t && s.filterTabActive]} activeOpacity={0.7}>
          <Text style={[s.filterText, active === t && s.filterTextActive]}>{t}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Registration Row ────────────────────────────────────────────────────────

function RegistrationRow({ reg, showActions, expanded }: {
  reg: typeof REGISTRATIONS[0]; showActions?: boolean; expanded?: boolean;
}) {
  return (
    <View style={[s.regRow, expanded && s.regRowExpanded]}>
      <View style={s.regMain}>
        <Image
          source={{ uri: 'https://picsum.photos/seed/player-avatar/200/200' }}
          style={{ width: 32, height: 32, borderRadius: 16 }}
          resizeMode="cover"
        />
        <View style={s.regInfo}>
          <Text style={s.regName}>{reg.name}</Text>
          <View style={s.regMeta}>
            <Text style={s.regCountry}>{reg.country}</Text>
            <Text style={s.regDivider}>|</Text>
            <Text style={s.regFide}>FIDE {reg.fide}</Text>
          </View>
        </View>
        <StatusBadge status={reg.status} />
        {!showActions && (
          <TouchableOpacity style={s.moreBtn} activeOpacity={0.7}>
            <Feather name="more-horizontal" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={s.regDate}>Registered: {reg.date}</Text>
      {showActions && reg.status === 'Pending' && (
        <View style={s.regActions}>
          <TouchableOpacity style={s.confirmBtn} activeOpacity={0.8}>
            <Feather name="check" size={14} color={Colors.successGreen} />
            <Text style={s.confirmText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.rejectBtn} activeOpacity={0.8}>
            <Feather name="x" size={14} color={Colors.error} />
            <Text style={s.rejectText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
      {expanded && (
        <View style={s.expandedCard}>
          <View style={s.expandedRow}>
            <Text style={s.expandedLabel}>Country</Text>
            <Text style={s.expandedValue}>{reg.country}</Text>
          </View>
          <View style={s.expandedRow}>
            <Text style={s.expandedLabel}>FIDE ID</Text>
            <Text style={s.expandedValue}>{reg.fide}</Text>
          </View>
          <View style={s.expandedRow}>
            <Text style={s.expandedLabel}>Registration Date</Text>
            <Text style={s.expandedValue}>{reg.date}</Text>
          </View>
          <View style={s.expandedRow}>
            <Text style={s.expandedLabel}>Status</Text>
            <Text style={s.expandedValue}>{reg.status}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function Skeleton({ h = 20, w = '100%', mb = 0 }: { h?: number; w?: string | number; mb?: number }) {
  return <View style={{ height: h, width: w as any, backgroundColor: Colors.skeleton, borderRadius: 6, marginBottom: mb }} />;
}

// ─── Page Variants ───────────────────────────────────────────────────────────

function DefaultView() {
  const [search, setSearch] = useState('');
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <View style={s.headerRow}>
          <Text style={s.heading}>Registrations</Text>
          <TouchableOpacity style={s.exportBtn} activeOpacity={0.7}>
            <Feather name="download" size={14} color={Colors.primary} />
            <Text style={s.exportText}>Export CSV</Text>
          </TouchableOpacity>
        </View>
        <View style={s.searchRow}>
          <Feather name="search" size={16} color={Colors.textMuted} />
          <TextInput
            style={s.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search players..."
            placeholderTextColor={Colors.textMuted}
          />
        </View>
        <FilterTabs active="All" />
        {REGISTRATIONS.map((r) => <RegistrationRow key={r.fide} reg={r} />)}
      </View>
    </View>
  );
}

function PendingView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <Text style={s.heading}>Registrations</Text>
        <FilterTabs active="Pending" />
        {REGISTRATIONS.filter((r) => r.status === 'Pending').map((r) => (
          <RegistrationRow key={r.fide} reg={r} showActions />
        ))}
      </View>
    </View>
  );
}

function PlayerDetailView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <Text style={s.heading}>Registrations</Text>
        <FilterTabs active="All" />
        <RegistrationRow reg={REGISTRATIONS[0]} expanded />
        {REGISTRATIONS.slice(1).map((r) => <RegistrationRow key={r.fide} reg={r} />)}
      </View>
    </View>
  );
}

function LoadingView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <Skeleton h={28} w={180} mb={Spacing.md} />
        <Skeleton h={40} mb={Spacing.md} />
        <Skeleton h={32} mb={Spacing.lg} />
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={s.regRow}>
            <View style={s.regMain}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.skeleton }} />
              <View style={{ flex: 1, gap: Spacing.xs }}>
                <Skeleton h={14} w="60%" />
                <Skeleton h={10} w="40%" />
              </View>
              <Skeleton h={20} w={70} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function EmptyView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <Text style={s.heading}>Registrations</Text>
        <View style={s.emptyWrap}>
          <Feather name="users" size={48} color={Colors.border} />
          <Text style={s.emptyTitle}>No Registrations Yet</Text>
          <Text style={s.emptyDesc}>Once players register for your tournament, they will appear here.</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export default function TournamentRegistrationsStates() {
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="All registrations with search and filter">
        <DefaultView />
      </StateSection>
      <StateSection title="PENDING_FILTER" description="Pending registrations with Confirm/Reject actions">
        <PendingView />
      </StateSection>
      <StateSection title="PLAYER_DETAIL" description="Expanded player detail card">
        <PlayerDetailView />
      </StateSection>
      <StateSection title="LOADING" description="Skeleton loading state">
        <LoadingView />
      </StateSection>
      <StateSection title="EMPTY" description="No registrations yet">
        <EmptyView />
      </StateSection>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { backgroundColor: Colors.background },
  container: { padding: Spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  heading: { fontFamily: Typography.fontFamilyHeading, fontSize: Typography.sizes['2xl'], color: Colors.text },
  exportBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm, borderWidth: 1, borderColor: Colors.border, borderRadius: 6 },
  exportText: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.xs, color: Colors.primary },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: Spacing.md,
    paddingVertical: 8, marginBottom: Spacing.md,
  },
  searchInput: { flex: 1, fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.text },
  filterRow: { flexDirection: 'row', gap: Spacing.xs, marginBottom: Spacing.md },
  filterTab: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md, borderRadius: 16, backgroundColor: Colors.backgroundAlt },
  filterTabActive: { backgroundColor: Colors.primary },
  filterText: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.xs, color: Colors.textMuted },
  filterTextActive: { color: Colors.background },
  regRow: { paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  regRowExpanded: { backgroundColor: Colors.backgroundAlt, marginHorizontal: -Spacing.md, paddingHorizontal: Spacing.md, borderRadius: 8 },
  regMain: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  regInfo: { flex: 1 },
  regName: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.sm, color: Colors.text },
  regMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  regCountry: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted },
  regDivider: { color: Colors.border, fontSize: 10 },
  regFide: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted },
  regDate: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted, marginTop: 4, marginLeft: 44 },
  statusBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: 12 },
  statusText: { fontFamily: Typography.fontFamilySemiBold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  moreBtn: { padding: 4 },
  regActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm, marginLeft: 44 },
  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: 6,
    backgroundColor: Colors.statusSuccessBg,
  },
  confirmText: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.xs, color: Colors.successGreen },
  rejectBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: 6,
    backgroundColor: Colors.statusErrorBg,
  },
  rejectText: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.xs, color: Colors.error },
  expandedCard: {
    marginTop: Spacing.md, marginLeft: 44, backgroundColor: Colors.background,
    borderRadius: 8, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  expandedRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.xs },
  expandedLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted },
  expandedValue: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.xs, color: Colors.text },
  emptyWrap: { alignItems: 'center', paddingVertical: Spacing['3xl'] },
  emptyTitle: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.lg, color: Colors.text, marginTop: Spacing.md },
  emptyDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm, maxWidth: 280 },
});
