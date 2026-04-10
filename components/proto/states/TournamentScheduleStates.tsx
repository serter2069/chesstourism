import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const SCHEDULE = [
  { date: 'Jun 14', day: 'Saturday', event: 'Registration', time: '10:00-18:00', location: 'Main Hall' },
  { date: 'Jun 15', day: 'Sunday', event: 'Opening Ceremony', time: '09:00-10:00', location: 'Main Hall' },
  { date: 'Jun 15', day: 'Sunday', event: 'Round 1', time: '11:00-17:00', location: 'Playing Hall A' },
  { date: 'Jun 16', day: 'Monday', event: 'Round 2', time: '10:00-16:00', location: 'Playing Hall A' },
  { date: 'Jun 16', day: 'Monday', event: 'Round 3', time: '17:00-23:00', location: 'Playing Hall A' },
  { date: 'Jun 17', day: 'Tuesday', event: 'Round 4', time: '10:00-16:00', location: 'Playing Hall A' },
  { date: 'Jun 17', day: 'Tuesday', event: 'Round 5', time: '17:00-23:00', location: 'Playing Hall A' },
  { date: 'Jun 18', day: 'Wednesday', event: 'Round 6', time: '10:00-16:00', location: 'Playing Hall A' },
  { date: 'Jun 19', day: 'Thursday', event: 'Rest Day', time: '--', location: '--' },
  { date: 'Jun 20', day: 'Friday', event: 'Round 7', time: '10:00-16:00', location: 'Playing Hall A' },
  { date: 'Jun 21', day: 'Saturday', event: 'Closing Ceremony', time: '11:00-13:00', location: 'Main Hall' },
];

const PLAYER_ASSIGNMENTS = [
  { event: 'Round 1', board: 'Board 12', opponent: 'Ibrahim Hassan', color: 'White' },
  { event: 'Round 2', board: 'Board 5', opponent: 'Piotr Nowak', color: 'Black' },
  { event: 'Round 3', board: 'Board 3', opponent: 'Elena Kozlov', color: 'White' },
];

// ─── Skeleton ────────────────────────────────────────────────────────────────

function Skeleton({ h = 20, w = '100%', mb = 0 }: { h?: number; w?: string | number; mb?: number }) {
  return <View style={{ height: h, width: w as any, backgroundColor: Colors.skeleton, borderRadius: 6, marginBottom: mb }} />;
}

// ─── Schedule Row ────────────────────────────────────────────────────────────

