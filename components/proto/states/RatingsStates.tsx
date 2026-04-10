import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

const PLAYERS = [
  { rank: 1, name: 'Magnus Carlsen', country: 'Norway', elo: 2847, change: +2, games: 62 },
  { rank: 2, name: 'Fabiano Caruana', country: 'USA', elo: 2805, change: -1, games: 58 },
  { rank: 3, name: 'Hikaru Nakamura', country: 'USA', elo: 2794, change: +3, games: 71 },
  { rank: 4, name: 'Arjun Erigaisi', country: 'India', elo: 2778, change: 0, games: 44 },
  { rank: 5, name: 'Nodirbek Abdusattorov', country: 'Uzbekistan', elo: 2762, change: +5, games: 39 },
  { rank: 6, name: 'Wesley So', country: 'USA', elo: 2755, change: -2, games: 53 },
  { rank: 7, name: 'Levon Aronian', country: 'Armenia', elo: 2749, change: 0, games: 48 },
  { rank: 8, name: 'Viswanathan Anand', country: 'India', elo: 2740, change: +1, games: 87 },
  { rank: 9, name: 'Ian Nepomniachtchi', country: 'Russia', elo: 2736, change: -3, games: 41 },
  { rank: 10, name: 'Maxime Vachier-Lagrave', country: 'France', elo: 2728, change: 0, games: 55 },
];

const MEDAL_COLORS = [Colors.gold, Colors.silver, Colors.bronze];

