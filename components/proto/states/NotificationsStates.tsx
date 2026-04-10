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

// ─── Notification Types ──────────────────────────────────────────────────────

type NotifType = 'registration' | 'payment' | 'pairing' | 'reminder' | 'elo';

const NOTIF_ICONS: Record<NotifType, { icon: string; bg: string; color: string }> = {
  registration: { icon: 'check-circle', bg: Colors.statusSuccessBg, color: '#2E7D32' },
  payment:      { icon: 'credit-card', bg: Colors.statusWarningBg, color: Colors.statusWarningText },
  pairing:      { icon: 'grid',        bg: Colors.statusInfoBg,    color: Colors.primary },
  reminder:     { icon: 'bell',        bg: Colors.statusWarningBg, color: Colors.statusWarningText },
  elo:          { icon: 'trending-up', bg: Colors.statusSuccessBg, color: '#2E7D32' },
};

interface Notif {
  type: NotifType;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

const NOTIFICATIONS: Notif[] = [
  { type: 'registration', title: 'Registration Confirmed', body: 'You are registered for Tbilisi Open 2025', time: '2h ago', unread: true },
  { type: 'payment', title: 'Payment Received', body: 'EUR 50 payment confirmed for Tbilisi Open 2025', time: '2h ago', unread: true },
  { type: 'pairing', title: 'Round 2 Pairings Ready', body: 'Oslo Rapid Cup Round 2 pairings are now available', time: '1d ago', unread: false },
  { type: 'reminder', title: 'Tournament Reminder', body: 'Tbilisi Open 2025 starts in 3 days', time: '2d ago', unread: false },
  { type: 'elo', title: 'ELO Updated', body: 'Your ELO changed +12 after Tbilisi Open', time: '1w ago', unread: false },
];

// ─── Notification Row ────────────────────────────────────────────────────────

function NotifRow({ notif, allRead }: { notif: Notif; allRead?: boolean }) {
  const isUnread = notif.unread && !allRead;
  const iconMeta = NOTIF_ICONS[notif.type];

  return (
    <TouchableOpacity style={[s.notifRow, isUnread && s.notifUnread]} activeOpacity={0.7}>
      {isUnread && <View style={s.unreadBar} />}
      <View style={[s.notifIcon, { backgroundColor: iconMeta.bg }]}>
        <Feather name={iconMeta.icon as any} size={18} color={iconMeta.color} />
      </View>
      <View style={s.notifContent}>
        <Text style={[s.notifTitle, isUnread && s.notifTitleUnread]}>{notif.title}</Text>
        <Text style={[s.notifBody, isUnread && s.notifBodyUnread]}>{notif.body}</Text>
        <Text style={s.notifTime}>{notif.time}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Default ─────────────────────────────────────────────────────────────────

function DefaultState() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="home" />
      <View style={s.content}>
        <View style={s.headRow}>
          <Text style={s.heading}>Notifications</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={s.markAllRead}>Mark all read</Text>
          </TouchableOpacity>
        </View>
        {NOTIFICATIONS.map((n, i) => (
          <NotifRow key={i} notif={n} />
        ))}
      </View>
    </View>
  );
}

// ─── All Read ────────────────────────────────────────────────────────────────

function AllReadState() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="home" />
      <View style={s.content}>
        <View style={s.headRow}>
          <Text style={s.heading}>Notifications</Text>
        </View>
        {NOTIFICATIONS.map((n, i) => (
          <NotifRow key={i} notif={n} allRead />
        ))}
      </View>
    </View>
  );
}

// ─── Loading ─────────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="home" />
      <View style={s.content}>
        <Skeleton h={24} w={180} mb={Spacing.lg} />
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={[s.notifRow, { gap: Spacing.sm }]}>
            <Skeleton h={40} w={40} />
            <View style={{ flex: 1, gap: Spacing.xs }}>
              <Skeleton h={14} w="50%" />
              <Skeleton h={12} w="80%" />
              <Skeleton h={10} w={50} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Empty ───────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="home" />
      <View style={s.content}>
        <Text style={s.heading}>Notifications</Text>
        <View style={s.emptyWrap}>
          <Feather name="bell-off" size={48} color={Colors.border} />
          <Text style={s.emptyTitle}>No notifications</Text>
          <Text style={s.emptyDesc}>You will see updates about your tournaments and registrations here</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export default function NotificationsStates() {
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Mix of unread (blue border, bold) and read notifications">
        <DefaultState />
      </StateSection>

      <StateSection title="ALL_READ" description="All notifications read, no blue borders">
        <AllReadState />
      </StateSection>

      <StateSection title="LOADING" description="Skeleton notification rows">
        <LoadingState />
      </StateSection>

      <StateSection title="EMPTY" description="No notifications yet">
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
  headRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  heading: {
    fontFamily: Typography.fontFamilyHeading,
    fontSize: Typography.sizes['2xl'],
    color: Colors.text,
  },
  markAllRead: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.gold,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    position: 'relative',
  },
  notifUnread: {
    backgroundColor: Colors.statusInfoBg,
    borderRadius: 8,
    borderBottomWidth: 0,
    marginBottom: 1,
  },
  unreadBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  notifTitleUnread: {
    fontFamily: Typography.fontFamilySemiBold,
  },
  notifBody: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
    lineHeight: 20,
  },
  notifBodyUnread: {
    color: Colors.text,
  },
  notifTime: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
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
    maxWidth: 280,
  },
});
