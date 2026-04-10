import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
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
const YELLOW = '#ffc107';
const BLUE = '#6b9fd4';

const ORGS = [
  { name: 'Tbilisi Chess Federation', country: 'Georgia', contact: 'info@tchess.ge', date: '2026-04-01', status: 'Pending' },
  { name: 'Norwegian Chess Association', country: 'Norway', contact: 'post@sjakk.no', date: '2026-02-15', status: 'Approved' },
  { name: 'Armenian Chess Federation', country: 'Armenia', contact: 'office@chessfed.am', date: '2026-01-20', status: 'Approved' },
  { name: 'Warsaw Chess Club', country: 'Poland', contact: 'klub@warsawchess.pl', date: '2026-03-10', status: 'Rejected' },
];

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = { Pending: YELLOW, Approved: GREEN, Rejected: RED };
  const color = colorMap[status] || MUTED;
  return (
    <View style={[s.badge, { backgroundColor: color + '22', borderColor: color + '44' }]}>
      <Text style={[s.badgeText, { color }]}>{status}</Text>
    </View>
  );
}

function OrgsTable({ orgs, highlightPending }: { orgs: typeof ORGS; highlightPending?: boolean }) {
  return (
    <View style={s.table}>
      <View style={s.tableHeader}>
        <Text style={[s.th, { flex: 2.5 }]}>Name</Text>
        <Text style={[s.th, { flex: 1 }]}>Country</Text>
        <Text style={[s.th, { flex: 2 }]}>Contact</Text>
        <Text style={[s.th, { flex: 1.2 }]}>Applied</Text>
        <Text style={[s.th, { flex: 1 }]}>Status</Text>
        <Text style={[s.th, { flex: 1.5 }]}>Actions</Text>
      </View>
      {orgs.map((o, i) => (
        <View key={i} style={[s.tableRow, highlightPending && o.status === 'Pending' && s.pendingRow]}>
          <Text style={[s.td, { flex: 2.5 }]}>{o.name}</Text>
          <Text style={[s.tdMuted, { flex: 1 }]}>{o.country}</Text>
          <Text style={[s.tdMuted, { flex: 2 }]}>{o.contact}</Text>
          <Text style={[s.tdMuted, { flex: 1.2 }]}>{o.date}</Text>
          <View style={{ flex: 1 }}><StatusBadge status={o.status} /></View>
          <View style={[s.actions, { flex: 1.5 }]}>
            <TouchableOpacity><Text style={s.actionLink}>Review</Text></TouchableOpacity>
            {o.status === 'Pending' && (
              <>
                <TouchableOpacity><Text style={[s.actionLink, { color: GREEN }]}>Approve</Text></TouchableOpacity>
                <TouchableOpacity><Text style={[s.actionLink, { color: RED }]}>Reject</Text></TouchableOpacity>
              </>
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
      {[2.5, 1, 2, 1.2, 1, 1.5].map((f, i) => (
        <View key={i} style={{ flex: f, paddingHorizontal: 4 }}>
          <View style={[s.skeleton, { height: 14, width: '80%' }]} />
        </View>
      ))}
    </View>
  );
}

export default function AdminOrganizationsStates() {
  return (
    <ScrollView style={{ backgroundColor: BG }}>
      {/* STATE: DEFAULT */}
      <StateSection title="DEFAULT" description="Organizations list with pending applications highlighted">
        <View style={s.page}>
          <ProtoNav variant="admin" activeTab="moderation" />
          <View style={s.content}>
            <Text style={s.heading}>Organizations</Text>
            <OrgsTable orgs={ORGS} highlightPending />
          </View>
        </View>
      </StateSection>

      {/* STATE: REVIEW_MODAL */}
      <StateSection title="REVIEW_MODAL" description="Full application review modal">
        <View style={s.page}>
          <ProtoNav variant="admin" activeTab="moderation" />
          <View style={s.content}>
            <Text style={s.heading}>Organizations</Text>

            <View style={s.modalOverlay}>
              <View style={s.modal}>
                <Text style={s.modalTitle}>Review Application</Text>

                <View style={s.reviewHeader}>
                  <Image
                    source={{ uri: 'https://picsum.photos/seed/chess-board/200/200' }}
                    style={{ width: 56, height: 56, borderRadius: 8 }}
                    resizeMode="cover"
                  />
                  <View style={{ marginLeft: Spacing.md, flex: 1 }}>
                    <Text style={s.reviewName}>Tbilisi Chess Federation</Text>
                    <Text style={s.reviewCountry}>Georgia</Text>
                  </View>
                  <StatusBadge status="Pending" />
                </View>

                <View style={s.reviewGrid}>
                  <View style={s.reviewItem}><Text style={s.reviewLabel}>FIDE Federation Code</Text><Text style={s.reviewValue}>GEO</Text></View>
                  <View style={s.reviewItem}><Text style={s.reviewLabel}>Venue Capacity</Text><Text style={s.reviewValue}>200 players</Text></View>
                  <View style={s.reviewItem}><Text style={s.reviewLabel}>Contact Email</Text><Text style={s.reviewValue}>info@tchess.ge</Text></View>
                  <View style={s.reviewItem}><Text style={s.reviewLabel}>Applied</Text><Text style={s.reviewValue}>2026-04-01</Text></View>
                </View>

                <Text style={s.reviewLabel}>Description</Text>
                <Text style={s.reviewDesc}>The Tbilisi Chess Federation has been organizing international chess events since 1995. We host annual open tournaments at the Tbilisi Chess Palace with capacity for 200 players across multiple halls.</Text>

                <View style={s.reviewActions}>
                  <TouchableOpacity style={s.btnApprove}><Feather name="check" size={14} color="#fff" /><Text style={s.btnApproveText}>Approve</Text></TouchableOpacity>
                  <TouchableOpacity style={s.btnReject}><Feather name="x" size={14} color="#fff" /><Text style={s.btnRejectText}>Reject</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </StateSection>

      {/* STATE: LOADING */}
      <StateSection title="LOADING" description="Skeleton loading state">
        <View style={s.page}>
          <ProtoNav variant="admin" activeTab="moderation" />
          <View style={s.content}>
            <Text style={s.heading}>Organizations</Text>
            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text style={[s.th, { flex: 2.5 }]}>Name</Text>
                <Text style={[s.th, { flex: 1 }]}>Country</Text>
                <Text style={[s.th, { flex: 2 }]}>Contact</Text>
                <Text style={[s.th, { flex: 1.2 }]}>Applied</Text>
                <Text style={[s.th, { flex: 1 }]}>Status</Text>
                <Text style={[s.th, { flex: 1.5 }]}>Actions</Text>
              </View>
              {[1, 2, 3, 4].map(i => <SkeletonRow key={i} />)}
            </View>
          </View>
        </View>
      </StateSection>

      {/* STATE: EMPTY */}
      <StateSection title="EMPTY" description="No pending applications">
        <View style={s.page}>
          <ProtoNav variant="admin" activeTab="moderation" />
          <View style={s.content}>
            <Text style={s.heading}>Organizations</Text>
            <View style={s.emptyState}>
              <Feather name="inbox" size={48} color={MUTED} />
              <Text style={s.emptyTitle}>No Pending Applications</Text>
              <Text style={s.emptyText}>All organization applications have been reviewed. New applications will appear here.</Text>
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
  pendingRow: {
    backgroundColor: '#1e2535',
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
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: CARD,
    borderRadius: 12,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 500,
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
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewName: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fontFamilyBold,
    color: TEXT,
  },
  reviewCountry: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: MUTED,
  },
  reviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  reviewItem: {
    minWidth: 140,
  },
  reviewLabel: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamily,
    color: MUTED,
    marginBottom: 2,
  },
  reviewValue: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilySemiBold,
    color: TEXT,
  },
  reviewDesc: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: MUTED,
    lineHeight: 20,
  },
  reviewActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  btnApprove: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: '#1a3a1a',
    borderRadius: 6,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: GREEN + '44',
  },
  btnApproveText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: GREEN,
  },
  btnReject: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: '#3a1a1a',
    borderRadius: 6,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: RED + '44',
  },
  btnRejectText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: RED,
  },
  emptyState: {
    backgroundColor: CARD,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    padding: Spacing['2xl'],
    alignItems: 'center',
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fontFamilySemiBold,
    color: TEXT,
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: MUTED,
    textAlign: 'center',
    maxWidth: 300,
  },
});
