import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  ListRenderItemInfo,
} from 'react-native';
import { SafeContainer, Header } from '../../components/layout';
import { LoadingSpinner } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useAuth } from '../../store/auth';
import api from '../../lib/api';

interface RatingEntry {
  rank: number;
  userId: string;
  name: string;
  city: string | null;
  fideTitle: string | null;
  rating: number;
  tournamentCount: number;
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
  1: Colors.brandAccent,   // gold
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

function MyRankCard({ myRank }: { myRank: MyRank }) {
  return (
    <View style={styles.myRankCard}>
      <View style={styles.myRankLeft}>
        <Text style={styles.myRankLabel}>MY RANK</Text>
        <Text style={styles.myRankName} numberOfLines={1}>{myRank.name}</Text>
        {myRank.fideTitle ? <TitleBadge title={myRank.fideTitle} /> : null}
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
  const { user } = useAuth();
  const [ratings, setRatings] = useState<RatingEntry[]>([]);
  const [myRank, setMyRank] = useState<MyRank | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const ratingsReq = api.get('/ratings', { params: { page: 1, limit: 50 } });
      const myRankReq = user ? api.get('/ratings/my').catch(() => null) : Promise.resolve(null);

      const [ratingsRes, myRankRes] = await Promise.all([ratingsReq, myRankReq]);

      setRatings(ratingsRes.data.data);
      setPagination(ratingsRes.data.pagination);

      if (myRankRes) {
        setMyRank(myRankRes.data);
      }
    } catch {
      setError('Failed to load ratings');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Client-side search filter
  const filteredRatings = useMemo(() => {
    if (!searchQuery.trim()) return ratings;
    const q = searchQuery.trim().toLowerCase();
    return ratings.filter((r) => r.name.toLowerCase().includes(q));
  }, [ratings, searchQuery]);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<RatingEntry>) => {
    const isCurrentUser = user?.id === item.userId;
    const medalColor = MEDAL_COLORS[item.rank];
    const isTop3 = item.rank <= 3;

    return (
      <View
        style={[
          styles.row,
          isTop3 && styles.top3Row,
          isCurrentUser && styles.currentUserRow,
        ]}
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

        {/* Name + badge + city */}
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
          {item.city ? (
            <Text style={styles.cityText} numberOfLines={1}>{item.city}</Text>
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
      </View>
    );
  }, [user?.id]);

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

      <View style={styles.container}>
        {/* My Rank card */}
        {myRank ? <MyRankCard myRank={myRank} /> : null}

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
              pagination && !searchQuery.trim() ? (
                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    Showing {filteredRatings.length} of {pagination.total} players
                  </Text>
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
    backgroundColor: Colors.brandPrimary,
    borderRadius: 12,
  },
  myRankLeft: {
    flex: 1,
    marginRight: Spacing.md,
  },
  myRankLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.brandAccent,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  myRankName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.textOnPrimary,
    marginBottom: 4,
  },
  myRankRight: {
    alignItems: 'flex-end',
  },
  myRankPosition: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.brandAccent,
    lineHeight: 28,
  },
  myRankRating: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textOnPrimary,
  },
  myRankTotal: {
    fontSize: Typography.sizes.xs,
    color: Colors.brandAccent,
    opacity: 0.8,
  },

  // Search
  searchRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  searchInput: {
    backgroundColor: Colors.bgSurface,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: 8,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    color: Colors.textPrimary,
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
    backgroundColor: Colors.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
    borderRadius: 6,
    marginBottom: Spacing.xs,
  },
  headerText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  top3Row: {
    backgroundColor: Colors.bgCard,
    borderBottomColor: 'transparent',
    borderRadius: 6,
    marginBottom: 2,
  },
  currentUserRow: {
    backgroundColor: Colors.brandPrimary + '14',
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
    color: Colors.textSecondary,
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
    color: Colors.textPrimary,
    flexShrink: 1,
  },
  currentUserText: {
    color: Colors.brandPrimary,
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
    color: Colors.textAccent,
    textAlign: 'right',
  },

  // FIDE title badge
  badge: {
    backgroundColor: Colors.brandAccent + '22',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 6,
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: Colors.brandAccent,
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
    color: Colors.textSecondary,
  },
  footer: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
});
