import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

const TOURNAMENTS = [
  { id: 1, title: 'Tbilisi Open 2025', city: 'Tbilisi', country: 'Georgia', dates: 'Jun 14-21', fee: 50, timeControl: 'Classical 90+30', status: 'OPEN' },
  { id: 2, title: 'Oslo Rapid Cup', city: 'Oslo', country: 'Norway', dates: 'Jul 3-5', fee: 80, timeControl: 'Rapid 15+10', status: 'OPEN' },
  { id: 3, title: 'Yerevan Blitz Championship', city: 'Yerevan', country: 'Armenia', dates: 'Jul 19-20', fee: 30, timeControl: 'Blitz 3+2', status: 'OPEN' },
  { id: 4, title: 'Warsaw Classical', city: 'Warsaw', country: 'Poland', dates: 'Aug 10-17', fee: 60, timeControl: 'Classical 120+30', status: 'OPEN' },
  { id: 5, title: 'Prague Masters', city: 'Prague', country: 'Czech Republic', dates: 'Sep 1-8', fee: 90, timeControl: 'Classical 90+30', status: 'OPEN' },
  { id: 6, title: 'Baku Open', city: 'Baku', country: 'Azerbaijan', dates: 'Oct 5-12', fee: 40, timeControl: 'Rapid 15+10', status: 'OPEN' },
];

