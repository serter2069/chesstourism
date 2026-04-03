import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
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

interface HistoryEntry {
  tournamentId: string;
  tournamentName: string;
  place: number | null;
  score: number | null;
  eloChange: number | null;
  date: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '—';
  }
}

function EloChangeBadge({ change }: { change: number | null }) {
  if (change === null || change === 0) {
    return <Text style={styles.eloNeutral}>—</Text>;
  }
  const isPositive = change > 0;
  return (
    <Text style={isPositive ? styles.eloPositive : styles.eloNegative}>
      {isPositive ? '+' : ''}{change}
    </Text>
  );
}

export default function RatingHistoryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchHistory = useCallback(async (pageNum: number, append: boolean) => {
    if (!user?.id) return;
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);

      const res = await api.get(`/ratings/${user.id}/history`, {
        params: { page: pageNum, limit: 20 },
      });

      const entries: HistoryEntry[] = res.data.data;
      const pag: Pagination = res.data.pagination;

      setHistory((prev) => (append ? [...prev, ...entries] : entries));
      setPagination(pag);
    } catch {
      setError('Failed to load rating history');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchHistory(1, false);
  }, [fetchHistory]);

  const handleLoadMore = useCallback(() => {
    if (!pagination) return;
    if (page >= pagination.totalPages) return;
    if (loadingMore) return;
    const next = page + 1;
    setPage(next);
    fetchHistory(next, true);
  }, [pagination, page, loadingMore, fetchHistory]);

  const renderItem = useCallback(({ item, index }: ListRenderItemInfo<HistoryEntry>) => {
    const isEven = index % 2 === 0;
    return (
      <View style={[styles.row, isEven && styles.rowAlt]}>
        {/* Date */}
        <View style={styles.colDate}>
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        </View>

        {/* Tournament name */}
        <View style={styles.colName}>
          <Text style={styles.nameText} numberOfLines={2}>{item.tournamentName}</Text>
          {item.place !== null && (
            <Text style={styles.placeText}>Place: {item.place}</Text>
          )}
        </View>

        {/* Score */}
        <View style={styles.colScore}>
          <Text style={styles.scoreText}>
            {item.score !== null ? item.score : '—'}
          </Text>
        </View>

        {/* ELO change */}
        <View style={styles.colElo}>
          <EloChangeBadge change={item.eloChange} />
        </View>
      </View>
    );
  }, []);

  const ListHeader = useCallback(() => (
    <View style={styles.tableHeader}>
      <View style={styles.colDate}>
        <Text style={styles.headerText}>Date</Text>
      </View>
      <View style={styles.colName}>
        <Text style={styles.headerText}>Tournament</Text>
      </View>
      <View style={styles.colScore}>
        <Text style={[styles.headerText, { textAlign: 'right' }]}>Score</Text>
      </View>
      <View style={styles.colElo}>
        <Text style={[styles.headerText, { textAlign: 'right' }]}>ELO</Text>
      </View>
    </View>
  ), []);

  // Not authenticated
  if (!user) {
    return (
      <SafeContainer>
        <Header />
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>{'♜'}</Text>
          <Text style={styles.emptyText}>Sign in to view your rating history</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Back to Ratings</Text>
          </TouchableOpacity>
        </View>
      </SafeContainer>
    );
  }

  return (
    <SafeContainer>
      <Header />

      {/* Page title + back */}
      <View style={styles.titleRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backArrow} activeOpacity={0.7}>
          <Text style={styles.backArrowText}>{'←'}</Text>
        </TouchableOpacity>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Rating History</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{user.name ?? user.email}</Text>
        </View>
        {pagination ? (
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeText}>{pagination.total}</Text>
            <Text style={styles.totalBadgeLabel}>events</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.container}>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.emptyIcon}>{'♜'}</Text>
            <Text style={styles.emptyText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => fetchHistory(1, false)}>
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : history.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyIcon}>{'♔'}</Text>
            <Text style={styles.emptyText}>No tournament results yet</Text>
            <Text style={styles.emptyHint}>
              Complete a tournament to see your ELO history
            </Text>
          </View>
        ) : (
          <FlatList
            data={history}
            renderItem={renderItem}
            keyExtractor={(item) => item.tournamentId}
            ListHeaderComponent={ListHeader}
            stickyHeaderIndices={[0]}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              loadingMore ? (
                <View style={styles.loadMoreSpinner}>
                  <LoadingSpinner />
                </View>
              ) : pagination && page >= pagination.totalPages && history.length > 0 ? (
                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    All {pagination.total} event{pagination.total !== 1 ? 's' : ''} shown
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backArrow: {
    marginRight: Spacing.md,
    padding: Spacing.xs,
  },
  backArrowText: {
    fontSize: Typography.sizes.xl,
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  totalBadge: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 8,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    minWidth: 44,
  },
  totalBadgeText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  totalBadgeLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },

  container: {
    flex: 1,
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
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
  rowAlt: {
    backgroundColor: Colors.backgroundAlt + '80',
  },

  // Columns
  colDate: {
    width: 72,
  },
  colName: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  colScore: {
    width: 36,
    alignItems: 'flex-end',
  },
  colElo: {
    width: 44,
    alignItems: 'flex-end',
  },

  dateText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  nameText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.text,
  },
  placeText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  scoreText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    textAlign: 'right',
  },
  eloPositive: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: '#1A7A3A',
    textAlign: 'right',
  },
  eloNegative: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.error,
    textAlign: 'right',
  },
  eloNeutral: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'right',
  },

  // Empty / loading states
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['3xl'],
    paddingHorizontal: Spacing.lg,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  emptyText: {
    fontSize: Typography.sizes.base,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
    opacity: 0.7,
  },
  retryBtn: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.semibold,
    fontSize: Typography.sizes.sm,
  },
  backBtn: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backBtnText: {
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
    fontSize: Typography.sizes.sm,
  },

  loadMoreSpinner: {
    paddingVertical: Spacing.lg,
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
