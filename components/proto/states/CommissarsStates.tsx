import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import ProtoPlaceholderImage from '../ProtoPlaceholderImage';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

const COMMISSARS = [
  { id: 1, name: 'Giorgi Beridze', country: 'Georgia', rating: 4.9, tournaments: 23 },
  { id: 2, name: 'Erik Halvorsen', country: 'Norway', rating: 4.8, tournaments: 31 },
  { id: 3, name: 'Armen Petrosyan', country: 'Armenia', rating: 4.7, tournaments: 18 },
  { id: 4, name: 'Piotr Kowalski', country: 'Poland', rating: 4.9, tournaments: 27 },
  { id: 5, name: 'Ivan Novak', country: 'Czech Republic', rating: 4.6, tournaments: 15 },
  { id: 6, name: 'Rustam Nazarov', country: 'Uzbekistan', rating: 4.8, tournaments: 22 },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={s.starRow}>
      {[1, 2, 3, 4, 5].map(i => (
        <Feather key={i} name="star" size={12} color={i <= Math.floor(rating) ? Colors.gold : Colors.border} />
      ))}
      <Text style={s.ratingText}>{rating}</Text>
    </View>
  );
}

function CommissarCard({ c, highlighted }: { c: typeof COMMISSARS[0]; highlighted?: boolean }) {
  return (
    <TouchableOpacity style={[s.card, highlighted && s.cardHighlighted]} activeOpacity={0.85}>
      <View style={s.cardTop}>
        <ProtoPlaceholderImage type="avatar" size={56} borderRadius={28} label={c.name} />
        <View style={s.cardInfo}>
          <Text style={s.cardName}>{c.name}</Text>
          <View style={s.cardCountryRow}>
            <Feather name="map-pin" size={12} color={Colors.textMuted} />
            <Text style={s.cardCountry}>{c.country}</Text>
          </View>
          <StarRating rating={c.rating} />
        </View>
      </View>
      <View style={s.cardStats}>
        <View style={s.statItem}>
          <Feather name="award" size={14} color={Colors.gold} />
          <Text style={s.statValue}>{c.tournaments}</Text>
          <Text style={s.statLabel}>tournaments</Text>
        </View>
      </View>
      <TouchableOpacity style={s.viewProfileBtn} activeOpacity={0.7}>
        <Text style={s.viewProfileText}>View Profile</Text>
        <Feather name="chevron-right" size={14} color={Colors.gold} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <View style={s.searchSection}>
      <View style={s.searchWrap}>
        <Feather name="search" size={16} color={Colors.textMuted} />
        <TextInput
          style={s.searchInput}
          placeholder="Search commissars..."
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChange}
        />
      </View>
      <TouchableOpacity style={s.filterChip} activeOpacity={0.7}>
        <Text style={s.filterChipText}>Country</Text>
        <Feather name="chevron-down" size={14} color={Colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

function SkeletonCard() {
  return (
    <View style={s.card}>
      <View style={s.cardTop}>
        <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.border }} />
        <View style={s.cardInfo}>
          <View style={{ height: 16, width: 120, backgroundColor: Colors.border, borderRadius: 4, marginBottom: 6 }} />
          <View style={{ height: 12, width: 80, backgroundColor: Colors.border, borderRadius: 4, marginBottom: 6 }} />
          <View style={{ height: 12, width: 100, backgroundColor: Colors.border, borderRadius: 4 }} />
        </View>
      </View>
      <View style={{ height: 14, width: '50%', backgroundColor: Colors.border, borderRadius: 4, marginTop: Spacing.md }} />
      <View style={{ height: 14, width: '30%', backgroundColor: Colors.border, borderRadius: 4, marginTop: Spacing.sm }} />
    </View>
  );
}

export default function CommissarsStates() {
  const [search, setSearch] = useState('');

  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Commissar catalog with search and filter">
        <ProtoNav variant="public" />
        <View style={s.page}>
          <Text style={s.pageTitle}>Commissars</Text>
          <Text style={s.pageSubtitle}>Certified FIDE commissars managing tournaments worldwide</Text>
          <SearchBar value={search} onChange={setSearch} />
          <View style={s.grid}>
            {COMMISSARS.map(c => (
              <View key={c.id} style={s.gridItem}>
                <CommissarCard c={c} />
              </View>
            ))}
          </View>
        </View>
      </StateSection>

      <StateSection title="FILTERED" description="2 results after filtering by country">
        <ProtoNav variant="public" />
        <View style={s.page}>
          <Text style={s.pageTitle}>Commissars</Text>
          <SearchBar value="" onChange={() => {}} />
          <View style={s.activeFilter}>
            <Text style={s.activeFilterLabel}>Country: Georgia</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Feather name="x" size={14} color={Colors.gold} />
            </TouchableOpacity>
          </View>
          <View style={s.resultLabel}>
            <Text style={s.resultText}>2 commissars found</Text>
          </View>
          <View style={s.grid}>
            {COMMISSARS.filter(c => c.country === 'Georgia' || c.country === 'Armenia').map(c => (
              <View key={c.id} style={s.gridItem}>
                <CommissarCard c={c} />
              </View>
            ))}
          </View>
        </View>
      </StateSection>

      <StateSection title="LOADING" description="Skeleton loading cards">
        <ProtoNav variant="public" />
        <View style={s.page}>
          <Text style={s.pageTitle}>Commissars</Text>
          <View style={{ height: 40, backgroundColor: Colors.border, borderRadius: 8, marginBottom: Spacing.lg }} />
          <View style={s.grid}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <View key={i} style={s.gridItem}><SkeletonCard /></View>
            ))}
          </View>
        </View>
      </StateSection>

      <StateSection title="EMPTY" description="No commissars found">
        <ProtoNav variant="public" />
        <View style={s.page}>
          <Text style={s.pageTitle}>Commissars</Text>
          <SearchBar value="Antarctica" onChange={() => {}} />
          <View style={s.emptyState}>
            <Feather name="users" size={48} color={Colors.border} />
            <Text style={s.emptyTitle}>No commissars found</Text>
            <Text style={s.emptySubtitle}>Try a different search or filter</Text>
          </View>
        </View>
      </StateSection>

      <StateSection title="COMMISSAR_DETAIL_HOVER" description="One card highlighted/selected">
        <ProtoNav variant="public" />
        <View style={s.page}>
          <Text style={s.pageTitle}>Commissars</Text>
          <SearchBar value="" onChange={() => {}} />
          <View style={s.grid}>
            {COMMISSARS.slice(0, 3).map((c, i) => (
              <View key={c.id} style={s.gridItem}>
                <CommissarCard c={c} highlighted={i === 0} />
              </View>
            ))}
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
    maxWidth: 430,
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
  searchSection: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  searchWrap: {
    flex: 1,
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
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 40,
  },
  filterChipText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  grid: {
    gap: Spacing.md,
  },
  gridItem: {},
  card: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHighlighted: {
    borderColor: Colors.gold,
    borderWidth: 2,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTop: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cardName: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.text,
    marginBottom: 2,
  },
  cardCountryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 4,
  },
  cardCountry: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.xs,
    color: Colors.text,
    marginLeft: Spacing.xs,
  },
  cardStats: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statValue: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  statLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  viewProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: Spacing.sm,
  },
  viewProfileText: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.xs,
    color: Colors.gold,
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.statusWarningBg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  activeFilterLabel: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.xs,
    color: Colors.statusWarningText,
  },
  resultLabel: {
    marginBottom: Spacing.md,
  },
  resultText: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
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
});
