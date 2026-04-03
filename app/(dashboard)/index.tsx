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
import { SafeContainer, Header } from '../../components/layout';
import { Card, Badge, Button, LoadingSpinner } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useAuth } from '../../store/auth';
import api from '../../lib/api';

interface TournamentRegistration {
  id: string;
  tournamentId: string;
  status: string;
  paid: boolean;
  place: number | null;
  eloChange: number | null;
  eloBefore: number | null;
  eloAfter: number | null;
  tournament: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    city: string;
    country: string;
    status: string;
  };
}

interface RatingData {
  elo: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [rating, setRating] = useState<RatingData | null>(null);
  const [upcoming, setUpcoming] = useState<TournamentRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      setError(null);
      const [ratingRes, tournamentsRes] = await Promise.all([
        api.get(`/ratings/${user.id}`).catch(() => null),
        api.get('/users/me/tournaments').catch(() => null),
      ]);

      if (ratingRes?.data) {
        setRating(ratingRes.data);
      }

      if (tournamentsRes?.data) {
        const items: TournamentRegistration[] = Array.isArray(tournamentsRes.data)
          ? tournamentsRes.data
          : tournamentsRes.data.items || [];
        const now = new Date();
        const upcomingItems = items
          .filter((r) => new Date(r.tournament.startDate) >= now)
          .sort((a, b) => new Date(a.tournament.startDate).getTime() - new Date(b.tournament.startDate).getTime())
          .slice(0, 3);
        setUpcoming(upcomingItems);
      }
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

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
        <Header title="Dashboard" />
        <LoadingSpinner />
      </SafeContainer>
    );
  }

  return (
    <SafeContainer>
      <Header title="Dashboard" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Welcome */}
        <View style={styles.section}>
          <Text style={styles.welcome}>
            {'\u265A'} {user?.name ? `Hi, ${user.name}!` : 'Welcome!'}
          </Text>
        </View>

        {/* Membership status */}
        <View style={styles.section}>
          <Card>
            <Text style={styles.cardLabel}>Membership Status</Text>
            <Badge
              label={user?.email ? 'Email Verified' : 'Email Not Verified'}
              status={user?.email ? 'success' : 'warning'}
            />
            <View style={styles.memberRow}>
              <Text style={styles.memberText}>Role: {user?.role || 'participant'}</Text>
            </View>
          </Card>
        </View>

        {/* FIDE Badge */}
        {user?.fideId && user?.fideRating && (
          <View style={styles.section}>
            <Card>
              <Text style={styles.cardLabel}>FIDE Profile</Text>
              <View style={styles.fideRow}>
                <View style={styles.fideBadge}>
                  {user.fideTitle && (
                    <Text style={styles.fideTitleText}>{user.fideTitle}</Text>
                  )}
                  <Text style={styles.fideRatingText}>{user.fideRating}</Text>
                </View>
                <Text style={styles.fideIdText}>ID: {user.fideId}</Text>
              </View>
            </Card>
          </View>
        )}

        {/* Rating */}
        <View style={styles.section}>
          <Card>
            <Text style={styles.cardLabel}>Rating</Text>
            <Text style={styles.ratingValue}>{rating?.elo ?? 1200}</Text>
            <Text style={styles.ratingUnit}>ELO</Text>
            {rating && (
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{rating.gamesPlayed}</Text>
                  <Text style={styles.statLabel}>Games</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: Colors.primary }]}>{rating.wins}</Text>
                  <Text style={styles.statLabel}>Wins</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: Colors.error }]}>{rating.losses}</Text>
                  <Text style={styles.statLabel}>Losses</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{rating.draws}</Text>
                  <Text style={styles.statLabel}>Draws</Text>
                </View>
              </View>
            )}
          </Card>
        </View>

        {/* Upcoming tournaments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Tournaments</Text>
          {upcoming.length === 0 ? (
            <Card>
              <Text style={styles.emptyText}>No upcoming tournaments. Browse the catalog to register!</Text>
            </Card>
          ) : (
            upcoming.map((reg) => (
              <TouchableOpacity
                key={reg.id}
                onPress={() => router.push(`/tournaments/${reg.tournament.id}`)}
                activeOpacity={0.7}
                style={styles.tournamentCard}
              >
                <Card>
                  <Text style={styles.tournamentTitle}>{reg.tournament.title}</Text>
                  <Text style={styles.tournamentMeta}>
                    {formatDate(reg.tournament.startDate)} - {formatDate(reg.tournament.endDate)}
                  </Text>
                  <Text style={styles.tournamentMeta}>
                    {reg.tournament.city}, {reg.tournament.country}
                  </Text>
                  <Badge
                    label={reg.paid ? 'Paid' : 'Payment Pending'}
                    status={reg.paid ? 'success' : 'warning'}
                    style={styles.badge}
                  />
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Quick links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <View style={styles.linksRow}>
            <Button
              title="My Tournaments"
              onPress={() => router.push('/(dashboard)/tournaments/my-tournaments')}
              variant="secondary"
              style={styles.linkBtn}
            />
          </View>
          <View style={[styles.linksRow, { marginTop: Spacing.sm }]}>
            <Button
              title="FIDE Profile"
              onPress={() => router.push('/(dashboard)/profile' as any)}
              variant="secondary"
              style={styles.linkBtn}
            />
            <Button
              title="Watchlist"
              onPress={() => router.push('/(dashboard)/watchlist' as any)}
              variant="secondary"
              style={styles.linkBtn}
            />
          </View>
        </View>

        {/* Error */}
        {error && (
          <View style={styles.section}>
            <Card>
              <Text style={styles.errorText}>{error}</Text>
              <Button title="Retry" onPress={fetchData} variant="secondary" />
            </Card>
          </View>
        )}

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
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  welcome: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  cardLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  memberRow: {
    marginTop: Spacing.sm,
  },
  memberText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textTransform: 'capitalize',
  },
  ratingValue: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  ratingUnit: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  tournamentCard: {
    marginBottom: Spacing.sm,
  },
  tournamentTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  tournamentMeta: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  badge: {
    marginTop: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  linksRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  linkBtn: {
    flex: 1,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.md,
  },
  fideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  fideBadge: {
    backgroundColor: Colors.gold,
    borderRadius: 8,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    minWidth: 64,
  },
  fideTitleText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
    letterSpacing: 1,
  },
  fideRatingText: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
  },
  fideIdText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  footer: {
    height: Spacing['2xl'],
  },
});