function TabSelector({ tabs, active, onSelect }: { tabs: string[]; active: number; onSelect: (i: number) => void }) {
  return (
    <View style={s.tabRow}>
      {tabs.map((t, i) => (
        <TouchableOpacity
          key={t}
          style={[s.tabBtn, i === active && s.tabBtnActive]}
          activeOpacity={0.7}
          onPress={() => onSelect(i)}
        >
          <Text style={[s.tabBtnText, i === active && s.tabBtnTextActive]}>{t}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    const color = MEDAL_COLORS[rank - 1];
    return (
      <View style={[s.medalBadge, { borderColor: color, backgroundColor: color + '22' }]}>
        <Text style={[s.medalText, { color }]}>{rank}</Text>
      </View>
    );
  }
  return <Text style={s.rankNum}>{rank}</Text>;
}

function PlayerRow({ p, highlighted, onPress }: { p: typeof PLAYERS[0]; highlighted?: boolean; onPress?: () => void }) {
  const changeColor = p.change > 0 ? Colors.eloPositive : p.change < 0 ? Colors.eloNegative : Colors.textMuted;
  const changeText = p.change > 0 ? `+${p.change}` : p.change < 0 ? `${p.change}` : '0';
  return (
    <TouchableOpacity style={[s.row, highlighted && s.rowHighlighted]} activeOpacity={0.7} onPress={onPress}>
      <View style={s.rankCell}>
        <RankBadge rank={p.rank} />
      </View>
      <View style={s.playerCell}>
        <Text style={s.playerName}>{p.name}</Text>
        <Text style={s.playerCountry}>{p.country}</Text>
      </View>
      <Text style={s.eloCell}>{p.elo}</Text>
      <View style={s.changeCell}>
        {p.change !== 0 && (
          <Feather name={p.change > 0 ? 'trending-up' : 'trending-down'} size={12} color={changeColor} />
        )}
        <Text style={[s.changeText, { color: changeColor }]}>{changeText}</Text>
      </View>
      <Text style={s.gamesCell}>{p.games}</Text>
    </TouchableOpacity>
  );
}

function TableHeader() {
  return (
    <View style={s.thead}>
      <Text style={[s.th, { width: 40 }]}>#</Text>
      <Text style={[s.th, { flex: 1 }]}>Player</Text>
      <Text style={[s.th, { width: 55, textAlign: 'right' }]}>ELO</Text>
      <Text style={[s.th, { width: 50, textAlign: 'right' }]}>+/-</Text>
      <Text style={[s.th, { width: 35, textAlign: 'right' }]}>G</Text>
    </View>
  );
}

function RatingsTable({ players, highlightRank, onPlayerPress }: { players: typeof PLAYERS; highlightRank?: number; onPlayerPress?: (name: string) => void }) {
  return (
    <View style={s.tableWrap}>
      <TableHeader />
      {players.map((p, i) => (
        <PlayerRow key={p.rank} p={p} highlighted={p.rank === highlightRank} onPress={() => onPlayerPress?.(p.name)} />
      ))}
    </View>
  );
}

export default function RatingsStates() {
  const [tab, setTab] = useState(0);
  const router = useRouter();
  const navToUserProfile = () => router.push('/proto/states/user-profile' as any);
  const navToEloHistory = () => router.push('/proto/states/elo-history' as any);

  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Full rating table with top 10 players, All category">
        <ProtoNav variant="public" />
        <View style={s.page}>
          <Text style={s.pageTitle}>World Rankings</Text>
          <Text style={s.pageSubtitle}>Global ELO rating leaderboard</Text>
          <TabSelector tabs={['All', 'Classical', 'Rapid', 'Blitz']} active={0} onSelect={setTab} />
          <RatingsTable players={PLAYERS} onPlayerPress={navToUserProfile} />
        </View>
      </StateSection>

      <StateSection title="FILTERED_RAPID" description="Rapid category selected">
        <ProtoNav variant="public" />
        <View style={s.page}>
          <Text style={s.pageTitle}>World Rankings</Text>
          <TabSelector tabs={['All', 'Classical', 'Rapid', 'Blitz']} active={2} onSelect={() => {}} />
          <RatingsTable players={PLAYERS.map((p, i) => ({ ...p, elo: p.elo - 30 + i * 3, change: p.change + (i % 3 === 0 ? 2 : -1) }))} onPlayerPress={navToUserProfile} />
        </View>
      </StateSection>

      <StateSection title="LOADING" description="Skeleton table rows">
        <ProtoNav variant="public" />
        <View style={s.page}>
          <Text style={s.pageTitle}>World Rankings</Text>
          <View style={s.tabRow}>
            {['All', 'Classical', 'Rapid', 'Blitz'].map(t => (
              <View key={t} style={{ height: 32, width: 60, backgroundColor: Colors.border, borderRadius: 16 }} />
            ))}
          </View>
          <View style={s.tableWrap}>
            <TableHeader />
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
              <View key={i} style={[s.row, i % 2 === 0 && { backgroundColor: Colors.backgroundAlt }]}>
                <View style={{ width: 40, height: 14, backgroundColor: Colors.border, borderRadius: 4 }} />
                <View style={{ flex: 1, gap: 4 }}>
                  <View style={{ height: 14, width: '70%', backgroundColor: Colors.border, borderRadius: 4 }} />
                  <View style={{ height: 10, width: '40%', backgroundColor: Colors.border, borderRadius: 4 }} />
                </View>
                <View style={{ width: 55, height: 14, backgroundColor: Colors.border, borderRadius: 4 }} />
                <View style={{ width: 50, height: 14, backgroundColor: Colors.border, borderRadius: 4 }} />
                <View style={{ width: 35, height: 14, backgroundColor: Colors.border, borderRadius: 4 }} />
              </View>
            ))}
          </View>
        </View>
      </StateSection>

      <StateSection title="MY_POSITION" description="User's rank highlighted at #156">
        <ProtoNav variant="public" />
        <View style={s.page}>
          <Text style={s.pageTitle}>World Rankings</Text>
          <TabSelector tabs={['All', 'Classical', 'Rapid', 'Blitz']} active={0} onSelect={() => {}} />
          <RatingsTable players={PLAYERS.slice(0, 5)} onPlayerPress={navToUserProfile} />
          <View style={s.separator}>
            <View style={s.separatorLine} />
            <Text style={s.separatorText}>Your position</Text>
            <View style={s.separatorLine} />
          </View>
          <View style={s.tableWrap}>
            <PlayerRow p={{ rank: 155, name: 'Dimitri Volkov', country: 'Ukraine', elo: 2158, change: -1, games: 32 }} onPress={navToUserProfile} />
            <PlayerRow p={{ rank: 156, name: 'Magnus Eriksson', country: 'Sweden', elo: 2156, change: +12, games: 28 }} highlighted onPress={navToEloHistory} />
            <PlayerRow p={{ rank: 157, name: 'Carlos Mendez', country: 'Spain', elo: 2154, change: +3, games: 35 }} onPress={navToUserProfile} />
          </View>
        </View>
      </StateSection>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: {
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  pageTitle: {
    fontFamily: Typography.fontFamilyHeading,
    fontSize: Typography.sizes['2xl'],
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  pageSubtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
  },
  tabRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  tabBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 16,
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabBtnText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  tabBtnTextActive: {
    color: Colors.white,
  },
  tableWrap: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  thead: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  th: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: 10,
    color: Colors.tableHeaderText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowHighlighted: {
    backgroundColor: Colors.statusWarningBg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.gold,
  },
  rankCell: {
    width: 40,
    alignItems: 'center',
  },
  medalBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalText: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 11,
  },
  rankNum: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  playerCell: {
    flex: 1,
  },
  playerName: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  playerCountry: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  eloCell: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    width: 55,
    textAlign: 'right',
  },
  changeCell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 2,
    width: 50,
  },
  changeText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.xs,
  },
  gamesCell: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    width: 35,
    textAlign: 'right',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginVertical: Spacing.md,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  separatorText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.xs,
    color: Colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
