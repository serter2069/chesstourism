import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeContainer, Header } from '../components/layout';
import { Button, Card, Badge, LoadingSpinner } from '../components/ui';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { Typography } from '../constants/typography';
import { usePlatform } from '../hooks/usePlatform';
import api from '../lib/api';

interface HeroData {
  title: string;
  subtitle: string;
}

interface Tournament {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  city: string;
  country: string;
  timeControl: string | null;
  status: string;
  fee: number | null;
  _count?: { registrations: number };
}

interface RatingEntry {
  id: string;
  rank: number;
  player: {
    id: string;
    name: string;
    surname: string;
    country?: string;
  };
  rating: number;
}

const STATUS_BADGE: Record<string, { label: string; status: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  DRAFT: { label: 'Draft', status: 'default' },
  PUBLISHED: { label: 'Coming Soon', status: 'default' },
  REGISTRATION_OPEN: { label: 'Registration Open', status: 'success' },
  REGISTRATION_CLOSED: { label: 'Registration Closed', status: 'warning' },
  IN_PROGRESS: { label: 'In Progress', status: 'info' },
  COMPLETED: { label: 'Completed', status: 'default' },
  CANCELLED: { label: 'Cancelled', status: 'error' },
};

const HOW_IT_WORKS = [
  { step: '1', title: 'Find a Tournament', desc: 'Browse upcoming chess tournaments worldwide' },
  { step: '2', title: 'Register', desc: 'Sign up and pay the entry fee online' },
  { step: '3', title: 'Travel & Play', desc: 'Arrive at the venue and compete' },
  { step: '4', title: 'Earn Rating', desc: 'Your results update your international rating' },
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function HomeScreen() {
  const router = useRouter();
  const { columns, isDesktop, isTablet } = usePlatform();
  const [hero, setHero] = useState<HeroData | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [ratings, setRatings] = useState<RatingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [heroRes, tourRes, ratingRes] = await Promise.allSettled([
        api.get('/settings/hero'),
        api.get('/tournaments', { params: { status: 'REGISTRATION_OPEN', limit: 4 } }),
        api.get('/ratings', { params: { limit: 10 } }),
      ]);

      if (heroRes.status === 'fulfilled') {
        setHero(heroRes.value.data);
      }
      if (tourRes.status === 'fulfilled') {
        const data = tourRes.value.data;
        setTournaments(Array.isArray(data) ? data : data.items || data.tournaments || []);
      }
      if (ratingRes.status === 'fulfilled') {
        const data = ratingRes.value.data;
        setRatings(Array.isArray(data) ? data : data.items || data.ratings || []);
      }
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <SafeContainer>
        <Header />
        <LoadingSpinner />
      </SafeContainer>
    );
  }

  return (
    <SafeContainer>
      <Header title="ChesTourism" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Hero Banner */}
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>{'♔'}</Text>
          <Text style={styles.heroTitle}>
            {hero?.title || 'International Chess Tourism'}
          </Text>
          <Text style={styles.heroSubtitle}>
            {hero?.subtitle || 'Discover chess tournaments and travel experiences around the world'}
          </Text>
          <Button
            title="Upcoming Tournaments"
            onPress={() => router.push('/tournaments')}
            style={styles.heroCta}
          />
        </View>

        {error && (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Button title="Retry" onPress={fetchData} variant="secondary" />
          </Card>
        )}

        {/* Upcoming Tournaments */}
        {tournaments.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Tournaments</Text>
              <TouchableOpacity onPress={() => router.push('/tournaments')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            {tournaments.map((t) => {
              const badge = STATUS_BADGE[t.status] || STATUS_BADGE.REGISTRATION_OPEN;
              return (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => router.push(`/tournaments/${t.id}`)}
                  activeOpacity={0.7}
                >
                  <Card style={styles.tournamentCard}>
                    <View style={styles.tournamentRow}>
                      <View style={styles.tournamentInfo}>
                        <Text style={styles.tournamentTitle} numberOfLines={1}>{t.title}</Text>
                        <Text style={styles.tournamentMeta}>
                          {formatDate(t.startDate)} - {formatDate(t.endDate)}
                        </Text>
                        <Text style={styles.tournamentMeta}>
                          {t.city}, {t.country}{t.timeControl ? ` | ${t.timeControl}` : ''}
                        </Text>
                      </View>
                      <Badge label={badge.label} status={badge.status} />
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Top Ratings */}
        {ratings.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Ratings</Text>
            <Card style={styles.ratingsCard}>
              <View style={styles.ratingsHeader}>
                <Text style={[styles.ratingsHeaderText, styles.rankCol]}>#</Text>
                <Text style={[styles.ratingsHeaderText, styles.nameCol]}>Player</Text>
                <Text style={[styles.ratingsHeaderText, styles.ratingCol]}>Rating</Text>
              </View>
              {ratings.map((entry, idx) => (
                <View
                  key={entry.id}
                  style={[styles.ratingsRow, idx % 2 === 0 && styles.ratingsRowEven]}
                >
                  <Text style={[styles.ratingsText, styles.rankCol]}>{entry.rank || idx + 1}</Text>
                  <View style={styles.nameCol}>
                    <Text style={styles.ratingsText} numberOfLines={1}>
                      {[entry.player.name, entry.player.surname].filter(Boolean).join(' ')}
                    </Text>
                    {entry.player.country && (
                      <Text style={styles.ratingsMeta}>{entry.player.country}</Text>
                    )}
                  </View>
                  <Text style={[styles.ratingsText, styles.ratingCol, styles.ratingValue]}>
                    {entry.rating}
                  </Text>
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* How it works — responsive grid on wider screens */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={[styles.stepsGrid, (isTablet || isDesktop) && styles.stepsGridWide]}>
            {HOW_IT_WORKS.map((item) => (
              <View
                key={item.step}
                style={[
                  styles.stepRow,
                  (isTablet || isDesktop) && { width: isDesktop ? '23%' : '48%' } as any,
                ]}
              >
                <View style={styles.stepBadge}>
                  <Text style={styles.stepNumber}>{item.step}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{item.title}</Text>
                  <Text style={styles.stepDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* CTA cards — side by side on tablet/desktop */}
        <View style={[
          styles.section,
          (isTablet || isDesktop) && styles.ctaRow,
        ]}>
          <View style={(isTablet || isDesktop) ? styles.ctaCardHalf : undefined}>
            <Card style={styles.ctaCard}>
              <Text style={styles.ctaTitle}>Become a Commissar</Text>
              <Text style={styles.ctaText}>
                Organize chess tournaments in your city and become part of the international chess tourism network.
              </Text>
              <Button
                title="Apply as Commissar"
                onPress={() => router.push('/(auth)/login')}
                variant="secondary"
              />
            </Card>
          </View>

          <View style={(isTablet || isDesktop) ? styles.ctaCardHalf : undefined}>
            <Card style={styles.ctaCard}>
              <Text style={styles.ctaTitle}>Host a Tournament</Text>
            <Text style={styles.ctaText}>
              Organizations can submit a tournament request. We will review it within 3 business days.
            </Text>
              <Button
                title="Submit Request"
                onPress={() => router.push('/organizations/apply')}
                variant="secondary"
              />
            </Card>
          </View>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing['4xl'],
  },
  // Hero
  hero: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing['3xl'],
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  heroIcon: {
    fontSize: 56,
    marginBottom: Spacing.lg,
    color: Colors.gold,
  },
  heroTitle: {
    fontSize: Typography.sizes['2xl'],
    fontFamily: Typography.fontFamilyHeading,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: Typography.sizes.base * Typography.lineHeights.normal,
    marginBottom: Spacing['2xl'],
  },
  heroCta: {
    minWidth: 220,
  },
  // Error
  errorCard: {
    margin: Spacing.lg,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.md,
  },
  // Sections
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing['2xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fontFamilyHeading,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  seeAll: {
    fontSize: Typography.sizes.sm,
    color: Colors.gold,
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing.md,
  },
  // Tournament cards
  tournamentCard: {
    marginBottom: Spacing.sm,
  },
  tournamentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tournamentInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  tournamentTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  tournamentMeta: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  // Ratings
  ratingsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  ratingsHeader: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  ratingsHeaderText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  ratingsRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  ratingsRowEven: {
    backgroundColor: Colors.backgroundAlt,
  },
  ratingsText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  ratingsMeta: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  rankCol: {
    width: 32,
  },
  nameCol: {
    flex: 1,
  },
  ratingCol: {
    width: 60,
    textAlign: 'right',
  },
  ratingValue: {
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
  // How it works
  stepsGrid: {},
  stepsGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    alignItems: 'flex-start',
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  stepNumber: {
    color: Colors.white,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  stepDesc: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    lineHeight: Typography.sizes.sm * Typography.lineHeights.normal,
  },
  // CTA
  ctaRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  ctaCard: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  ctaCardHalf: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.fontFamilyHeading,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  ctaText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: Typography.sizes.sm * Typography.lineHeights.normal,
    marginBottom: Spacing.xl,
  },
  footer: {
    height: Spacing['2xl'],
  },
});
