import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

// ─── Skeleton ────────────────────────────────────────────────────────────────

function Skeleton({ h = 20, w = '100%', mb = 0 }: { h?: number; w?: string | number; mb?: number }) {
  return <View style={{ height: h, width: w as any, backgroundColor: '#E8ECF0', borderRadius: 6, marginBottom: mb }} />;
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <View style={s.statCard}>
      <View style={s.statIconWrap}>
        <Feather name={icon as any} size={18} color={Colors.gold} />
      </View>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

// ─── Tournament Item ─────────────────────────────────────────────────────────

function TournamentItem({ name, dates, status, registered }: { name: string; dates: string; status: string; registered: string }) {
  return (
    <TouchableOpacity style={s.tournamentItem} activeOpacity={0.8}>
      <View style={{ flex: 1 }}>
        <Text style={s.tournamentName}>{name}</Text>
        <View style={s.tournamentMeta}>
          <Feather name="calendar" size={12} color={Colors.textMuted} />
          <Text style={s.tournamentDates}>{dates}</Text>
        </View>
        <Text style={s.tournamentRegistered}>{registered}</Text>
      </View>
      <View style={s.statusBadge}>
        <Text style={s.statusText}>{status}</Text>
      </View>
      <Feather name="chevron-right" size={16} color={Colors.border} />
    </TouchableOpacity>
  );
}

// ─── Activity Item ───────────────────────────────────────────────────────────

function ActivityItem({ text, time, icon }: { text: string; time: string; icon: string }) {
  return (
    <View style={s.activityItem}>
      <View style={s.activityIcon}>
        <Feather name={icon as any} size={14} color={Colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.activityText}>{text}</Text>
        <Text style={s.activityTime}>{time}</Text>
      </View>
    </View>
  );
}

// ─── Verified Badge ──────────────────────────────────────────────────────────

function VerifiedBadge() {
  return (
    <View style={s.verifiedBadge}>
      <Feather name="star" size={14} color={Colors.gold} />
      <Text style={s.verifiedText}>Verified Commissar</Text>
    </View>
  );
}

// ─── Become Verified Banner ──────────────────────────────────────────────────

function BecomeVerifiedBanner() {
  return (
    <View style={s.verifyBanner}>
      <View style={{ flex: 1 }}>
        <Text style={s.verifyTitle}>Become a Verified Commissar</Text>
        <Text style={s.verifyDesc}>Verified commissars get priority listing and a trust badge on their tournaments.</Text>
      </View>
      <TouchableOpacity style={s.verifyBtn} activeOpacity={0.85}>
        <Text style={s.verifyBtnText}>Apply Now</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Page Content ────────────────────────────────────────────────────────────

function CabinetContent({ verified }: { verified?: boolean }) {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <View style={s.headerRow}>
          <Text style={s.heading}>My Commissioner Cabinet</Text>
          {verified && <VerifiedBadge />}
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          <StatCard label="Active Tournaments" value="2" icon="award" />
          <StatCard label="Total Hosted" value="12" icon="calendar" />
          <StatCard label="Avg Rating" value="4.9" icon="star" />
        </View>

        {/* Upcoming */}
        <Text style={s.sectionTitle}>Upcoming Tournaments</Text>
        <TournamentItem
          name="Tbilisi Open 2025"
          dates="Jun 14-21, 2025"
          status="OPEN"
          registered="87/120 registered"
        />
        <TournamentItem
          name="Warsaw Classical 2025"
          dates="Aug 10-17, 2025"
          status="OPEN"
          registered="34/80 registered"
        />

        {/* Recent Activity */}
        <Text style={s.sectionTitle}>Recent Activity</Text>
        <ActivityItem text="New registration received for Tbilisi Open" time="2 hours ago" icon="user-plus" />
        <ActivityItem text="Round 3 results submitted for Tbilisi Open" time="1 day ago" icon="check-circle" />
        <ActivityItem text="Announcement posted: Venue Details" time="3 days ago" icon="bell" />
        <ActivityItem text="Warsaw Classical published" time="5 days ago" icon="globe" />

        {/* Become Verified */}
        {!verified && <BecomeVerifiedBanner />}
      </View>
    </View>
  );
}

// ─── Loading State ───────────────────────────────────────────────────────────

function LoadingContent() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <Skeleton h={28} w={260} mb={Spacing.lg} />
        <View style={s.statsRow}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={s.statCard}>
              <Skeleton h={36} w={36} mb={Spacing.sm} />
              <Skeleton h={24} w={40} mb={Spacing.xs} />
              <Skeleton h={12} w={80} />
            </View>
          ))}
        </View>
        <Skeleton h={20} w={180} mb={Spacing.md} />
        {[1, 2].map((i) => (
          <View key={i} style={[s.tournamentItem, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1, gap: Spacing.sm }}>
              <Skeleton h={16} w="80%" />
              <Skeleton h={12} w="50%" />
            </View>
          </View>
        ))}
        <Skeleton h={20} w={150} mb={Spacing.md} />
        {[1, 2, 3].map((i) => (
          <View key={i} style={s.activityItem}>
            <Skeleton h={28} w={28} />
            <View style={{ flex: 1, gap: Spacing.xs }}>
              <Skeleton h={14} w="90%" />
              <Skeleton h={10} w={80} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export default function CommissionerCabinetStates() {
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Commissioner cabinet with stats, tournaments, activity feed, and verification banner">
        <CabinetContent />
      </StateSection>
      <StateSection title="VERIFIED" description="Verified commissioner - gold badge visible, no verification banner">
        <CabinetContent verified />
      </StateSection>
      <StateSection title="LOADING" description="Skeleton loading state">
        <LoadingContent />
      </StateSection>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { backgroundColor: Colors.background, maxWidth: 430 },
  container: { padding: Spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.lg },
  heading: { fontFamily: Typography.fontFamilyHeading, fontSize: Typography.sizes['2xl'], color: Colors.text },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  statCard: {
    flex: 1, backgroundColor: Colors.backgroundAlt, borderRadius: 8, padding: Spacing.md,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  statIconWrap: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm,
  },
  statValue: { fontFamily: Typography.fontFamilyBold, fontSize: Typography.sizes.xl, color: Colors.text },
  statLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted, textAlign: 'center', marginTop: 2 },
  sectionTitle: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.lg, color: Colors.text, marginBottom: Spacing.md, marginTop: Spacing.md },
  tournamentItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  tournamentName: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.text },
  tournamentMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: 4 },
  tournamentDates: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted },
  tournamentRegistered: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted, marginTop: 2 },
  statusBadge: { backgroundColor: Colors.statusSuccessBg, paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: 12 },
  statusText: { fontFamily: Typography.fontFamilySemiBold, fontSize: 10, color: '#1A6B3A', textTransform: 'uppercase', letterSpacing: 0.5 },
  activityItem: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, paddingVertical: Spacing.sm },
  activityIcon: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.backgroundAlt,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  activityText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.text },
  activityTime: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted, marginTop: 2 },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    backgroundColor: '#FDF5E6', paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: 12,
  },
  verifiedText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.xs, color: Colors.gold },
  verifyBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.primary, borderRadius: 12, padding: Spacing.md, marginTop: Spacing.lg,
  },
  verifyTitle: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.gold, marginBottom: 4 },
  verifyDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: 'rgba(255,255,255,0.7)' },
  verifyBtn: { backgroundColor: Colors.gold, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: 4 },
  verifyBtnText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.sm, color: Colors.primary },
});
