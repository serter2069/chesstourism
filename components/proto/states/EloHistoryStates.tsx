import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

const HISTORY = [
  { date: 'Jun 2025', tournament: 'Tbilisi Open', before: 2156, change: +12, after: 2168 },
  { date: 'May 2025', tournament: 'Prague Masters', before: 2168, change: -7, after: 2161 },
  { date: 'Apr 2025', tournament: 'Oslo Rapid Cup', before: 2161, change: +18, after: 2179 },
  { date: 'Mar 2025', tournament: 'Warsaw Classical', before: 2179, change: -3, after: 2176 },
  { date: 'Feb 2025', tournament: 'Yerevan Blitz', before: 2176, change: +9, after: 2185 },
  { date: 'Jan 2025', tournament: 'Baku Open', before: 2185, change: +5, after: 2190 },
];

const LONG_HISTORY = [
  ...HISTORY,
  { date: 'Dec 2024', tournament: 'Berlin Winter', before: 2190, change: -4, after: 2186 },
  { date: 'Nov 2024', tournament: 'Budapest Open', before: 2186, change: +11, after: 2197 },
  { date: 'Oct 2024', tournament: 'Ankara Masters', before: 2197, change: -8, after: 2189 },
  { date: 'Sep 2024', tournament: 'Moscow Rapid', before: 2189, change: +6, after: 2195 },
  { date: 'Aug 2024', tournament: 'Vienna Classic', before: 2195, change: +3, after: 2198 },
  { date: 'Jul 2024', tournament: 'Athens Open', before: 2198, change: -2, after: 2196 },
];

function ProfileBanner({ name, elo, isMine }: { name: string; elo: number; isMine?: boolean }) {
  return (
    <View style={s.profileBanner}>
      <Image
        source={{ uri: `https://picsum.photos/seed/${name.toLowerCase().replace(/\s+/g, '-')}/200/200` }}
        style={{ width: 48, height: 48, borderRadius: 24 }}
        resizeMode="cover"
      />
      <View style={s.profileInfo}>
        <View style={s.nameRow}>
          <Text style={s.profileName}>{name}</Text>
          {isMine && (
            <View style={s.myBadge}>
              <Text style={s.myBadgeText}>YOU</Text>
            </View>
          )}
        </View>
        <Text style={s.profileElo}>Current ELO: {elo}</Text>
      </View>
    </View>
  );
}

