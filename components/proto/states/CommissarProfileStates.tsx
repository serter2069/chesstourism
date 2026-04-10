import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

const UPCOMING_TOURNAMENTS = [
  { id: 1, title: 'Tbilisi Open 2025', dates: 'Jun 14-21, 2025', status: 'OPEN' },
  { id: 2, title: 'Batumi Rapid 2025', dates: 'Aug 5-7, 2025', status: 'OPEN' },
  { id: 3, title: 'Caucasus Masters', dates: 'Oct 10-17, 2025', status: 'OPEN' },
];

function ProfileHeader() {
  return (
    <View style={s.profileHeader}>
      <Image
        source={{ uri: 'https://picsum.photos/seed/commissar-giorgi/200/200' }}
        style={{ width: 96, height: 96, borderRadius: 48 }}
        resizeMode="cover"
      />
      <Text style={s.profileName}>Giorgi Beridze</Text>
      <View style={s.countryRow}>
        <Feather name="map-pin" size={14} color={Colors.textMuted} />
        <Text style={s.countryText}>Georgia</Text>
      </View>
      <View style={s.starRow}>
        {[1, 2, 3, 4, 5].map(i => (
          <Feather key={i} name="star" size={16} color={i <= 4 ? Colors.gold : Colors.border} />
        ))}
        <Text style={s.ratingNum}>4.9</Text>
      </View>
    </View>
  );
}

function StatsRow() {
  return (
    <View style={s.statsRow}>
      <View style={s.statBox}>
        <Text style={s.statValue}>23</Text>
        <Text style={s.statLabel}>Tournaments</Text>
      </View>
      <View style={s.statDivider} />
      <View style={s.statBox}>
        <Text style={s.statValue}>4.9</Text>
        <Text style={s.statLabel}>Avg Rating</Text>
      </View>
      <View style={s.statDivider} />
      <View style={s.statBox}>
        <Text style={s.statValue}>7</Text>
        <Text style={s.statLabel}>Years Active</Text>
      </View>
    </View>
  );
}

export default function CommissarProfileStates() {
  const router = useRouter();
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Commissar public profile with bio, stats, tournaments">
        <ProtoNav variant="public" />
        <View style={s.page}>
          <ProfileHeader />
          <StatsRow />

          <View style={s.section}>
            <Text style={s.sectionTitle}>About</Text>
            <Text style={s.bioText}>
              Certified FIDE commissar since 2018. Specializes in classical format tournaments in the Caucasus region. Has organized events in Tbilisi, Batumi, and Kutaisi, attracting players from over 30 countries. Known for meticulous organization and fair play enforcement.
            </Text>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Upcoming Tournaments</Text>
            {UPCOMING_TOURNAMENTS.map(t => (
              <TouchableOpacity key={t.id} style={s.tournamentRow} activeOpacity={0.8} onPress={() => router.push('/proto/states/tournament-detail' as any)}>
                <View style={s.tournamentInfo}>
                  <Text style={s.tournamentName}>{t.title}</Text>
                  <View style={s.tournamentMeta}>
                    <Feather name="calendar" size={12} color={Colors.textMuted} />
                    <Text style={s.tournamentDate}>{t.dates}</Text>
                  </View>
                </View>
                <View style={s.statusBadge}>
                  <Text style={s.statusText}>{t.status}</Text>
                </View>
                <Feather name="chevron-right" size={16} color={Colors.border} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={s.contactBtn} activeOpacity={0.85}>
            <Feather name="mail" size={16} color={Colors.primary} />
            <Text style={s.contactBtnText}>Contact Commissar</Text>
          </TouchableOpacity>
        </View>
      </StateSection>

      <StateSection title="LOADING" description="Skeleton loading state">
        <ProtoNav variant="public" />
        <View style={s.page}>
          <View style={s.profileHeader}>
            <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.border }} />
            <View style={{ height: 24, width: 160, backgroundColor: Colors.border, borderRadius: 4, marginTop: Spacing.md }} />
            <View style={{ height: 14, width: 80, backgroundColor: Colors.border, borderRadius: 4, marginTop: Spacing.sm }} />
            <View style={{ height: 14, width: 100, backgroundColor: Colors.border, borderRadius: 4, marginTop: Spacing.sm }} />
          </View>
          <View style={s.statsRow}>
            {[1, 2, 3].map(i => (
              <View key={i} style={s.statBox}>
                <View style={{ height: 24, width: 40, backgroundColor: Colors.border, borderRadius: 4 }} />
                <View style={{ height: 12, width: 60, backgroundColor: Colors.border, borderRadius: 4, marginTop: 4 }} />
              </View>
            ))}
          </View>
          <View style={{ padding: Spacing.lg, gap: Spacing.sm }}>
            <View style={{ height: 14, backgroundColor: Colors.border, borderRadius: 4 }} />
            <View style={{ height: 14, backgroundColor: Colors.border, borderRadius: 4 }} />
            <View style={{ height: 14, width: '70%', backgroundColor: Colors.border, borderRadius: 4 }} />
          </View>
        </View>
      </StateSection>

      <StateSection title="NOT_FOUND" description="404 - commissar not found">
        <ProtoNav variant="public" />
        <View style={s.page}>
          <View style={s.notFoundState}>
            <Feather name="user-x" size={56} color={Colors.border} />
            <Text style={s.notFoundTitle}>Commissar Not Found</Text>
            <Text style={s.notFoundSubtitle}>The commissar profile you're looking for doesn't exist or has been removed.</Text>
            <TouchableOpacity style={s.backBtn} activeOpacity={0.85} onPress={() => router.push('/proto/states/commissars' as any)}>
              <Feather name="arrow-left" size={16} color={Colors.primary} />
              <Text style={s.backBtnText}>Back to Commissars</Text>
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
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  profileName: {
    fontFamily: Typography.fontFamilyHeading,
    fontSize: Typography.sizes['2xl'],
    color: Colors.text,
    marginTop: Spacing.md,
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
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
  },
  ratingNum: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    marginLeft: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundAlt,
    marginHorizontal: Spacing.lg,
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
    paddingTop: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.lg,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  bioText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    lineHeight: 22,
  },
  tournamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tournamentInfo: {
    flex: 1,
  },
  tournamentName: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  tournamentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 4,
  },
  tournamentDate: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  statusBadge: {
    backgroundColor: Colors.statusSuccessBg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 10,
    color: Colors.eloPositive,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.gold,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.xl,
    paddingVertical: 14,
    borderRadius: 4,
  },
  contactBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.primary,
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
    lineHeight: 22,
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