function ScheduleRow({ item, highlighted }: { item: typeof SCHEDULE[0]; highlighted?: boolean }) {
  const isRest = item.event === 'Rest Day';
  const isRound = item.event.startsWith('Round');
  return (
    <View style={[s.scheduleRow, highlighted && s.scheduleRowHighlighted, isRest && s.scheduleRowRest]}>
      <View style={s.dateCol}>
        <Text style={s.dateText}>{item.date}</Text>
        <Text style={s.dayText}>{item.day}</Text>
      </View>
      <View style={s.divider} />
      <View style={{ flex: 1 }}>
        <View style={s.eventRow}>
          <Feather
            name={isRest ? 'coffee' : isRound ? 'play-circle' : 'flag'}
            size={14}
            color={highlighted ? Colors.gold : isRound ? Colors.primary : Colors.textMuted}
          />
          <Text style={[s.eventName, highlighted && s.eventNameHighlighted]}>{item.event}</Text>
        </View>
        {!isRest && (
          <View style={s.eventMeta}>
            <Feather name="clock" size={11} color={Colors.textMuted} />
            <Text style={s.eventTime}>{item.time}</Text>
            <Feather name="map-pin" size={11} color={Colors.textMuted} />
            <Text style={s.eventLocation}>{item.location}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Default View ────────────────────────────────────────────────────────────

function DefaultView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="public" />
      <View style={s.container}>
        <View style={s.tournamentHeader}>
          <Text style={s.heading}>Tbilisi Open 2025</Text>
          <View style={s.headerMeta}>
            <Feather name="calendar" size={14} color={Colors.textMuted} />
            <Text style={s.headerMetaText}>Jun 14-21, 2025</Text>
            <Feather name="map-pin" size={14} color={Colors.textMuted} />
            <Text style={s.headerMetaText}>Tbilisi, Georgia</Text>
          </View>
        </View>

        <Text style={s.sectionTitle}>Schedule</Text>

        {/* Table Header */}
        <View style={s.tableHeader}>
          <Text style={[s.thText, { width: 70 }]}>Date</Text>
          <Text style={[s.thText, { flex: 1 }]}>Event</Text>
        </View>

        {SCHEDULE.map((item, i) => <ScheduleRow key={i} item={item} />)}
      </View>
    </View>
  );
}

// ─── Loading View ────────────────────────────────────────────────────────────

function LoadingView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="public" />
      <View style={s.container}>
        <Skeleton h={28} w={220} mb={Spacing.sm} />
        <Skeleton h={14} w={180} mb={Spacing.lg} />
        <Skeleton h={20} w={100} mb={Spacing.md} />
        <Skeleton h={32} mb={Spacing.sm} />
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <View key={i} style={s.scheduleRow}>
            <View style={{ width: 70, gap: Spacing.xs }}>
              <Skeleton h={14} w={50} />
              <Skeleton h={10} w={60} />
            </View>
            <View style={{ flex: 1, gap: Spacing.xs }}>
              <Skeleton h={14} w="60%" />
              <Skeleton h={10} w="40%" />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Empty View ──────────────────────────────────────────────────────────────

function EmptyView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="public" />
      <View style={s.container}>
        <View style={s.tournamentHeader}>
          <Text style={s.heading}>Tbilisi Open 2025</Text>
          <View style={s.headerMeta}>
            <Feather name="calendar" size={14} color={Colors.textMuted} />
            <Text style={s.headerMetaText}>Jun 14-21, 2025</Text>
          </View>
        </View>
        <View style={s.emptyWrap}>
          <Feather name="clock" size={48} color={Colors.border} />
          <Text style={s.emptyTitle}>Schedule Not Published</Text>
          <Text style={s.emptyDesc}>The tournament schedule will be published soon. Check back later.</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Player View ─────────────────────────────────────────────────────────────

function PlayerView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="tournaments" />
      <View style={s.container}>
        <View style={s.tournamentHeader}>
          <Text style={s.heading}>Tbilisi Open 2025</Text>
          <View style={s.headerMeta}>
            <Feather name="calendar" size={14} color={Colors.textMuted} />
            <Text style={s.headerMetaText}>Jun 14-21, 2025</Text>
          </View>
        </View>

        {/* Player assignments */}
        <View style={s.assignmentBanner}>
          <Feather name="user" size={16} color={Colors.gold} />
          <Text style={s.assignmentTitle}>Your Board Assignments</Text>
        </View>
        {PLAYER_ASSIGNMENTS.map((a) => (
          <View key={a.event} style={s.assignmentRow}>
            <Text style={s.assignmentRound}>{a.event}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.assignmentOpponent}>vs {a.opponent}</Text>
              <Text style={s.assignmentDetail}>{a.board} -- Playing {a.color}</Text>
            </View>
          </View>
        ))}

        <Text style={s.sectionTitle}>Full Schedule</Text>
        <View style={s.tableHeader}>
          <Text style={[s.thText, { width: 70 }]}>Date</Text>
          <Text style={[s.thText, { flex: 1 }]}>Event</Text>
        </View>
        {SCHEDULE.slice(0, 5).map((item, i) => (
          <ScheduleRow
            key={i}
            item={item}
            highlighted={item.event === 'Round 1' || item.event === 'Round 2' || item.event === 'Round 3'}
          />
        ))}
        <Text style={s.moreText}>+ 6 more events</Text>
      </View>
    </View>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export default function TournamentScheduleStates() {
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Public schedule view with full event list">
        <DefaultView />
      </StateSection>
      <StateSection title="LOADING" description="Skeleton loading state">
        <LoadingView />
      </StateSection>
      <StateSection title="EMPTY" description="Schedule not yet published">
        <EmptyView />
      </StateSection>
      <StateSection title="PLAYER_VIEW" description="Logged-in player view with board assignments highlighted">
        <PlayerView />
      </StateSection>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { backgroundColor: Colors.background },
  container: { padding: Spacing.md },
  tournamentHeader: { marginBottom: Spacing.lg },
  heading: { fontFamily: Typography.fontFamilyHeading, fontSize: Typography.sizes['2xl'], color: Colors.text },
  headerMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.xs },
  headerMetaText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.textMuted, marginRight: Spacing.sm },
  sectionTitle: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.lg, color: Colors.text, marginBottom: Spacing.md, marginTop: Spacing.md },
  tableHeader: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: 8,
    borderBottomLeftRadius: 0, borderBottomRightRadius: 0, marginBottom: 1,
  },
  thText: { fontFamily: Typography.fontFamilySemiBold, fontSize: 11, color: Colors.tableHeaderText, textTransform: 'uppercase', letterSpacing: 0.5 },
  scheduleRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md,
    paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  scheduleRowHighlighted: { backgroundColor: Colors.highlightWarm },
  scheduleRowRest: { backgroundColor: Colors.backgroundAlt },
  dateCol: { width: 60 },
  dateText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.sm, color: Colors.text },
  dayText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted },
  divider: { width: 2, height: 36, backgroundColor: Colors.border, borderRadius: 1, marginTop: 2 },
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  eventName: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.sm, color: Colors.text },
  eventNameHighlighted: { color: Colors.gold },
  eventMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  eventTime: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted, marginRight: Spacing.sm },
  eventLocation: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted },
  assignmentBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: 8, marginBottom: Spacing.sm,
  },
  assignmentTitle: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.sm, color: Colors.gold },
  assignmentRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  assignmentRound: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.sm, color: Colors.primary, width: 60 },
  assignmentOpponent: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.sm, color: Colors.text },
  assignmentDetail: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted, marginTop: 2 },
  moreText: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.sm, color: Colors.gold, textAlign: 'center', paddingVertical: Spacing.md },
  emptyWrap: { alignItems: 'center', paddingVertical: Spacing['3xl'] },
  emptyTitle: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.lg, color: Colors.text, marginTop: Spacing.md },
  emptyDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm, maxWidth: 280 },
});