function PeriodTabs({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  const periods = ['3M', '6M', '1Y', 'All'];
  return (
    <View style={s.periodRow}>
      {periods.map((p, i) => (
        <TouchableOpacity
          key={p}
          style={[s.periodBtn, i === active && s.periodBtnActive]}
          activeOpacity={0.7}
          onPress={() => onSelect(i)}
        >
          <Text style={[s.periodText, i === active && s.periodTextActive]}>{p}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function HistoryTable({ data }: { data: typeof HISTORY }) {
  return (
    <View style={s.tableWrap}>
      <View style={s.thead}>
        <Text style={[s.th, { width: 65 }]}>Date</Text>
        <Text style={[s.th, { flex: 1 }]}>Tournament</Text>
        <Text style={[s.th, { width: 45, textAlign: 'right' }]}>Before</Text>
        <Text style={[s.th, { width: 40, textAlign: 'right' }]}>+/-</Text>
        <Text style={[s.th, { width: 45, textAlign: 'right' }]}>After</Text>
      </View>
      {data.map((h, i) => (
        <View key={i} style={[s.row, i % 2 === 0 && s.rowAlt]}>
          <Text style={[s.cell, { width: 65 }]}>{h.date}</Text>
          <Text style={[s.cellBold, { flex: 1 }]} numberOfLines={1}>{h.tournament}</Text>
          <Text style={[s.cell, { width: 45, textAlign: 'right' }]}>{h.before}</Text>
          <Text style={[s.cellChange, {
            width: 40,
            textAlign: 'right',
            color: h.change > 0 ? Colors.eloPositive : h.change < 0 ? Colors.eloNegative : Colors.textMuted,
          }]}>
            {h.change > 0 ? `+${h.change}` : `${h.change}`}
          </Text>
          <Text style={[s.cellBold, { width: 45, textAlign: 'right' }]}>{h.after}</Text>
        </View>
      ))}
    </View>
  );
}

function Pagination({ current, total }: { current: number; total: number }) {
  return (
    <View style={s.pagination}>
      <TouchableOpacity style={[s.pageBtn, current === 1 && s.pageBtnDisabled]} activeOpacity={0.7}>
        <Feather name="chevron-left" size={16} color={current === 1 ? Colors.border : Colors.textMuted} />
      </TouchableOpacity>
      {Array.from({ length: total }, (_, i) => (
        <TouchableOpacity key={i} style={[s.pageBtn, i + 1 === current && s.pageBtnActive]} activeOpacity={0.7}>
          <Text style={[s.pageBtnText, i + 1 === current && s.pageBtnTextActive]}>{i + 1}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={[s.pageBtn, current === total && s.pageBtnDisabled]} activeOpacity={0.7}>
        <Feather name="chevron-right" size={16} color={current === total ? Colors.border : Colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

export default function EloHistoryStates() {
  const [period, setPeriod] = useState(0);
  const router = useRouter();

  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="My ELO history with chart placeholder and table">
        <ProtoNav variant="public" />
        <View style={s.page}>
          <Text style={s.pageTitle}>ELO Rating History</Text>
          <ProfileBanner name="Magnus Eriksson" elo={2156} isMine />
          <PeriodTabs active={period} onSelect={setPeriod} />
          <Image
            source={{ uri: 'https://picsum.photos/seed/chess-board/800/400' }}
            style={{ width: '100%' as any, height: 180, borderRadius: 8 }}
            resizeMode="cover"
          />
          <View style={s.chartSpacer} />
          <HistoryTable data={HISTORY} />
        </View>
      </StateSection>

      <StateSection title="ANOTHER_USER" description="Viewing another player's ELO history">
        <ProtoNav variant="public" />
        <View style={s.page}>
          <Text style={s.pageTitle}>ELO Rating History</Text>
          <ProfileBanner name="Fabiano Caruana" elo={2805} />
          <PeriodTabs active={2} onSelect={() => {}} />
          <Image
            source={{ uri: 'https://picsum.photos/seed/chess-players/800/400' }}
            style={{ width: '100%' as any, height: 180, borderRadius: 8 }}
            resizeMode="cover"
          />
          <View style={s.chartSpacer} />
          <HistoryTable data={HISTORY.map(h => ({ ...h, before: h.before + 650, after: h.after + 650 }))} />
        </View>
      </StateSection>

      <StateSection title="LOADING" description="Skeleton loading state">
        <ProtoNav variant="public" />
        <View style={s.page}>
          <Text style={s.pageTitle}>ELO Rating History</Text>
          <View style={s.profileBanner}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.border }} />
            <View style={s.profileInfo}>
              <View style={{ height: 16, width: 140, backgroundColor: Colors.border, borderRadius: 4 }} />
              <View style={{ height: 12, width: 100, backgroundColor: Colors.border, borderRadius: 4, marginTop: 6 }} />
            </View>
          </View>
          <View style={s.periodRow}>
            {[1, 2, 3, 4].map(i => (
              <View key={i} style={{ height: 32, width: 48, backgroundColor: Colors.border, borderRadius: 16 }} />
            ))}
          </View>
          <View style={{ height: 180, backgroundColor: Colors.border, borderRadius: 8 }} />
          <View style={s.chartSpacer} />
          <View style={s.tableWrap}>
            <View style={s.thead}>
              <View style={{ height: 10, width: '100%', backgroundColor: Colors.tableHeaderTextFaint, borderRadius: 4 }} />
            </View>
            {[1, 2, 3, 4, 5].map(i => (
              <View key={i} style={[s.row, { gap: Spacing.sm }]}>
                <View style={{ height: 12, width: 50, backgroundColor: Colors.border, borderRadius: 4 }} />
                <View style={{ height: 12, flex: 1, backgroundColor: Colors.border, borderRadius: 4 }} />
                <View style={{ height: 12, width: 35, backgroundColor: Colors.border, borderRadius: 4 }} />
                <View style={{ height: 12, width: 30, backgroundColor: Colors.border, borderRadius: 4 }} />
                <View style={{ height: 12, width: 35, backgroundColor: Colors.border, borderRadius: 4 }} />
              </View>
            ))}
          </View>
        </View>
      </StateSection>

      <StateSection title="NO_HISTORY" description="New player, no tournament history">
        <ProtoNav variant="public" />
        <View style={s.page}>
          <Text style={s.pageTitle}>ELO Rating History</Text>
          <ProfileBanner name="Niko Tsereteli" elo={1200} isMine />
          <PeriodTabs active={3} onSelect={() => {}} />
          <View style={s.emptyState}>
            <Feather name="bar-chart-2" size={48} color={Colors.border} />
            <Text style={s.emptyTitle}>No Tournament History</Text>
            <Text style={s.emptySubtitle}>Register for your first tournament to start tracking your ELO rating progress</Text>
            <TouchableOpacity style={s.browseBtn} activeOpacity={0.85} onPress={() => router.push('/proto/states/tournaments' as any)}>
              <Text style={s.browseBtnText}>Browse Tournaments</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StateSection>

      <StateSection title="LONG_HISTORY" description="Many rows with pagination">
        <ProtoNav variant="public" />
        <View style={s.page}>
          <Text style={s.pageTitle}>ELO Rating History</Text>
          <ProfileBanner name="Magnus Eriksson" elo={2156} isMine />
          <PeriodTabs active={3} onSelect={() => {}} />
          <Image
            source={{ uri: 'https://picsum.photos/seed/chess-tournament/800/400' }}
            style={{ width: '100%' as any, height: 180, borderRadius: 8 }}
            resizeMode="cover"
          />
          <View style={s.chartSpacer} />
          <HistoryTable data={LONG_HISTORY} />
          <Pagination current={1} total={4} />
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
    marginBottom: Spacing.lg,
  },
  profileBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.backgroundAlt,
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.lg,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  profileName: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.text,
  },
  myBadge: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  myBadgeText: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: 9,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  profileElo: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  periodRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  periodBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 16,
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  periodBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  periodText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  periodTextActive: {
    color: Colors.white,
  },
  chartSpacer: {
    height: Spacing.lg,
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
  },
  rowAlt: {
    backgroundColor: Colors.backgroundAlt,
  },
  cell: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  cellBold: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.xs,
    color: Colors.text,
  },
  cellChange: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  emptyTitle: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.lg,
    color: Colors.text,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xs,
    lineHeight: 22,
    maxWidth: '85%',
  },
  browseBtn: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 10,
    borderRadius: 4,
  },
  browseBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.lg,
  },
  pageBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pageBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pageBtnDisabled: {
    opacity: 0.4,
  },
  pageBtnText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  pageBtnTextActive: {
    color: Colors.white,
  },
});
