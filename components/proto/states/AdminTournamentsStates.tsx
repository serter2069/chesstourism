import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

const BG = Colors.adminBg;
const CARD = Colors.adminCard;
const TEXT = Colors.adminText;
const MUTED = Colors.adminMuted;
const ACCENT = Colors.adminAccent;
const BORDER = Colors.adminBorder;
const GREEN = Colors.adminGreen;
const YELLOW = Colors.adminYellow;
const BLUE = Colors.adminBlue;
const RED = Colors.adminRed;

const TOURNAMENTS = [
  { name: 'Tbilisi Open 2025', commissar: 'Giorgi Beridze', country: 'Georgia', dates: 'Jun 15-22, 2025', participants: '24/32', status: 'Open' },
  { name: 'Oslo Rapid Cup', commissar: 'Erik Halvorsen', country: 'Norway', dates: 'Jul 5-8, 2025', participants: '16/16', status: 'In Progress' },
  { name: 'Reykjavik Open', commissar: 'Bjorn Sigurdsson', country: 'Iceland', dates: 'May 1-7, 2025', participants: '48/48', status: 'Completed' },
  { name: 'Warsaw Classical', commissar: 'Marek Kowalski', country: 'Poland', dates: 'Aug 10-20, 2025', participants: '12/64', status: 'Open' },
  { name: 'Yerevan Masters', commissar: 'Armen Darbinyan', country: 'Armenia', dates: 'Apr 1-5, 2025', participants: '32/32', status: 'Completed' },
  { name: 'Barcelona Blitz', commissar: 'Carlos Ruiz', country: 'Spain', dates: 'Sep 2-4, 2025', participants: '0/24', status: 'Open' },
  { name: 'Stockholm GM Norm', commissar: 'Lars Nilsson', country: 'Sweden', dates: 'Mar 15-20, 2025', participants: '10/10', status: 'Cancelled' },
];

const FILTER_TABS = ['All', 'Open', 'In Progress', 'Completed', 'Cancelled'];

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    'Open': BLUE,
    'In Progress': YELLOW,
    'Completed': GREEN,
    'Cancelled': MUTED,
  };
  const color = colorMap[status] || MUTED;
  return (
    <View style={[s.badge, { backgroundColor: color + '22', borderColor: color + '44' }]}>
      <Text style={[s.badgeText, { color }]}>{status}</Text>
    </View>
  );
}

function FilterTabs({ active, onSelect }: { active: string; onSelect?: (tab: string) => void }) {
  return (
    <View style={s.filterTabs}>
      {FILTER_TABS.map(t => (
        <TouchableOpacity key={t} style={[s.filterTab, active === t && s.filterTabActive]} onPress={() => onSelect?.(t)}>
          <Text style={[s.filterTabText, active === t && s.filterTabTextActive]}>{t}</Text>
        </TouchableOpacity>
      ))}
      <View style={{ flex: 1 }} />
      <TouchableOpacity style={s.exportBtn}>
        <Feather name="download" size={14} color={TEXT} />
        <Text style={s.exportBtnText}>Export</Text>
      </TouchableOpacity>
    </View>
  );
}

