import React, { useState } from 'react';
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

// ─── Tab Bar ─────────────────────────────────────────────────────────────────

function TabBar({ active, onPress }: { active: 'upcoming' | 'past'; onPress: (t: 'upcoming' | 'past') => void }) {
  return (
    <View style={s.tabBar}>
      <TouchableOpacity
        style={[s.tab, active === 'upcoming' && s.tabActive]}
        activeOpacity={0.7}
        onPress={() => onPress('upcoming')}
      >
        <Text style={[s.tabText, active === 'upcoming' && s.tabTextActive]}>Upcoming (2)</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[s.tab, active === 'past' && s.tabActive]}
        activeOpacity={0.7}
        onPress={() => onPress('past')}
      >
        <Text style={[s.tabText, active === 'past' && s.tabTextActive]}>Past (5)</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Upcoming Registration Card ──────────────────────────────────────────────

function UpcomingCard({
  name,
  date,
  city,
  status,
  statusColor,
  statusBg,
  payment,
}: {
  name: string;
  date: string;
  city: string;
  status: string;
  statusColor: string;
  statusBg: string;
  payment?: string;
}) {
  return (
    <View style={s.card}>
      <View style={s.cardTop}>
        <View style={{ flex: 1 }}>
          <Text style={s.cardName}>{name}</Text>
          <View style={s.metaRow}>
            <Feather name="calendar" size={12} color={Colors.textMuted} />
            <Text style={s.metaText}>{date}</Text>
          </View>
          <View style={s.metaRow}>
            <Feather name="map-pin" size={12} color={Colors.textMuted} />
            <Text style={s.metaText}>{city}</Text>
          </View>
        </View>
        <View style={[s.statusBadge, { backgroundColor: statusBg }]}>
          <Text style={[s.statusText, { color: statusColor }]}>{status}</Text>
        </View>
      </View>
      {payment && (
        <View style={s.paymentRow}>
          <Feather name="credit-card" size={12} color={Colors.textMuted} />
          <Text style={s.paymentText}>{payment}</Text>
        </View>
      )}
      <View style={s.cardActions}>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={s.linkGold}>View Tournament</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={s.linkDanger}>Cancel Registration</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Past Registration Card ──────────────────────────────────────────────────

function PastCard({
  name,
  date,
  result,
  resultColor,
}: {
  name: string;
  date: string;
  result: string;
  resultColor: string;
}) {
  return (
    <View style={s.card}>
      <View style={s.cardTop}>
        <View style={{ flex: 1 }}>
          <Text style={s.cardName}>{name}</Text>
          <View style={s.metaRow}>
            <Feather name="calendar" size={12} color={Colors.textMuted} />
            <Text style={s.metaText}>{date}</Text>
          </View>
        </View>
        <View style={[s.resultBadge, { borderColor: resultColor }]}>
          <Text style={[s.resultText, { color: resultColor }]}>{result}</Text>
        </View>
      </View>
      <View style={s.cardActions}>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={s.linkGold}>View Results</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Upcoming Tab Content ────────────────────────────────────────────────────

function UpcomingContent() {
  return (
    <>
      <UpcomingCard
        name="Tbilisi Open 2025"
        date="Jun 14-20, 2025"
        city="Tbilisi, Georgia"
        status="Registered"
        statusColor={Colors.eloPositive}
        statusBg={Colors.statusSuccessBg}
        payment="EUR 50 paid"
      />
      <UpcomingCard
        name="Warsaw Classical Open"
        date="Aug 10-17, 2025"
        city="Warsaw, Poland"
        status="Pending Payment"
        statusColor={Colors.statusWarningText}
        statusBg={Colors.statusWarningBg}
      />
    </>
  );
}

// ─── Past Tab Content ────────────────────────────────────────────────────────

function PastContent() {
  return (
    <>
      <PastCard name="Oslo Rapid Cup 2024" date="Jul 3-5, 2024" result="5th Place" resultColor={Colors.primary} />
      <PastCard name="Prague Masters 2024" date="Sep 1-8, 2024" result="12th Place" resultColor={Colors.textMuted} />
      <PastCard name="Tbilisi Open 2024" date="Jun 14-20, 2024" result="3rd Place" resultColor={Colors.bronze} />
      <PastCard name="Oslo Rapid Cup 2023" date="Jul 5-7, 2023" result="DNF" resultColor={Colors.error} />
      <PastCard name="Budapest Masters 2023" date="Aug 2-9, 2023" result="8th Place" resultColor={Colors.textMuted} />
    </>
  );
}

// ─── Default State (Upcoming tab) ────────────────────────────────────────────

function DefaultState() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="home" />
      <View style={s.content}>
        <Text style={s.heading}>My Registrations</Text>
        <TabBar active={tab} onPress={setTab} />
        {tab === 'upcoming' ? <UpcomingContent /> : <PastContent />}
      </View>
    </View>
  );
}

// ─── Past Tab State ──────────────────────────────────────────────────────────

function PastTabState() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="home" />
      <View style={s.content}>
        <Text style={s.heading}>My Registrations</Text>
        <TabBar active="past" onPress={() => {}} />
        <PastContent />
      </View>
    </View>
  );
}

// ─── Loading State ───────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="home" />
      <View style={s.content}>
        <Skeleton h={24} w={200} mb={Spacing.md} />
        <View style={s.tabBar}>
          <Skeleton h={36} w="48%" />
          <Skeleton h={36} w="48%" />
        </View>
        {[1, 2, 3].map((i) => (
          <View key={i} style={[s.card, { gap: Spacing.sm }]}>
            <Skeleton h={18} w="70%" />
            <Skeleton h={14} w="50%" />
            <Skeleton h={14} w="40%" />
            <Skeleton h={14} w="30%" />
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="home" />
      <View style={s.content}>
        <Text style={s.heading}>My Registrations</Text>
        <View style={s.emptyWrap}>
          <Feather name="inbox" size={48} color={Colors.border} />
          <Text style={s.emptyTitle}>You have no registrations yet</Text>
          <Text style={s.emptyDesc}>Browse tournaments and register for your first event</Text>
          <TouchableOpacity style={s.ctaBtn} activeOpacity={0.85}>
            <Feather name="search" size={16} color={Colors.primary} />
            <Text style={s.ctaBtnText}>Browse Tournaments</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export default function MyRegistrationsStates() {
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Upcoming tab active with 2 registrations, tabs interactive">
        <DefaultState />
      </StateSection>

      <StateSection title="PAST_TAB" description="Past tab active showing tournament results">
        <PastTabState />
      </StateSection>

      <StateSection title="LOADING" description="Skeleton list placeholders">
        <LoadingState />
      </StateSection>

      <StateSection title="EMPTY" description="No registrations ever, CTA to browse">
        <EmptyState />
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
  heading: {
    fontFamily: Typography.fontFamilyHeading,
    fontSize: Typography.sizes['2xl'],
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  tabBar: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 8,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.background,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  tabTextActive: {
    fontFamily: Typography.fontFamilySemiBold,
    color: Colors.text,
  },
  card: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardName: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 3,
  },
  metaText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  statusText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  resultBadge: {
    borderRadius: 12,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderWidth: 1.5,
  },
  resultText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.xs,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  paymentText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  linkGold: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.gold,
  },
  linkDanger: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.error,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
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
    marginBottom: Spacing.lg,
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
