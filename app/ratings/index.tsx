import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeContainer, Header } from '../../components/layout';
import { Button, LoadingSpinner } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useAuth } from '../../store/auth';
import api from '../../lib/api';

interface RatingEntry {
  rank: number;
  userId: string;
  name: string;
  surname: string;
  country?: string | null;
  elo: number;
  games_played: number;
  wins: number;
  losses: number;
  draws: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function RatingsScreen() {
  const { user } = useAuth();
  const [ratings, setRatings] = useState<RatingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchRatings = useCallback(async (pageNum: number, reset: boolean) => {
    try {
      if (reset) setLoading(true);
      else setLoadingMore(true);

      const params: Record<string, string | number> = { page: pageNum, limit: 50 };
      if (filter.trim()) params.country = filter.trim();

      const res = await api.get('/ratings', { params });
      const { data, pagination: pag } = res.data;

      if (reset) {
        setRatings(data);
      } else {
        setRatings((prev) => [...prev, ...data]);
      }
      setPagination(pag);
      setError(null);
    } catch {
      setError('Failed to load ratings');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filter]);

  useEffect(() => {
    setPage(1);
    fetchRatings(1, true);
  }, [fetchRatings]);

  const loadMore = useCallback(() => {
    if (!pagination || page >= pagination.totalPages || loadingMore) return;
    const next = page + 1;
    setPage(next);
    fetchRatings(next, false);
  }, [page, pagination, loadingMore, fetchRatings]);

  const hasMore = pagination ? page < pagination.totalPages : false;

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.colRank, styles.headerText]}>#</Text>
      <Text style={[styles.colName, styles.headerText]}>Name</Text>
      <Text style={[styles.colCountry, styles.headerText]}>Country</Text>
      <Text style={[styles.colElo, styles.headerText]}>ELO</Text>
      <Text style={[styles.colWld, styles.headerText]}>W/L/D</Text>
    </View>
  );

  const renderItem = useCallback(({ item }: { item: RatingEntry }) => {
    const isCurrentUser = user?.id === item.userId;

    return (
      <View style={[styles.tableRow, isCurrentUser && styles.highlightRow]}>
        <Text style={[styles.colRank, styles.cellText, isCurrentUser && styles.highlightText]}>
          {item.rank}
        </Text>
        <Text
          style={[styles.colName, styles.cellText, isCurrentUser && styles.highlightText]}
          numberOfLines={1}
        >
          {item.name} {item.surname}
        </Text>
        <Text
          style={[styles.colCountry, styles.cellTextSmall]}
          numberOfLines={1}
        >
          {item.country || '-'}
        </Text>
        <Text style={[styles.colElo, styles.cellElo, isCurrentUser && styles.highlightText]}>
          {item.elo}
        </Text>
        <Text style={[styles.colWld, styles.cellTextSmall]}>
          {item.wins}/{item.losses}/{item.draws}
        </Text>
      </View>
    );
  }, [user?.id]);

  return (
    <SafeContainer>
      <Header title="Ratings" showBack />
      <View style={styles.filterRow}>
        <TextInput
          style={styles.filterInput}
          placeholder="Filter by country..."
          placeholderTextColor={Colors.textMuted}
          value={filter}
          onChangeText={setFilter}
          returnKeyType="search"
          onSubmitEditing={() => {
            setPage(1);
            fetchRatings(1, true);
          }}
        />
      </View>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      ) : ratings.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>{'♜'}</Text>
          <Text style={styles.emptyText}>No ratings found</Text>
        </View>
      ) : (
        <FlatList
          data={ratings}
          renderItem={renderItem}
          keyExtractor={(item) => item.userId}
          ListHeaderComponent={renderHeader}
          stickyHeaderIndices={[0]}
          contentContainerStyle={styles.list}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footer}>
                <LoadingSpinner size="small" />
              </View>
            ) : hasMore ? (
              <View style={styles.footer}>
                <Button
                  title="Load more"
                  onPress={loadMore}
                  variant="secondary"
                />
              </View>
            ) : null
          }
        />
      )}

      {pagination && (
        <View style={styles.totalBar}>
          <Text style={styles.totalText}>
            Total: {pagination.total} player{pagination.total !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  filterInput: {
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
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  highlightRow: {
    backgroundColor: Colors.brandPrimary + '18',
    borderRadius: 6,
    borderBottomColor: 'transparent',
  },
  highlightText: {
    color: Colors.brandPrimary,
    fontWeight: Typography.weights.semibold,
  },
  colRank: {
    width: 32,
    textAlign: 'center',
  },
  colName: {
    flex: 1,
    paddingRight: Spacing.xs,
  },
  colCountry: {
    width: 64,
    textAlign: 'center',
  },
  colElo: {
    width: 48,
    textAlign: 'right',
  },
  colWld: {
    width: 56,
    textAlign: 'right',
  },
  cellText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
  },
  cellTextSmall: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  cellElo: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.textAccent,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  totalBar: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDefault,
    backgroundColor: Colors.bgSecondary,
  },
  totalText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
