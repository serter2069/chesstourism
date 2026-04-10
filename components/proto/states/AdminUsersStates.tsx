import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

const BG = '#0f1318';
const CARD = '#1a2030';
const TEXT = '#e0e4ef';
const MUTED = '#8090a8';
const ACCENT = '#e07070';
const BORDER = '#2a3040';
const GREEN = '#4caf50';
const RED = '#e07070';

const USERS = [
  { name: 'Magnus Eriksson', email: 'magnus@chess.no', role: 'Player', elo: 2156, date: '2025-11-12', status: 'Active' },
  { name: 'Anna Petrov', email: 'anna@chess.ru', role: 'Player', elo: 1987, date: '2025-10-05', status: 'Active' },
  { name: 'Giorgi Beridze', email: 'giorgi@chess.ge', role: 'Commissar', elo: null, date: '2025-09-20', status: 'Active' },
  { name: 'Erik Halvorsen', email: 'erik@chess.no', role: 'Commissar', elo: null, date: '2025-08-15', status: 'Active' },
  { name: 'System Admin', email: 'admin@chesstourism.com', role: 'Admin', elo: null, date: '2025-01-01', status: 'Active' },
  { name: 'Rustam Nazarov', email: 'rustam@chess.uz', role: 'Commissar', elo: null, date: '2025-07-10', status: 'Suspended' },
  { name: 'Lena Johansson', email: 'lena@chess.se', role: 'Player', elo: 1843, date: '2026-01-18', status: 'Active' },
  { name: 'David Kipiani', email: 'david@chess.ge', role: 'Player', elo: 2034, date: '2026-02-22', status: 'Active' },
];

