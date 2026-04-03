import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeContainer, Header } from '../../components/layout';
import { LoadingSpinner } from '../../components/ui';
import { getCountryFlag } from '../../constants/countryFlags';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import api from '../../lib/api';

interface HistoryEntry {
  tournamentId: string;
  tournamentName: string;
  place: number;
  score: number;
  eloChange: number;
  date: string;
}

interface PublicProfile {
  id: string;
  name: string | null;
  surname: string | null;
  country: string | null;
  fideTitle: string | null;
  fideRating: number | null;
  rating: number;
  tournamentCount: number;
  history: HistoryEntry[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function PublicProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!id) return;
    try {
      setError(null);
      const res = await api.get(`/users/${id}/public`);
      setProfile(res.data);
    } catch {
      setError('Player not found');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <SafeContainer>
        <Header title="Player Profile" showBack />
        <LoadingSpinner />
      </SafeContainer>
    );
  }

  if (error || !profile) {
    return (
      <SafeContainer>
        <Header title="Player Profile" showBack />
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>{'♜'}</Text>
          <Text style={styles.errorText}>{error || 'Player not found'}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchProfile}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeContainer>
    );
  }

  const fullName = [profile.name, profile.surname].filter(Boolean).join(' ') || 'Unknown Player';
  const flag = getCountryFlag(profile.country);

  return (
    <SafeContainer>
      <Header title="Player Profile" showBack />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Hero card */}
        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{(profile.name || '?')[0].toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.heroRight}>
            <Text style={styles.playerName} numberOfLines={2}>{fullName}</Text>
            {profile.country ? (
              <Text style={styles.countryRow}>
                {flag} {profile.country}
              </Text>
            ) : null}
            {profile.fideTitle ? (
              <View style={styles.titleBadge}>
                <Text style={styles.titleBadgeText}>{profile.fideTitle}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.tournamentCount}</Text>
            <Text style={styles.statLabel}>Tournaments</Text>
          </View>
          {profile.fideRating ? (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{profile.fideRating}</Text>
                <Text style={styles.statLabel}>FIDE Rating</Text>
              </View>
            </>
          ) : null}
        </View>

        {/* ELO history table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tournament History</Text>
          {profile.history.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyHistoryIcon}>{'♙'}</Text>
              <Text style={styles.emptyHistoryText}>No tournament results yet</Text>
            </View>
          ) : (
            <View style={styles.historyTable}>
              {/* Table header */}
              <View style={styles.historyHeader}>
                <Text style={[styles.historyHeaderText, styles.colTournament]}>Tournament</Text>
                <Text style={[styles.historyHeaderText, styles.colPlace]}>#</Text>
                <Text style={[styles.historyHeaderText, styles.colScore]}>Score</Text>
                <Text style={[styles.historyHeaderText, styles.colElo]}>+/- ELO</Text>
              </View>
              {profile.history.map((entry, idx) => (
                <TouchableOpacity
                  key={entry.tournamentId}
                  style={[styles.historyRow, idx % 2 === 0 && styles.rowEven]}
                  activeOpacity={0.7}
                  onPress={() => router.push(`/tournaments/${entry.tournamentId}` as never)}
                >
                  <View style={styles.colTournament}>
                    <Text style={styles.historyTournamentName} numberOfLines={1}>
                      {entry.tournamentName}
                    </Text>
                    <Text style={styles.historyDate}>{formatDate(entry.date)}</Text>
                  </View>
                  <Text style={[styles.historyText, styles.colPlace]}>{entry.place}</Text>
                  <Text style={[styles.historyText, styles.colScore]}>{entry.score}</Text>
                  <Text style={[
                    styles.historyText,
                    styles.colElo,
                    entry.eloChange > 0 ? styles.eloPositive : undefined,
                    entry.eloChange < 0 ? styles.eloNegative : undefined,
                  ]}>
                    {entry.eloChange > 0 ? `+${entry.eloChange}` : `${entry.eloChange}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
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

  // Hero card
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
  },
  heroLeft: {
    marginRight: Spacing.lg,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  heroRight: {
    flex: 1,
  },
  playerName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  countryRow: {
    fontSize: Typography.sizes.sm,
    color: Colors.gold,
    marginBottom: Spacing.xs,
  },
  titleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.gold + '33',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.gold + '66',
    marginTop: 4,
  },
  titleBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.gold,
    letterSpacing: 0.5,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: Colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: Spacing.lg,
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.border,
  },

  // Section
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },

  // History table
  historyTable: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundAlt,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  historyHeaderText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowEven: {
    backgroundColor: Colors.backgroundAlt + '55',
  },
  historyText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  historyTournamentName: {
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    fontWeight: Typography.weights.medium,
  },
  historyDate: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },

  // Columns
  colTournament: {
    flex: 1,
    paddingRight: Spacing.xs,
  },
  colPlace: {
    width: 28,
    textAlign: 'center',
  },
  colScore: {
    width: 48,
    textAlign: 'center',
  },
  colElo: {
    width: 52,
    textAlign: 'right',
    fontWeight: Typography.weights.semibold,
  },

  eloPositive: {
    color: Colors.primary,
  },
  eloNegative: {
    color: Colors.error,
  },

  // Empty history
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyHistoryIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  emptyHistoryText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },

  // Error state
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: Spacing.lg,
  },
  errorText: {
    fontSize: Typography.sizes.base,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  retryBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  retryBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.white,
  },

  footer: {
    height: Spacing['2xl'],
  },
});
