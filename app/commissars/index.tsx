import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeContainer, Header } from '../../components/layout';
import { Avatar, Badge, Card, LoadingSpinner } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import api from '../../lib/api';

// Country flag emoji helper
const COUNTRY_FLAGS: Record<string, string> = {
  Russia: '\u{1F1F7}\u{1F1FA}',
  USA: '\u{1F1FA}\u{1F1F8}',
  China: '\u{1F1E8}\u{1F1F3}',
  India: '\u{1F1EE}\u{1F1F3}',
  Germany: '\u{1F1E9}\u{1F1EA}',
  France: '\u{1F1EB}\u{1F1F7}',
  Spain: '\u{1F1EA}\u{1F1F8}',
  Norway: '\u{1F1F3}\u{1F1F4}',
  Armenia: '\u{1F1E6}\u{1F1F2}',
  Azerbaijan: '\u{1F1E6}\u{1F1FF}',
  Turkey: '\u{1F1F9}\u{1F1F7}',
  Israel: '\u{1F1EE}\u{1F1F1}',
  UK: '\u{1F1EC}\u{1F1E7}',
  Netherlands: '\u{1F1F3}\u{1F1F1}',
  Poland: '\u{1F1F5}\u{1F1F1}',
  Hungary: '\u{1F1ED}\u{1F1FA}',
  Ukraine: '\u{1F1FA}\u{1F1E6}',
  Kazakhstan: '\u{1F1F0}\u{1F1FF}',
  Uzbekistan: '\u{1F1FA}\u{1F1FF}',
  Georgia: '\u{1F1EC}\u{1F1EA}',
};

function getFlag(country?: string | null): string {
  if (!country) return '\u{1F3F3}\u{FE0F}';
  return COUNTRY_FLAGS[country] || '\u{1F3F3}\u{FE0F}';
}

interface CommissarUser {
  id: string;
  name: string;
  surname: string;
  country?: string | null;
  city?: string | null;
  avatar_url?: string | null;
}

interface Commissar {
  id: string;
  user_id: string;
  experience_years: number;
  specializations: string[];
  rating: number;
  approved: boolean;
  user: CommissarUser;
}

interface GroupedSection {
  country: string;
  flag: string;
  commissars: Commissar[];
}

export default function CommissarsScreen() {
  const router = useRouter();
  const [commissars, setCommissars] = useState<Commissar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchCommissars = useCallback(async (pageNum: number, reset: boolean) => {
    try {
      if (reset) setLoading(true);
      else setLoadingMore(true);

      const params: Record<string, string | number> = { page: pageNum, limit: 20 };
      if (filter.trim()) params.country = filter.trim();

      const res = await api.get('/commissars', { params });
      const { data, pagination } = res.data;

      if (reset) {
        setCommissars(data);
      } else {
        setCommissars((prev) => [...prev, ...data]);
      }
      setHasMore(pageNum < pagination.totalPages);
      setError(null);
    } catch {
      setError('Failed to load commissars');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filter]);

  useEffect(() => {
    setPage(1);
    fetchCommissars(1, true);
  }, [fetchCommissars]);

  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore) return;
    const next = page + 1;
    setPage(next);
    fetchCommissars(next, false);
  }, [page, hasMore, loadingMore, fetchCommissars]);

  // Group by country
  const sections = useMemo<GroupedSection[]>(() => {
    const map = new Map<string, Commissar[]>();
    for (const c of commissars) {
      const country = c.user.country || 'Unknown';
      if (!map.has(country)) map.set(country, []);
      map.get(country)!.push(c);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([country, items]) => ({
        country,
        flag: getFlag(country),
        commissars: items,
      }));
  }, [commissars]);

  // Flatten for FlatList with section headers
  type ListItem =
    | { type: 'header'; country: string; flag: string; key: string }
    | { type: 'commissar'; data: Commissar; key: string };

  const flatData = useMemo<ListItem[]>(() => {
    const items: ListItem[] = [];
    for (const section of sections) {
      items.push({
        type: 'header',
        country: section.country,
        flag: section.flag,
        key: `header-${section.country}`,
      });
      for (const c of section.commissars) {
        items.push({ type: 'commissar', data: c, key: c.id });
      }
    }
    return items;
  }, [sections]);

  const renderItem = useCallback(({ item }: { item: ListItem }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionFlag}>{item.flag}</Text>
          <Text style={styles.sectionTitle}>{item.country}</Text>
        </View>
      );
    }

    const c = item.data;
    const fullName = `${c.user.name} ${c.user.surname}`;
    const location = [c.user.city, c.user.country].filter(Boolean).join(', ');

    return (
      <TouchableOpacity
        onPress={() => router.push(`/commissars/${c.user_id}`)}
        activeOpacity={0.7}
      >
        <Card style={styles.card}>
          <View style={styles.cardRow}>
            <Avatar uri={c.user.avatar_url} name={fullName} size={48} />
            <View style={styles.cardInfo}>
              <Text style={styles.name}>{fullName}</Text>
              {location ? (
                <Text style={styles.location}>{location}</Text>
              ) : null}
              <View style={styles.meta}>
                <Text style={styles.metaText}>
                  {c.experience_years} yr{c.experience_years !== 1 ? 's' : ''} exp
                </Text>
                <Text style={styles.ratingText}>Rating: {c.rating}</Text>
              </View>
            </View>
          </View>
          {c.specializations && c.specializations.length > 0 && (
            <View style={styles.badges}>
              {c.specializations.map((s) => (
                <Badge key={s} label={s} status="info" />
              ))}
            </View>
          )}
        </Card>
      </TouchableOpacity>
    );
  }, [router]);

  return (
    <SafeContainer>
      <Header title="Commissars" showBack />
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
            fetchCommissars(1, true);
          }}
        />
      </View>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      ) : commissars.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>{'♞'}</Text>
          <Text style={styles.emptyText}>No commissars found</Text>
        </View>
      ) : (
        <FlatList
          data={flatData}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.list}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footer}>
                <LoadingSpinner size="small" />
              </View>
            ) : null
          }
        />
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
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['3xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
  },
  sectionFlag: {
    fontSize: Typography.sizes.xl,
    marginRight: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
  },
  card: {
    marginBottom: Spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  name: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
  },
  location: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  meta: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  metaText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  ratingText: {
    fontSize: Typography.sizes.xs,
    color: Colors.brandPrimary,
    fontWeight: Typography.weights.medium,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.md,
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
  },
});
