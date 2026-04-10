import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

// ─── Skeleton ────────────────────────────────────────────────────────────────

function Skeleton({ h = 20, w = '100%', mb = 0 }: { h?: number; w?: string | number; mb?: number }) {
  return <View style={{ height: h, width: w as any, backgroundColor: Colors.border, borderRadius: 6, marginBottom: mb }} />;
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, color }: { icon: any; label: string; value: string; color?: string }) {
  return (
    <View style={s.statCard}>
      <View style={[s.statIcon, color ? { backgroundColor: color + '18' } : null]}>
        <Feather name={icon} size={18} color={color || Colors.gold} />
      </View>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

// ─── Registration Card ───────────────────────────────────────────────────────

function RegCard({
  name,
  date,
  city,
  status,
  statusColor,
}: {
  name: string;
  date: string;
  city: string;
  status: string;
  statusColor: string;
}) {
  return (
    <View style={s.regCard}>
      <View style={s.regHeader}>
        <Text style={s.regName}>{name}</Text>
        <View style={[s.statusBadge, { backgroundColor: statusColor + '18' }]}>
          <Text style={[s.statusText, { color: statusColor }]}>{status}</Text>
        </View>
      </View>
      <View style={s.regMeta}>
        <Feather name="calendar" size={12} color={Colors.textMuted} />
        <Text style={s.regMetaText}>{date}</Text>
        <Feather name="map-pin" size={12} color={Colors.textMuted} />
        <Text style={s.regMetaText}>{city}</Text>
      </View>
    </View>
  );
}

// ─── Watchlist Card ──────────────────────────────────────────────────────────

function WatchCard({ name, date, fee }: { name: string; date: string; fee: string }) {
  return (
    <View style={s.watchCard}>
      <View style={{ flex: 1 }}>
        <Text style={s.watchName}>{name}</Text>
        <View style={s.regMeta}>
          <Feather name="calendar" size={12} color={Colors.textMuted} />
          <Text style={s.regMetaText}>{date}</Text>
          <Text style={s.feePill}>{fee}</Text>
        </View>
      </View>
      <TouchableOpacity style={s.registerBtn} activeOpacity={0.85}>
        <Text style={s.registerBtnText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Default Dashboard ───────────────────────────────────────────────────────

function DashboardDefault() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="home" />
      <View style={s.content}>
        <Text style={s.greeting}>Hello, Magnus!</Text>
        <Text style={s.greetingSub}>Here is your chess overview</Text>

        <View style={s.statsRow}>
          <StatCard icon="calendar" label="Registered" value="2 upcoming" color={Colors.primary} />
          <StatCard icon="trending-up" label="ELO" value="2156" color={Colors.gold} />
          <StatCard icon="award" label="Rank" value="#312" color={Colors.eloPositive} />
        </View>

        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Upcoming Tournaments</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={s.linkGold}>View all</Text>
            </TouchableOpacity>
          </View>
          <RegCard name="Tbilisi Open 2025" date="Jun 14-20" city="Tbilisi, Georgia" status="Registered" statusColor={Colors.eloPositive} />
          <RegCard name="Warsaw Classical Open" date="Aug 10-17" city="Warsaw, Poland" status="Pending Payment" statusColor={Colors.statusWarningText} />
        </View>

        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Watchlist</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={s.linkGold}>See all</Text>
            </TouchableOpacity>
          </View>
          <WatchCard name="Oslo Rapid Cup" date="Jul 3-5" fee="EUR 80" />
          <WatchCard name="Prague Masters" date="Sep 1-8" fee="EUR 90" />
        </View>
      </View>
    </View>
  );
}

// ─── No Registrations ────────────────────────────────────────────────────────

function DashboardEmpty() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="home" />
      <View style={s.content}>
        <Text style={s.greeting}>Welcome, Magnus!</Text>
        <Text style={s.greetingSub}>Your chess journey starts here</Text>

        <View style={s.statsRow}>
          <StatCard icon="calendar" label="Registered" value="0" color={Colors.primary} />
          <StatCard icon="trending-up" label="ELO" value="--" color={Colors.gold} />
          <StatCard icon="award" label="Rank" value="--" color={Colors.eloPositive} />
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>Upcoming Tournaments</Text>
          <View style={s.emptyCard}>
            <Feather name="compass" size={36} color={Colors.border} />
            <Text style={s.emptyTitle}>No registrations yet</Text>
            <Text style={s.emptyDesc}>Find your first tournament and start competing</Text>
            <TouchableOpacity style={s.ctaBtn} activeOpacity={0.85}>
              <Text style={s.ctaBtnText}>Find your first tournament</Text>
              <Feather name="arrow-right" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Loading ─────────────────────────────────────────────────────────────────

function DashboardLoading() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="home" />
      <View style={s.content}>
        <Skeleton h={28} w={200} mb={Spacing.sm} />
        <Skeleton h={14} w={160} mb={Spacing.lg} />

        <View style={s.statsRow}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={s.statCard}>
              <Skeleton h={40} w={40} mb={Spacing.sm} />
              <Skeleton h={22} w={60} mb={Spacing.xs} />
              <Skeleton h={12} w={80} />
            </View>
          ))}
        </View>

        <View style={s.section}>
          <Skeleton h={20} w={180} mb={Spacing.md} />
          {[1, 2].map((i) => (
            <View key={i} style={[s.regCard, { gap: Spacing.sm }]}>
              <Skeleton h={16} w="70%" />
              <Skeleton h={12} w="50%" />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export default function DashboardStates() {
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Greeting, stats, upcoming tournaments, watchlist">
        <DashboardDefault />
      </StateSection>

      <StateSection title="NO_REGISTRATIONS" description="New user, empty state with CTA to browse tournaments">
        <DashboardEmpty />
      </StateSection>

      <StateSection title="LOADING" description="Skeleton stats and tournament cards">
        <DashboardLoading />
      </StateSection>
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    backgroundColor: Colors.background,

  },
  content: {
    padding: Spacing.md,
  },
  greeting: {
    fontFamily: Typography.fontFamilyHeading,
    fontSize: Typography.sizes['2xl'],
    color: Colors.text,
  },
  greetingSub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.lg,
    color: Colors.text,
  },
  statLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.lg,
    color: Colors.text,
  },
  linkGold: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.gold,
  },
  regCard: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  regHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  regName: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.text,
    flex: 1,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  statusText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  regMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  regMetaText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginRight: Spacing.sm,
  },
  watchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  watchName: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  feePill: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.xs,
    color: Colors.statusWarningText,
    backgroundColor: Colors.statusWarningBg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  registerBtn: {
    backgroundColor: Colors.gold,
    borderRadius: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  registerBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },
  emptyDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.gold,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
  },
  ctaBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
  },
});
