import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <View style={s.statCard}>
      <View style={s.statIconWrap}><Feather name={icon as any} size={20} color={ACCENT} /></View>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

const TRANSACTIONS = [
  { date: '2026-04-09', user: 'Magnus Eriksson', tournament: 'Tbilisi Open', type: 'Registration', amount: 'EUR 50.00', status: 'Completed' },
  { date: '2026-04-09', user: 'Erik Halvorsen', tournament: 'Oslo Rapid Cup', type: 'Payout', amount: 'EUR 120.00', status: 'Pending' },
  { date: '2026-04-08', user: 'Anna Petrov', tournament: 'Warsaw Classical', type: 'Refund', amount: 'EUR 50.00', status: 'Refunded' },
  { date: '2026-04-08', user: 'Lena Johansson', tournament: 'Tbilisi Open', type: 'Registration', amount: 'EUR 50.00', status: 'Completed' },
  { date: '2026-04-07', user: 'David Kipiani', tournament: 'Yerevan Masters', type: 'Registration', amount: 'EUR 75.00', status: 'Completed' },
  { date: '2026-04-07', user: 'Giorgi Beridze', tournament: 'Tbilisi Open', type: 'Payout', amount: 'EUR 340.00', status: 'Completed' },
  { date: '2026-04-06', user: 'Carlos Ruiz', tournament: 'Barcelona Blitz', type: 'Registration', amount: 'EUR 35.00', status: 'Completed' },
];

const PAYOUTS = [
  { commissar: 'Erik Halvorsen', tournament: 'Oslo Rapid Cup', amount: 'EUR 1,200', status: 'Pending', date: '2026-04-05' },
  { commissar: 'Giorgi Beridze', tournament: 'Tbilisi Open', amount: 'EUR 2,000', status: 'Pending', date: '2026-04-08' },
];