function TournamentsTable({ tournaments }: { tournaments: typeof TOURNAMENTS }) {
  return (
    <View style={s.table}>
      <View style={s.tableHeader}>
        <Text style={[s.th, { flex: 2.5 }]}>Tournament</Text>
        <Text style={[s.th, { flex: 1.5 }]}>Commissar</Text>
        <Text style={[s.th, { flex: 1 }]}>Country</Text>
        <Text style={[s.th, { flex: 1.5 }]}>Dates</Text>
        <Text style={[s.th, { flex: 1 }]}>Participants</Text>
        <Text style={[s.th, { flex: 1 }]}>Status</Text>
        <Text style={[s.th, { flex: 1.5 }]}>Actions</Text>
      </View>
      {tournaments.map((t, i) => (
        <View key={i} style={s.tableRow}>
          <Text style={[s.td, { flex: 2.5 }]}>{t.name}</Text>
          <Text style={[s.tdMuted, { flex: 1.5 }]}>{t.commissar}</Text>
          <Text style={[s.tdMuted, { flex: 1 }]}>{t.country}</Text>
          <Text style={[s.tdMuted, { flex: 1.5 }]}>{t.dates}</Text>
          <Text style={[s.td, { flex: 1 }]}>{t.participants}</Text>
          <View style={{ flex: 1 }}><StatusBadge status={t.status} /></View>
          <View style={[s.actions, { flex: 1.5 }]}>
            <TouchableOpacity><Text style={s.actionLink}>View</Text></TouchableOpacity>
            <TouchableOpacity><Text style={s.actionLink}>Edit</Text></TouchableOpacity>
            {t.status !== 'Completed' && t.status !== 'Cancelled' && (
              <TouchableOpacity><Text style={[s.actionLink, { color: RED }]}>Cancel</Text></TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

function SkeletonRow() {
  return (
    <View style={s.tableRow}>
      {[2.5, 1.5, 1, 1.5, 1, 1, 1.5].map((f, i) => (
        <View key={i} style={{ flex: f, paddingHorizontal: 4 }}>
          <View style={[s.skeleton, { height: 14, width: '80%' }]} />
        </View>
      ))}
    </View>
  );
}

export default function AdminTournamentsStates() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filteredTournaments = activeFilter === 'All' ? TOURNAMENTS : TOURNAMENTS.filter(t => t.status === activeFilter);

  return (
    <ScrollView style={{ backgroundColor: BG }}>
      {/* STATE: DEFAULT */}
      <StateSection title="DEFAULT" description="All tournaments with filter tabs">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="admin" activeTab="tournaments" />
          <View style={s.content}>
            <Text style={s.heading}>Tournaments Management</Text>
            <FilterTabs active={activeFilter} onSelect={setActiveFilter} />
            <TournamentsTable tournaments={filteredTournaments} />
          </View>
        </View>
      </StateSection>

      {/* STATE: TOURNAMENT_DETAIL */}
      <StateSection title="TOURNAMENT_DETAIL" description="Expanded tournament info panel">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="admin" activeTab="tournaments" />
          <View style={s.content}>
            <Text style={s.heading}>Tournaments Management</Text>
            <FilterTabs active="All" />
            <TournamentsTable tournaments={TOURNAMENTS.slice(0, 3)} />

            <View style={s.detailPanel}>
              <View style={s.detailHeader}>
                <Text style={s.detailTitle}>Tbilisi Open 2025</Text>
                <StatusBadge status="Open" />
              </View>
              <View style={s.detailGrid}>
                <View style={s.detailItem}><Text style={s.detailLabel}>Commissar</Text><Text style={s.detailValue}>Giorgi Beridze</Text></View>
                <View style={s.detailItem}><Text style={s.detailLabel}>Country</Text><Text style={s.detailValue}>Georgia</Text></View>
                <View style={s.detailItem}><Text style={s.detailLabel}>Format</Text><Text style={s.detailValue}>Classical, 9 rounds</Text></View>
                <View style={s.detailItem}><Text style={s.detailLabel}>Dates</Text><Text style={s.detailValue}>Jun 15-22, 2025</Text></View>
                <View style={s.detailItem}><Text style={s.detailLabel}>Participants</Text><Text style={s.detailValue}>24 / 32</Text></View>
                <View style={s.detailItem}><Text style={s.detailLabel}>Entry Fee</Text><Text style={s.detailValue}>EUR 50</Text></View>
                <View style={s.detailItem}><Text style={s.detailLabel}>Prize Fund</Text><Text style={s.detailValue}>EUR 5,000</Text></View>
                <View style={s.detailItem}><Text style={s.detailLabel}>Venue</Text><Text style={s.detailValue}>Tbilisi Chess Palace</Text></View>
              </View>
            </View>
          </View>
        </View>
      </StateSection>

      {/* STATE: CANCEL_CONFIRM */}
      <StateSection title="CANCEL_CONFIRM" description="Tournament cancellation confirmation modal">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="admin" activeTab="tournaments" />
          <View style={s.content}>
            <View style={s.modalOverlay}>
              <View style={s.modal}>
                <Feather name="alert-triangle" size={24} color={RED} style={{ alignSelf: 'center' }} />
                <Text style={s.modalTitle}>Cancel Tournament</Text>
                <Text style={s.modalText}>Cancel tournament Tbilisi Open 2025? All registrations will be refunded.</Text>
                <Text style={s.modalSubhead}>Consequences:</Text>
                <Text style={s.modalListItem}>- 24 registered players will be notified</Text>
                <Text style={s.modalListItem}>- EUR 1,200 in registration fees will be refunded</Text>
                <Text style={s.modalListItem}>- Commissar Giorgi Beridze will be notified</Text>
                <Text style={s.modalListItem}>- Tournament cannot be reopened</Text>
                <View style={s.modalActions}>
                  <TouchableOpacity style={s.btnOutline}><Text style={s.btnOutlineText}>Keep Open</Text></TouchableOpacity>
                  <TouchableOpacity style={s.btnDanger}><Text style={s.btnDangerText}>Confirm Cancel</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </StateSection>

      {/* STATE: LOADING */}
      <StateSection title="LOADING" description="Skeleton loading for tournaments table">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="admin" activeTab="tournaments" />
          <View style={s.content}>
            <Text style={s.heading}>Tournaments Management</Text>
            <FilterTabs active="All" />
            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text style={[s.th, { flex: 2.5 }]}>Tournament</Text>
                <Text style={[s.th, { flex: 1.5 }]}>Commissar</Text>
                <Text style={[s.th, { flex: 1 }]}>Country</Text>
                <Text style={[s.th, { flex: 1.5 }]}>Dates</Text>
                <Text style={[s.th, { flex: 1 }]}>Participants</Text>
                <Text style={[s.th, { flex: 1 }]}>Status</Text>
                <Text style={[s.th, { flex: 1.5 }]}>Actions</Text>
              </View>
              {[1, 2, 3, 4, 5].map(i => <SkeletonRow key={i} />)}
            </View>
          </View>
        </View>
      </StateSection>

      {/* STATE: FILTERS_ACTIVE */}
      <StateSection title="FILTERS_ACTIVE" description="Filtered to show only In Progress tournaments">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="admin" activeTab="tournaments" />
          <View style={s.content}>
            <Text style={s.heading}>Tournaments Management</Text>
            <FilterTabs active="In Progress" />
            <TournamentsTable tournaments={TOURNAMENTS.filter(t => t.status === 'In Progress')} />
          </View>
        </View>
      </StateSection>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { backgroundColor: BG },
  content: { padding: Spacing.lg },
  heading: {
    fontSize: Typography.sizes['2xl'],
    fontFamily: Typography.fontFamilyHeading,
    color: TEXT,
    marginBottom: Spacing.lg,
  },
  filterTabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  filterTab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 6,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
  },
  filterTabActive: {
    backgroundColor: ACCENT + '22',
    borderColor: ACCENT + '44',
  },
  filterTabText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: MUTED,
  },
  filterTabTextActive: {
    color: ACCENT,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 6,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
  },
  exportBtnText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: TEXT,
  },
  table: {
    backgroundColor: CARD,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.adminInputBg,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  th: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilySemiBold,
    color: MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  td: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: TEXT,
  },
  tdMuted: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: MUTED,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilyMedium,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionLink: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilyMedium,
    color: Colors.adminBlue,
  },
  skeleton: {
    backgroundColor: Colors.adminBorder,
    borderRadius: 4,
  },
  detailPanel: {
    backgroundColor: CARD,
    borderRadius: 8,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: BORDER,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  detailTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fontFamilyBold,
    color: TEXT,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  detailItem: {
    minWidth: 140,
    marginBottom: Spacing.sm,
  },
  detailLabel: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamily,
    color: MUTED,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilySemiBold,
    color: TEXT,
  },
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    padding: Spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: CARD,
    borderRadius: 12,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 440,
    borderWidth: 1,
    borderColor: BORDER,
    gap: Spacing.sm,
  },
  modalTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fontFamilySemiBold,
    color: TEXT,
    textAlign: 'center',
  },
  modalText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: MUTED,
    textAlign: 'center',
  },
  modalSubhead: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilySemiBold,
    color: TEXT,
    marginTop: Spacing.sm,
  },
  modalListItem: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: MUTED,
    marginLeft: Spacing.sm,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 6,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  btnOutlineText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: TEXT,
  },
  btnDanger: {
    backgroundColor: Colors.adminDangerBg,
    borderRadius: 6,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: RED + '44',
  },
  btnDangerText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: RED,
  },
});
