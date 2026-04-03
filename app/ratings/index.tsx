import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  ListRenderItemInfo,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeContainer, Header } from '../../components/layout';
import { LoadingSpinner } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useAuth } from '../../store/auth';
import api from '../../lib/api';

// Country flag emoji mapping (reused from commissars)
const COUNTRY_FLAGS: Record<string, string> = {
  Russia: '\u{1F1F7}\u{1F1FA}',
  USA: '\u{1F1FA}\u{1F1F8}',
  China: '\u{1F1E8}\u{1F1F3}',
  India: '\u{1F1EE}\u{1F1F3}',
  Germany: '\u{1F1E9}\u{1F1EA}',
  France: '\u{1F1EB}\u{1F1F7}',
  Spain: '\u{1F1EA}\u{1F1F8}',
  Norway: '\u{1F1F3}\u{1F1F4}',
  Brazil: '\u{1F1E7}\u{1F1F7}',
  Japan: '\u{1F1EF}\u{1F1F5}',
  Egypt: '\u{1F1EA}\u{1F1EC}',
  Ireland: '\u{1F1EE}\u{1F1EA}',
  Italy: '\u{1F1EE}\u{1F1F9}',
  Sweden: '\u{1F1F8}\u{1F1EA}',
  UK: '\u{1F1EC}\u{1F1E7}',
  Netherlands: '\u{1F1F3}\u{1F1F1}',
  Poland: '\u{1F1F5}\u{1F1F1}',
  Hungary: '\u{1F1ED}\u{1F1FA}',
  Ukraine: '\u{1F1FA}\u{1F1E6}',
  Armenia: '\u{1F1E6}\u{1F1F2}',
  Azerbaijan: '\u{1F1E6}\u{1F1FF}',
  Turkey: '\u{1F1F9}\u{1F1F7}',
  Israel: '\u{1F1EE}\u{1F1F1}',
  Kazakhstan: '\u{1F1F0}\u{1F1FF}',
  Uzbekistan: '\u{1F1FA}\u{1F1FF}',
  Georgia: '\u{1F1EC}\u{1F1EA}',
};

function getFlag(country?: string | null): string {
  if (!country) return '\u{1F3F3}\u{FE0F}';
  return COUNTRY_FLAGS[country] || '\u{1F3F3}\u{FE0F}';
}

const ALL_COUNTRIES = 'All Countries';

interface RatingEntry {
  rank: number;
  userId: string;
  name: string;
  city: string | null;
  country: string | null;
  fideTitle: string | null;
  rating: number;
  tournamentCount: number;
}

interface CountryInfo {
  country: string;
  count: number;
}

interface MyRank {
  rank: number;
  total: number;
  rating: number;
  fideTitle: string | null;
  name: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Medal colors for top-3
const MEDAL_COLORS: Record<number, string> = {
  1: Colors.gold,   // gold
  2: '#9EA3A8',             // silver
  3: '#CD7F32',             // bronze
};

function TitleBadge({ title }: { title: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{title}</Text>
    </View>
  );
}

function MyRankCard({ myRank, onHistoryPress }: { myRank: MyRank; onHistoryPress: () => void }) {
  return (
    <View style={styles.myRankCard}>
      <View style={styles.myRankLeft}>
        <Text style={styles.myRankLabel}>MY RANK</Text>
        <Text style={styles.myRankName} numberOfLines={1}>{myRank.name}</Text>
        {myRank.fideTitle ? <TitleBadge title={myRank.fideTitle} /> : null}
        <TouchableOpacity style={styles.historyBtn} onPress={onHistoryPress} activeOpacity={0.75}>
          <Text style={styles.historyBtnText}>View History</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.myRankRight}>
        <Text style={styles.myRankPosition}>#{myRank.rank}</Text>
        <Text style={styles.myRankRating}>{myRank.rating}</Text>
        <Text style={styles.myRankTotal}>of {myRank.total}</Text>
      </View>
    </View>
  );
}

