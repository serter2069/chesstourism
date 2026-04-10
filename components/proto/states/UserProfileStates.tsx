import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import ProtoPlaceholderImage from '../ProtoPlaceholderImage';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

const TOURNAMENT_HISTORY = [
  { id: 1, name: 'Tbilisi Open 2025', date: 'Jun 2025', result: '2nd Place', elo: '+12' },
  { id: 2, name: 'Prague Masters', date: 'May 2025', result: '5th Place', elo: '-7' },
  { id: 3, name: 'Oslo Rapid Cup', date: 'Apr 2025', result: '1st Place', elo: '+18' },
  { id: 4, name: 'Warsaw Classical', date: 'Mar 2025', result: '8th Place', elo: '-3' },
  { id: 5, name: 'Yerevan Blitz', date: 'Feb 2025', result: '3rd Place', elo: '+9' },
  { id: 6, name: 'Baku Open', date: 'Jan 2025', result: '4th Place', elo: '+5' },
];

function ProfileDefault() {
  return (
    <View style={s.page}>
      <View style={s.profileHeader}>
        <ProtoPlaceholderImage type="avatar" size={80} borderRadius={40} label="Magnus Eriksson" />
        <View style={s.headerInfo}>
          <Text style={s.playerName}>Magnus Eriksson</Text>
          <View style={s.countryRow}>
            <Feather name="flag" size={13} color={Colors.textMuted} />
            <Text style={s.countryText}>Sweden</Text>
          </View>
        </View>
      </View>

      <View style={s.eloBox}>
        <Text style={s.eloLabel}>ELO Rating</Text>
        <Text style={s.eloValue}>2156</Text>
        <View style={s.eloChangeRow}>
          <Feather name="trending-up" size={14} color={Colors.eloPositive} />
          <Text style={[s.eloChange, { color: Colors.eloPositive }]}>+12 this month</Text>
        </View>
      </View>

      <View style={s.statsRow}>
        <View style={s.statBox}>
          <Text style={s.statValue}>12</Text>
          <Text style={s.statLabel}>Tournaments</Text>
        </View>
        <View style={s.statDivider} />
        <View style={s.statBox}>
          <Text style={s.statValue}>2nd</Text>
          <Text style={s.statLabel}>Best Result</Text>
        </View>
        <View style={s.statDivider} />
        <View style={s.statBox}>
          <Text style={s.statValue}>2156</Text>
          <Text style={s.statLabel}>Current ELO</Text>
        </View>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Tournament History</Text>
        {TOURNAMENT_HISTORY.map(t => (
          <TouchableOpacity key={t.id} style={s.historyRow} activeOpacity={0.8}>
            <View style={s.historyInfo}>
              <Text style={s.historyName}>{t.name}</Text>
              <Text style={s.historyDate}>{t.date}</Text>
            </View>
            <Text style={s.historyResult}>{t.result}</Text>
            <Text style={[s.historyElo, {
              color: t.elo.startsWith('+') ? Colors.eloPositive : Colors.eloNegative
            }]}>{t.elo}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function UserProfileStates() {
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Public user profile with ELO, stats, and tournament history">
        <ProtoNav variant="public" />
        <ProfileDefault />
      </StateSection>

      <StateSection title="LOADING" description="Skeleton loading state">
        <ProtoNav variant="public" />
        <View style={s.page}>
          <View style={s.profileHeader}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.border }} />
            <View style={s.headerInfo}>
              <View style={{ height: 20, width: 160, backgroundColor: Colors.border, borderRadius: 4 }} />
              <View style={{ height: 14, width: 80, backgroundColor: Colors.border, borderRadius: 4, marginTop: 8 }} />
            </View>
          </View>
          <View style={[s.eloBox, { alignItems: 'center' }]}>
            <View style={{ height: 12, width: 60, backgroundColor: Colors.border, borderRadius: 4 }} />
            <View style={{ height: 36, width: 80, backgroundColor: Colors.border, borderRadius: 4, marginTop: 8 }} />
          </View>
          <View style={s.statsRow}>
            {[1, 2, 3].map(i => (
              <View key={i} style={s.statBox}>
                <View style={{ height: 20, width: 40, backgroundColor: Colors.border, borderRadius: 4 }} />
                <View style={{ height: 12, width: 60, backgroundColor: Colors.border, borderRadius: 4, marginTop: 4 }} />
              </View>
            ))}
          </View>
          <View style={{ padding: Spacing.lg, gap: Spacing.md }}>
            {[1, 2, 3, 4].map(i => (
              <View key={i} style={{ height: 44, backgroundColor: Colors.border, borderRadius: 8 }} />
            ))}
          </View>
        </View>
      </StateSection>

      <StateSection title="NOT_FOUND" description="404 - user not found">
        <ProtoNav variant="public" />
        <View style={s.page}>
          <View style={s.notFoundState}>
            <Feather name="user-x" size={56} color={Colors.border} />
            <Text style={s.notFoundTitle}>Player Not Found</Text>
            <Text style={s.notFoundSubtitle}>This player profile does not exist or has been removed.</Text>
            <TouchableOpacity style={s.backBtn} activeOpacity={0.85}>
              <Feather name="arrow-left" size={16} color={Colors.primary} />
              <Text style={s.backBtnText}>Back to Rankings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: {
    backgroundColor: Colors.background,
    maxWidth: 430,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    padding: Spacing.lg,
  },
  headerInfo: {
    flex: 1,
  },
  playerName: {
    fontFamily: Typography.fontFamilyHeading,
    fontSize: Typography.sizes['2xl'],
    color: Colors.text,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  countryText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  eloBox: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    borderRadius: 12,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  eloLabel: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.xs,
    color: Colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  eloValue: {
    fontFamily: Typography.fontFamilyHeading,
    fontSize: 42,
    color: Colors.white,
    marginTop: Spacing.xs,
  },
  eloChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  eloChange: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundAlt,
    margin: Spacing.lg,
    borderRadius: 12,
    padding: Spacing.md,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.xl,
    color: Colors.primary,
  },
  statLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.lg,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  historyDate: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  historyResult: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    width: 70,
    textAlign: 'right',
  },
  historyElo: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.sm,
    width: 40,
    textAlign: 'right',
  },
  notFoundState: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
    paddingHorizontal: Spacing.lg,
  },
  notFoundTitle: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.xl,
    color: Colors.text,
    marginTop: Spacing.lg,
  },
  notFoundSubtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 10,
    borderRadius: 4,
  },
  backBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
  },
});
