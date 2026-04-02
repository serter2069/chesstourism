// TODO: replace with react-native-maps when native build is set up
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeContainer, Header } from '../../components/layout';
import { Avatar, Badge, Card, LoadingSpinner } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import api from '../../lib/api';

// Country flag emoji mapping
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

const ALL_COUNTRIES = 'All Countries';

interface CommissarUser {
  id: string;
  name: string;
}

interface Commissar {
  id: string;
  userId: string;
  specialization: string | null;
  country: string | null;
  city: string | null;
  photoUrl: string | null;
  isVerified: boolean;
  user: CommissarUser;
  tournamentsCount: number;
}

interface GroupedSection {
  country: string;
  flag: string;
  commissars: Commissar[];
}

export default function CommissarsScreen() {
  const router = useRouter();
  const [commissars, setCommissars] = useState<Commissar[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>(ALL_COUNTRIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Track whether countries list has been loaded (only needed on first fetch)
  const countriesLoaded = useRef(false);

  const fetchCommissars = useCallback(async (country: string) => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (country !== ALL_COUNTRIES) params.country = country;

      const res = await api.get('/commissars', { params });
      const { data, countries: countryList } = res.data;

      setCommissars(data);
      // Only update countries list on first load (no filter active) to keep chips stable
      if (!countriesLoaded.current && countryList) {
        setCountries(countryList);
        countriesLoaded.current = true;
      }
      setError(null);
    } catch {
      setError('Failed to load commissars');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommissars(selectedCountry);
  }, [selectedCountry, fetchCommissars]);

  const handleSelectCountry = useCallback((country: string) => {
    setSelectedCountry(country);
  }, []);

  // Group commissars by country for the section list view
  const sections = useMemo<GroupedSection[]>(() => {
    const map = new Map<string, Commissar[]>();
    for (const c of commissars) {
      const country = c.country || 'Unknown';
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

  // Flatten sections into a single list for FlatList (headers + commissar rows)
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
    const fullName = c.user.name || 'Unknown';
    const location = [c.city, c.country].filter(Boolean).join(', ');

    return (
      <TouchableOpacity
        onPress={() => router.push(`/commissars/${c.userId}`)}
        activeOpacity={0.7}
      >
        <Card style={styles.card}>
          <View style={styles.cardRow}>
            <Avatar uri={c.photoUrl} name={fullName} size={48} />
            <View style={styles.cardInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{fullName}</Text>
                {c.isVerified && (
                  <Badge label="Verified" status="success" />
                )}
              </View>
              {location ? (
                <Text style={styles.location}>{location}</Text>
              ) : null}
              {c.specialization ? (
                <Text style={styles.specialization}>{c.specialization}</Text>
              ) : null}
              <Text style={styles.metaText}>
                {c.tournamentsCount} tournament{c.tournamentsCount !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }, [router]);

  // Chip list: "All Countries" + all known countries from backend
  const chipList = useMemo(
    () => [ALL_COUNTRIES, ...countries],
    [countries]
  );

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
          maxToRenderPerBatch={20}
        />
      )}
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
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
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['3xl'],
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
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
    color: Colors.text,
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  location: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  specialization: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  metaText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
    marginTop: Spacing.xs,
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
    color: Colors.textMuted,
  },
});