function TypeBadge({ type }: { type: string }) {
  const colorMap: Record<string, string> = { Registration: GREEN, Payout: BLUE, Refund: YELLOW };
  const color = colorMap[type] || MUTED;
  return (
    <View style={[s.badge, { backgroundColor: color + '22', borderColor: color + '44' }]}>
      <Text style={[s.badgeText, { color }]}>{type}</Text>
    </View>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = { Completed: GREEN, Pending: YELLOW, Refunded: BLUE };
  const color = colorMap[status] || MUTED;
  return (
    <View style={[s.badge, { backgroundColor: color + '22', borderColor: color + '44' }]}>
      <Text style={[s.badgeText, { color }]}>{status}</Text>
    </View>
  );
}

function DateFilter() {
  return (
    <View style={s.dateFilter}>
      <View style={s.dateInput}>
        <Feather name="calendar" size={14} color={MUTED} />
        <Text style={s.dateText}>2026-04-01</Text>
      </View>
      <Text style={s.dateSep}>to</Text>
      <View style={s.dateInput}>
        <Feather name="calendar" size={14} color={MUTED} />
        <Text style={s.dateText}>2026-04-09</Text>
      </View>
    </View>
  );
}

function TransactionsTable() {
  return (
    <View style={s.table}>
      <View style={s.tableHeader}>
        <Text style={[s.th, { flex: 1 }]}>Date</Text>
        <Text style={[s.th, { flex: 1.5 }]}>User</Text>
        <Text style={[s.th, { flex: 1.5 }]}>Tournament</Text>
        <Text style={[s.th, { flex: 1 }]}>Type</Text>
        <Text style={[s.th, { flex: 1 }]}>Amount</Text>
        <Text style={[s.th, { flex: 1 }]}>Status</Text>
      </View>
      {TRANSACTIONS.map((t, i) => (
        <View key={i} style={s.tableRow}>
          <Text style={[s.tdMuted, { flex: 1 }]}>{t.date}</Text>
          <Text style={[s.td, { flex: 1.5 }]}>{t.user}</Text>
          <Text style={[s.tdMuted, { flex: 1.5 }]}>{t.tournament}</Text>
          <View style={{ flex: 1 }}><TypeBadge type={t.type} /></View>
          <Text style={[s.td, { flex: 1 }]}>{t.amount}</Text>
          <View style={{ flex: 1 }}><StatusBadge status={t.status} /></View>
        </View>
      ))}
    </View>
  );
}

function SkeletonRow() {
  return (
    <View style={s.tableRow}>
      {[1, 1.5, 1.5, 1, 1, 1].map((f, i) => (
        <View key={i} style={{ flex: f, paddingHorizontal: 4 }}>
          <View style={[s.skeleton, { height: 14, width: '80%' }]} />
        </View>
      ))}
    </View>
  );
}

export default function AdminFinancesStates() {
  const [exportFormat, setExportFormat] = useState('CSV');

  return (
    <ScrollView style={{ backgroundColor: BG }}>
      {/* STATE: DEFAULT */}
      <StateSection title="DEFAULT" description="Finance overview with summary cards and transactions table">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="admin" activeTab="finances" />
          <View style={s.content}>
            <Text style={s.heading}>Finances</Text>

            <View style={s.statsRow}>
              <StatCard label="Total Revenue" value="EUR 45,230" icon="trending-up" />
              <StatCard label="Pending Payouts" value="EUR 3,200" icon="clock" />
              <StatCard label="Platform Fee" value="EUR 4,523" icon="percent" />
              <StatCard label="Refunds Issued" value="EUR 890" icon="rotate-ccw" />
            </View>

            <View style={s.filterRow}>
              <Text style={s.sectionTitle}>Transactions</Text>
              <DateFilter />
            </View>

            <TransactionsTable />
          </View>
        </View>
      </StateSection>

      {/* STATE: PAYOUT_VIEW */}
      <StateSection title="PAYOUT_VIEW" description="Pending payouts list with process button">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="admin" activeTab="finances" />
          <View style={s.content}>
            <Text style={s.heading}>Finances</Text>
            <Text style={s.sectionTitle}>Pending Payouts</Text>

            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text style={[s.th, { flex: 1.5 }]}>Commissar</Text>
                <Text style={[s.th, { flex: 2 }]}>Tournament</Text>
                <Text style={[s.th, { flex: 1 }]}>Amount</Text>
                <Text style={[s.th, { flex: 1 }]}>Requested</Text>
                <Text style={[s.th, { flex: 1 }]}>Status</Text>
                <Text style={[s.th, { flex: 1.2 }]}>Action</Text>
              </View>
              {PAYOUTS.map((p, i) => (
                <View key={i} style={s.tableRow}>
                  <Text style={[s.td, { flex: 1.5 }]}>{p.commissar}</Text>
                  <Text style={[s.tdMuted, { flex: 2 }]}>{p.tournament}</Text>
                  <Text style={[s.td, { flex: 1 }]}>{p.amount}</Text>
                  <Text style={[s.tdMuted, { flex: 1 }]}>{p.date}</Text>
                  <View style={{ flex: 1 }}><StatusBadge status={p.status} /></View>
                  <View style={{ flex: 1.2 }}>
                    <TouchableOpacity style={s.processBtn}>
                      <Text style={s.processBtnText}>Process Payout</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </StateSection>

      {/* STATE: LOADING */}
      <StateSection title="LOADING" description="Skeleton loading for transactions table">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="admin" activeTab="finances" />
          <View style={s.content}>
            <Text style={s.heading}>Finances</Text>
            <View style={s.statsRow}>
              {[1, 2, 3, 4].map(i => (
                <View key={i} style={s.statCard}>
                  <View style={[s.skeleton, { width: 40, height: 40, borderRadius: 20 }]} />
                  <View style={[s.skeleton, { width: 60, height: 20 }]} />
                  <View style={[s.skeleton, { width: 80, height: 12 }]} />
                </View>
              ))}
            </View>
            <Text style={s.sectionTitle}>Transactions</Text>
            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text style={[s.th, { flex: 1 }]}>Date</Text>
                <Text style={[s.th, { flex: 1.5 }]}>User</Text>
                <Text style={[s.th, { flex: 1.5 }]}>Tournament</Text>
                <Text style={[s.th, { flex: 1 }]}>Type</Text>
                <Text style={[s.th, { flex: 1 }]}>Amount</Text>
                <Text style={[s.th, { flex: 1 }]}>Status</Text>
              </View>
              {[1, 2, 3, 4, 5].map(i => <SkeletonRow key={i} />)}
            </View>
          </View>
        </View>
      </StateSection>

      {/* STATE: EXPORT_MODE */}
      <StateSection title="EXPORT_MODE" description="Export options modal with format and date range">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="admin" activeTab="finances" />
          <View style={s.content}>
            <Text style={s.heading}>Finances</Text>

            <View style={s.modalOverlay}>
              <View style={s.modal}>
                <Text style={s.modalTitle}>Export Transactions</Text>

                <Text style={s.modalLabel}>Format</Text>
                <View style={s.formatOptions}>
                  {['CSV', 'Excel', 'PDF'].map((f) => (
                    <TouchableOpacity key={f} style={[s.formatBtn, exportFormat === f && s.formatBtnActive]} onPress={() => setExportFormat(f)}>
                      <Text style={[s.formatBtnText, exportFormat === f && s.formatBtnTextActive]}>{f}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={s.modalLabel}>Date Range</Text>
                <DateFilter />

                <View style={s.modalActions}>
                  <TouchableOpacity style={s.btnOutline}><Text style={s.btnOutlineText}>Cancel</Text></TouchableOpacity>
                  <TouchableOpacity style={s.btnPrimary}>
                    <Feather name="download" size={14} color={Colors.white} />
                    <Text style={s.btnPrimaryText}>Export</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fontFamilySemiBold,
    color: TEXT,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: CARD,
    borderRadius: 8,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: BORDER,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.adminIconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.fontFamilyBold,
    color: TEXT,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamily,
    color: MUTED,
    textAlign: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  dateFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: CARD,
    borderRadius: 6,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: BORDER,
  },
  dateText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: TEXT,
  },
  dateSep: {
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
  processBtn: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: 4,
    backgroundColor: GREEN + '22',
    borderWidth: 1,
    borderColor: GREEN + '44',
    alignSelf: 'flex-start',
  },
  processBtnText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilyMedium,
    color: GREEN,
  },
  skeleton: {
    backgroundColor: Colors.adminBorder,
    borderRadius: 4,
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
    maxWidth: 420,
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
  modalLabel: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilySemiBold,
    color: TEXT,
  },
  formatOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  formatBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: Colors.adminInputBg,
  },
  formatBtnActive: {
    backgroundColor: ACCENT + '22',
    borderColor: ACCENT + '44',
  },
  formatBtnText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: MUTED,
  },
  formatBtnTextActive: {
    color: ACCENT,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.md,
    marginTop: Spacing.sm,
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
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: ACCENT,
    borderRadius: 6,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  btnPrimaryText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: Colors.white,
  },
});