export default function RatingsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [ratings, setRatings] = useState<RatingEntry[]>([]);
  const [myRank, setMyRank] = useState<MyRank | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [countries, setCountries] = useState<CountryInfo[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>(ALL_COUNTRIES);
  const countriesLoaded = useRef(false);

  // Fetch countries list once on mount
  useEffect(() => {
    if (countriesLoaded.current) return;
    api.get('/ratings/countries')
      .then((res) => {
        setCountries(res.data.countries || []);
        countriesLoaded.current = true;
      })
      .catch(() => {});
  }, []);

  const fetchData = useCallback(async (country: string, pageNum: number = 1) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const params: Record<string, string | number> = { page: pageNum, limit: 50 };
      if (country !== ALL_COUNTRIES) params.country = country;

      const ratingsReq = api.get('/ratings', { params });
      const myRankReq = (pageNum === 1 && user) ? api.get('/ratings/my').catch(() => null) : Promise.resolve(null);

      const [ratingsRes, myRankRes] = await Promise.all([ratingsReq, myRankReq]);

      const newData: RatingEntry[] = ratingsRes.data.data;
      const pag: Pagination = ratingsRes.data.pagination;

      if (pageNum === 1) {
        setRatings(newData);
      } else {
        setRatings((prev) => [...prev, ...newData]);
      }
      setPagination(pag);
      setPage(pag.page);
      setHasMore(pag.page < pag.totalPages);

      if (myRankRes) {
        setMyRank(myRankRes.data);
      }
    } catch {
      setError('Failed to load ratings');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [user]);

  useEffect(() => {
    setPage(1);
    setHasMore(false);
    fetchData(selectedCountry, 1);
  }, [fetchData, selectedCountry]);

  const handleLoadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;
    fetchData(selectedCountry, page + 1);
  }, [hasMore, loadingMore, fetchData, selectedCountry, page]);

  const handleSelectCountry = useCallback((country: string) => {
    setSelectedCountry(country);
  }, []);

  // Client-side search filter
  const filteredRatings = useMemo(() => {
    if (!searchQuery.trim()) return ratings;
    const q = searchQuery.trim().toLowerCase();
    return ratings.filter((r) => r.name.toLowerCase().includes(q));
  }, [ratings, searchQuery]);

  // Chip list: "All Countries" + countries from API
  const chipList = useMemo(
    () => [ALL_COUNTRIES, ...countries.map((c) => c.country)],
    [countries]
  );

  const renderItem = useCallback(({ item }: ListRenderItemInfo<RatingEntry>) => {
    const isCurrentUser = user?.id === item.userId;
    const medalColor = MEDAL_COLORS[item.rank];
    const isTop3 = item.rank <= 3;

    return (
      <TouchableOpacity
        style={[
          styles.row,
          isTop3 && styles.top3Row,
          isCurrentUser && styles.currentUserRow,
        ]}
        activeOpacity={0.7}
        onPress={() => router.push(`/users/${item.userId}` as never)}
      >
        {/* Rank */}
        <View style={styles.colRank}>
          <Text
            style={[
              styles.rankText,
              isTop3 && { color: medalColor, fontWeight: Typography.weights.bold },
            ]}
          >
            {item.rank}
          </Text>
        </View>

        {/* Name + badge + city/country */}
        <View style={styles.colName}>
          <View style={styles.nameRow}>
            <Text
              style={[styles.nameText, isCurrentUser && styles.currentUserText]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            {item.fideTitle ? <TitleBadge title={item.fideTitle} /> : null}
          </View>
          {(item.city || item.country) ? (
            <Text style={styles.cityText} numberOfLines={1}>
              {[item.city, item.country].filter(Boolean).join(', ')}
            </Text>
          ) : null}
        </View>

        {/* Rating */}
        <View style={styles.colRating}>
          <Text
            style={[
              styles.ratingText,
              isTop3 && { color: medalColor },
              isCurrentUser && styles.currentUserText,
            ]}
          >
            {item.rating}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, [user?.id, router]);

  const ListHeader = useCallback(() => (
    <View style={styles.tableHeader}>
      <View style={styles.colRank}>
        <Text style={styles.headerText}>#</Text>
      </View>
      <View style={styles.colName}>
        <Text style={styles.headerText}>Player</Text>
      </View>
      <View style={styles.colRating}>
        <Text style={[styles.headerText, { textAlign: 'right' }]}>Rating</Text>
      </View>
    </View>
  ), []);

  return (
    <SafeContainer>
      <Header />

      {/* Country filter — horizontal scrollable chips */}
      <View style={styles.chipsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {chipList.map((country) => {
            const isActive = selectedCountry === country;
            return (
              <TouchableOpacity
                key={country}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => handleSelectCountry(country)}
                activeOpacity={0.7}
              >
                {country !== ALL_COUNTRIES && (
                  <Text style={styles.chipFlag}>{getFlag(country)}</Text>
                )}
                <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
                  {country}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.container}>
        {/* My Rank card */}
        {myRank ? (
          <MyRankCard
            myRank={myRank}
            onHistoryPress={() => router.push('/ratings/history')}
          />
        ) : null}

        {/* Search */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{'♜'}</Text>
            <Text style={styles.emptyText}>{error}</Text>
          </View>
        ) : filteredRatings.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{'♜'}</Text>
            <Text style={styles.emptyText}>
              {searchQuery.trim() ? 'No players found' : 'No ratings yet'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredRatings}
            renderItem={renderItem}
            keyExtractor={(item) => item.userId}
            ListHeaderComponent={ListHeader}
            stickyHeaderIndices={[0]}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              !searchQuery.trim() ? (
                <View style={styles.footer}>
                  {pagination ? (
                    <Text style={styles.footerText}>
                      Showing {filteredRatings.length} of {pagination.total} players
                      {selectedCountry !== ALL_COUNTRIES ? ` in ${selectedCountry}` : ''}
                    </Text>
                  ) : null}
                  {hasMore && !loadingMore ? (
                    <TouchableOpacity style={styles.loadMoreBtn} onPress={handleLoadMore} activeOpacity={0.75}>
                      <Text style={styles.loadMoreText}>Load More</Text>
                    </TouchableOpacity>
                  ) : null}
                  {loadingMore ? (
                    <ActivityIndicator size="small" color={Colors.primary} style={styles.loadMoreSpinner} />
                  ) : null}
                </View>
              ) : null
            }
          />
        )}
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  // Country filter chips
  chipsContainer: {
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  chipsScroll: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundAlt,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipFlag: {
    fontSize: Typography.sizes.sm,
    marginRight: 4,
  },
  chipLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
  chipLabelActive: {
    color: '#FFFFFF',
  },

  container: {
    flex: 1,
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
  },

  // My Rank card
  myRankCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    padding: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  myRankLeft: {
    flex: 1,
    marginRight: Spacing.md,
  },
  myRankLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.gold,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  myRankName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  historyBtn: {
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  historyBtnText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  myRankRight: {
    alignItems: 'flex-end',
  },
  myRankPosition: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.gold,
    lineHeight: 28,
  },
  myRankRating: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: '#FFFFFF',
  },
  myRankTotal: {
    fontSize: Typography.sizes.xs,
    color: Colors.gold,
    opacity: 0.8,
  },

  // Search
  searchRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  searchInput: {
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    color: Colors.text,
    fontSize: Typography.sizes.sm,
    minHeight: 40,
  },

  // Table
  list: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    borderRadius: 6,
    marginBottom: Spacing.xs,
  },
  headerText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  top3Row: {
    backgroundColor: Colors.background,
    borderBottomColor: 'transparent',
    borderRadius: 6,
    marginBottom: 2,
  },
  currentUserRow: {
    backgroundColor: Colors.primary + '14',
    borderRadius: 6,
    borderBottomColor: 'transparent',
  },

  // Columns
  colRank: {
    width: 36,
    alignItems: 'center',
  },
  colName: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  colRating: {
    width: 52,
    alignItems: 'flex-end',
  },

  rankText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  nameText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.text,
    flexShrink: 1,
  },
  currentUserText: {
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  cityText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  ratingText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.gold,
    textAlign: 'right',
  },

  // FIDE title badge
  badge: {
    backgroundColor: Colors.gold + '22',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 6,
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Colors.gold,
    letterSpacing: 0.5,
  },

  // Empty / footer
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['3xl'],
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  emptyText: {
    fontSize: Typography.sizes.base,
    color: Colors.textMuted,
  },
  footer: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.md,
  },
  footerText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  loadMoreBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing['2xl'],
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  loadMoreText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: '#FFFFFF',
  },
  loadMoreSpinner: {
    marginVertical: Spacing.sm,
  },
});