function FilterBar({ searchValue, onSearchChange }: { searchValue: string; onSearchChange: (v: string) => void }) {
  return (
    <View style={s.filterBar}>
      <View style={s.searchWrap}>
        <Feather name="search" size={16} color={Colors.textMuted} />
        <TextInput
          style={s.searchInput}
          placeholder="Search tournaments..."
          placeholderTextColor={Colors.textMuted}
          value={searchValue}
          onChangeText={onSearchChange}
        />
      </View>
      <View style={s.filterRow}>
        <TouchableOpacity style={s.filterChip} activeOpacity={0.7}>
          <Text style={s.filterChipText}>Country</Text>
          <Feather name="chevron-down" size={14} color={Colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={s.filterChip} activeOpacity={0.7}>
          <Text style={s.filterChipText}>Time Control</Text>
          <Feather name="chevron-down" size={14} color={Colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={s.filterChip} activeOpacity={0.7}>
          <Text style={s.filterChipText}>Fee Range</Text>
          <Feather name="chevron-down" size={14} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function TournamentCard({ t }: { t: typeof TOURNAMENTS[0] }) {
  return (
    <TouchableOpacity style={s.card} activeOpacity={0.85}>
      <View style={s.cardImageWrap}>
        <Image
          source={{ uri: `https://picsum.photos/seed/${t.city.toLowerCase()}-chess/800/400` }}
          style={{ width: '100%' as any, height: 140, borderRadius: 0 }}
          resizeMode="cover"
        />
        <View style={s.statusBadge}>
          <Text style={s.statusText}>{t.status}</Text>
        </View>
      </View>
      <View style={s.cardBody}>
        <Text style={s.cardTitle} numberOfLines={2}>{t.title}</Text>
        <View style={s.cardRow}>
          <Feather name="map-pin" size={12} color={Colors.textMuted} />
          <Text style={s.cardMeta}>{t.city}, {t.country}</Text>
        </View>
        <View style={s.cardRow}>
          <Feather name="calendar" size={12} color={Colors.textMuted} />
          <Text style={s.cardMeta}>{t.dates}</Text>
        </View>
        <View style={s.cardFooter}>
          <View style={s.feePill}>
            <Text style={s.feeText}>{'\u20AC'}{t.fee}</Text>
          </View>
          <Text style={s.controlText}>{t.timeControl}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function SkeletonCard() {
  return (
    <View style={s.card}>
      <View style={{ height: 140, backgroundColor: Colors.border, borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />
      <View style={s.cardBody}>
        <View style={{ height: 16, backgroundColor: Colors.border, borderRadius: 4, marginBottom: 8 }} />
        <View style={{ height: 12, backgroundColor: Colors.border, borderRadius: 4, width: '60%', marginBottom: 6 }} />
        <View style={{ height: 12, backgroundColor: Colors.border, borderRadius: 4, width: '45%' }} />
      </View>
    </View>
  );
}

function TournamentsGrid({ tournaments }: { tournaments: typeof TOURNAMENTS }) {
  return (
    <View style={s.grid}>
      {tournaments.map((t) => (
        <View key={t.id} style={s.gridItem}>
          <TournamentCard t={t} />
        </View>
      ))}
    </View>
  );
}

export default function TournamentsStates() {
  const [search, setSearch] = useState('');

  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Tournament catalog with filter bar and 6 cards">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>

        <ProtoNav variant="public" />
        <View style={s.page}>
          <Text style={s.pageTitle}>Tournaments</Text>
          <Text style={s.pageSubtitle}>Discover FIDE-rated chess tournaments worldwide</Text>
          <FilterBar searchValue={search} onSearchChange={setSearch} />
          <TournamentsGrid tournaments={TOURNAMENTS} />
        </View>
              </View>
</StateSection>

      <StateSection title="FILTERED" description="2 results after applying Georgia filter">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>

        <ProtoNav variant="public" />
        <View style={s.page}>
          <Text style={s.pageTitle}>Tournaments</Text>
          <FilterBar searchValue="Georgia" onSearchChange={() => {}} />
          <View style={s.resultLabel}>
            <Text style={s.resultText}>2 results for "Georgia"</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={s.resetText}>Reset filters</Text>
            </TouchableOpacity>
          </View>
          <TournamentsGrid tournaments={TOURNAMENTS.filter(t => t.country === 'Georgia' || t.country === 'Azerbaijan').slice(0, 2)} />
        </View>
              </View>
</StateSection>

      <StateSection title="LOADING" description="Skeleton cards while loading">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>

        <ProtoNav variant="public" />
        <View style={s.page}>
          <Text style={s.pageTitle}>Tournaments</Text>
          <View style={s.filterBar}>
            <View style={{ height: 40, backgroundColor: Colors.border, borderRadius: 8 }} />
            <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm }}>
              <View style={{ height: 32, width: 90, backgroundColor: Colors.border, borderRadius: 16 }} />
              <View style={{ height: 32, width: 100, backgroundColor: Colors.border, borderRadius: 16 }} />
              <View style={{ height: 32, width: 80, backgroundColor: Colors.border, borderRadius: 16 }} />
            </View>
          </View>
          <View style={s.grid}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <View key={i} style={s.gridItem}><SkeletonCard /></View>
            ))}
          </View>
        </View>
              </View>
</StateSection>

      <StateSection title="EMPTY" description="No results after filter, empty state">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>

        <ProtoNav variant="public" />
        <View style={s.page}>
          <Text style={s.pageTitle}>Tournaments</Text>
          <FilterBar searchValue="Antarctica" onSearchChange={() => {}} />
          <View style={s.emptyState}>
            <Feather name="search" size={48} color={Colors.border} />
            <Text style={s.emptyTitle}>No tournaments found</Text>
            <Text style={s.emptySubtitle}>Try adjusting your filters or search terms</Text>
            <TouchableOpacity style={s.resetBtn} activeOpacity={0.8}>
              <Text style={s.resetBtnText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
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
  filterBar: {
    marginBottom: Spacing.lg,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 40,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  filterChipText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  gridItem: {
    width: '47%' as any,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardImageWrap: {
    position: 'relative',
  },
  statusBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
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
  cardBody: {
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  cardTitle: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    lineHeight: 20,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  cardMeta: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  feePill: {
    backgroundColor: Colors.statusWarningBg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 12,
  },
  feeText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.xs,
    color: Colors.statusWarningText,
  },
  controlText: {
    fontFamily: Typography.fontFamily,
    fontSize: 11,
    color: Colors.textMuted,
  },
  resultLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  resultText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  resetText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.xs,
    color: Colors.gold,
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
    marginTop: Spacing.xs,
  },
  resetBtn: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 10,
    borderRadius: 4,
  },
  resetBtnText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
  },
});