function RoleBadge({ role }: { role: string }) {
  const color = role === 'Admin' ? ACCENT : role === 'Commissar' ? '#c8a96e' : '#6b9fd4';
  return (
    <View style={[s.badge, { backgroundColor: color + '22', borderColor: color + '44' }]}>
      <Text style={[s.badgeText, { color }]}>{role}</Text>
    </View>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'Active';
  const color = isActive ? GREEN : RED;
  return (
    <View style={[s.badge, { backgroundColor: color + '22', borderColor: color + '44' }]}>
      <Text style={[s.badgeText, { color }]}>{status}</Text>
    </View>
  );
}

function FilterBar({ searchValue, onSearchChange }: { searchValue?: string; onSearchChange?: (v: string) => void }) {
  return (
    <View style={s.filterBar}>
      <View style={s.searchWrap}>
        <Feather name="search" size={14} color={MUTED} />
        <TextInput style={s.searchInput} placeholder="Search users..." placeholderTextColor={MUTED} value={searchValue} onChangeText={onSearchChange} />
      </View>
      <View style={s.filterGroup}>
        <View style={s.selectWrap}>
          <Text style={s.selectText}>Role: All</Text>
          <Feather name="chevron-down" size={14} color={MUTED} />
        </View>
        <View style={s.selectWrap}>
          <Text style={s.selectText}>Status: All</Text>
          <Feather name="chevron-down" size={14} color={MUTED} />
        </View>
      </View>
    </View>
  );
}

function UsersTable({ users, highlight }: { users: typeof USERS; highlight?: number }) {
  return (
    <View style={s.table}>
      <View style={s.tableHeader}>
        <Text style={[s.th, { flex: 0.5 }]}></Text>
        <Text style={[s.th, { flex: 2 }]}>Name</Text>
        <Text style={[s.th, { flex: 2.5 }]}>Email</Text>
        <Text style={[s.th, { flex: 1 }]}>Role</Text>
        <Text style={[s.th, { flex: 0.8 }]}>ELO</Text>
        <Text style={[s.th, { flex: 1.2 }]}>Registered</Text>
        <Text style={[s.th, { flex: 1 }]}>Status</Text>
        <Text style={[s.th, { flex: 1.5 }]}>Actions</Text>
      </View>
      {users.map((u, i) => (
        <View key={i} style={[s.tableRow, highlight === i && s.highlightRow]}>
          <View style={{ flex: 0.5, alignItems: 'center' }}>
            <Image
              source={{ uri: `https://picsum.photos/seed/admin-user-${i + 1}/200/200` }}
              style={{ width: 28, height: 28, borderRadius: 14 }}
              resizeMode="cover"
            />
          </View>
          <Text style={[s.td, { flex: 2 }]}>{u.name}</Text>
          <Text style={[s.tdMuted, { flex: 2.5 }]}>{u.email}</Text>
          <View style={{ flex: 1 }}><RoleBadge role={u.role} /></View>
          <Text style={[s.td, { flex: 0.8 }]}>{u.elo ?? '-'}</Text>
          <Text style={[s.tdMuted, { flex: 1.2 }]}>{u.date}</Text>
          <View style={{ flex: 1 }}><StatusBadge status={u.status} /></View>
          <View style={[s.actions, { flex: 1.5 }]}>
            <TouchableOpacity><Text style={s.actionLink}>View</Text></TouchableOpacity>
            <TouchableOpacity><Text style={s.actionLink}>Suspend</Text></TouchableOpacity>
            <TouchableOpacity><Text style={[s.actionLink, { color: RED }]}>Delete</Text></TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

function SkeletonRow() {
  return (
    <View style={s.tableRow}>
      {[0.5, 2, 2.5, 1, 0.8, 1.2, 1, 1.5].map((f, i) => (
        <View key={i} style={{ flex: f, paddingHorizontal: 4 }}>
          <View style={[s.skeleton, { height: 14, width: '80%' }]} />
        </View>
      ))}
    </View>
  );
}

export default function AdminUsersStates() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ScrollView style={{ backgroundColor: BG }}>
      {/* STATE: DEFAULT */}
      <StateSection title="DEFAULT" description="Users list with search, filters, and data table">
        <View style={s.page}>
          <ProtoNav variant="admin" activeTab="users" />
          <View style={s.content}>
            <Text style={s.heading}>Users Management</Text>
            <FilterBar searchValue={searchQuery} onSearchChange={setSearchQuery} />
            <UsersTable users={USERS} />
          </View>
        </View>
      </StateSection>

      {/* STATE: USER_DETAIL */}
      <StateSection title="USER_DETAIL" description="Expanded user detail view">
        <View style={s.page}>
          <ProtoNav variant="admin" activeTab="users" />
          <View style={s.content}>
            <Text style={s.heading}>Users Management</Text>
            <FilterBar />
            <UsersTable users={USERS} highlight={0} />

            <View style={s.detailPanel}>
              <View style={s.detailHeader}>
                <Image
                  source={{ uri: 'https://picsum.photos/seed/admin-user-1/200/200' }}
                  style={{ width: 48, height: 48, borderRadius: 24 }}
                  resizeMode="cover"
                />
                <View style={{ marginLeft: Spacing.md, flex: 1 }}>
                  <Text style={s.detailName}>Magnus Eriksson</Text>
                  <Text style={s.detailEmail}>magnus@chess.no</Text>
                </View>
                <RoleBadge role="Player" />
              </View>

              <View style={s.detailGrid}>
                <View style={s.detailItem}>
                  <Text style={s.detailLabel}>Registered</Text>
                  <Text style={s.detailValue}>2025-11-12</Text>
                </View>
                <View style={s.detailItem}>
                  <Text style={s.detailLabel}>ELO Rating</Text>
                  <Text style={s.detailValue}>2156</Text>
                </View>
                <View style={s.detailItem}>
                  <Text style={s.detailLabel}>Tournaments Played</Text>
                  <Text style={s.detailValue}>14</Text>
                </View>
                <View style={s.detailItem}>
                  <Text style={s.detailLabel}>Total Payments</Text>
                  <Text style={s.detailValue}>EUR 680</Text>
                </View>
              </View>

              <Text style={s.detailSectionTitle}>Recent Tournaments</Text>
              {['Tbilisi Open 2025', 'Oslo Rapid Cup', 'Reykjavik Open'].map((t, i) => (
                <Text key={i} style={s.detailListItem}>- {t}</Text>
              ))}

              <View style={s.detailActions}>
                <TouchableOpacity style={s.btnOutline}><Text style={s.btnOutlineText}>Change Role</Text></TouchableOpacity>
                <TouchableOpacity style={s.btnDanger}><Text style={s.btnDangerText}>Suspend User</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </StateSection>

      {/* STATE: SUSPEND_CONFIRM */}
      <StateSection title="SUSPEND_CONFIRM" description="Confirmation modal for suspending a user">
        <View style={s.page}>
          <ProtoNav variant="admin" activeTab="users" />
          <View style={s.content}>
            <Text style={s.heading}>Users Management</Text>

            <View style={s.modalOverlay}>
              <View style={s.modal}>
                <Feather name="alert-triangle" size={24} color={RED} style={{ alignSelf: 'center' }} />
                <Text style={s.modalTitle}>Suspend User</Text>
                <Text style={s.modalText}>Suspend user Magnus Eriksson? This will block their access to the platform.</Text>
                <View style={s.modalActions}>
                  <TouchableOpacity style={s.btnOutline}><Text style={s.btnOutlineText}>Cancel</Text></TouchableOpacity>
                  <TouchableOpacity style={s.btnDanger}><Text style={s.btnDangerText}>Suspend</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </StateSection>

      {/* STATE: LOADING */}
      <StateSection title="LOADING" description="Skeleton loading state for users table">
        <View style={s.page}>
          <ProtoNav variant="admin" activeTab="users" />
          <View style={s.content}>
            <Text style={s.heading}>Users Management</Text>
            <FilterBar />
            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text style={[s.th, { flex: 0.5 }]}></Text>
                <Text style={[s.th, { flex: 2 }]}>Name</Text>
                <Text style={[s.th, { flex: 2.5 }]}>Email</Text>
                <Text style={[s.th, { flex: 1 }]}>Role</Text>
                <Text style={[s.th, { flex: 0.8 }]}>ELO</Text>
                <Text style={[s.th, { flex: 1.2 }]}>Registered</Text>
                <Text style={[s.th, { flex: 1 }]}>Status</Text>
                <Text style={[s.th, { flex: 1.5 }]}>Actions</Text>
              </View>
              {[1, 2, 3, 4, 5, 6].map(i => <SkeletonRow key={i} />)}
            </View>
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
  filterBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderRadius: 6,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    flex: 1,
    minWidth: 200,
    borderWidth: 1,
    borderColor: BORDER,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: TEXT,
  },
  filterGroup: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  selectWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderRadius: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: BORDER,
    gap: Spacing.xs,
  },
  selectText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: MUTED,
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
    backgroundColor: '#141a28',
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
  highlightRow: {
    backgroundColor: '#1e2a3a',
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
    color: '#6b9fd4',
  },
  skeleton: {
    backgroundColor: '#2a3040',
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
    marginBottom: Spacing.lg,
  },
  detailName: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fontFamilyBold,
    color: TEXT,
  },
  detailEmail: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: MUTED,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  detailItem: {
    minWidth: 140,
  },
  detailLabel: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamily,
    color: MUTED,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamilySemiBold,
    color: TEXT,
  },
  detailSectionTitle: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilySemiBold,
    color: TEXT,
    marginBottom: Spacing.sm,
  },
  detailListItem: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: MUTED,
    marginBottom: 4,
  },
  detailActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
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
    backgroundColor: '#3a1a1a',
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
    maxWidth: 400,
    borderWidth: 1,
    borderColor: BORDER,
    gap: Spacing.md,
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
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
});
