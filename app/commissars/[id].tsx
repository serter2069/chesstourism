import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeContainer, Header } from '../../components/layout';
import { Avatar, Badge, Card, LoadingSpinner } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import api from '../../lib/api';

interface CommissionerUser {
  id: string;
  name: string;
}

interface TournamentSummary {
  id: string;
  title: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  status: string;
  participantsCount: number;
  maxParticipants: number | null;
  timeControl: string | null;
}

interface CommissionerProfile {
  id: string;
  userId: string;
  bio: string | null;
  specialization: string | null;
  country: string | null;
  city: string | null;
  photoUrl: string | null;
  isVerified: boolean;
  user: CommissionerUser;
  stats: {
    totalTournaments: number;
    totalParticipants: number;
  };
  tournaments: TournamentSummary[];
}

type TournamentBadgeStatus = 'success' | 'warning' | 'error' | 'info';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    DRAFT: 'Draft',
    OPEN: 'Open',
    ONGOING: 'Ongoing',
    FINISHED: 'Finished',
    CANCELLED: 'Cancelled',
  };
  return map[status] ?? status;
}

function statusBadge(status: string): TournamentBadgeStatus {
  const map: Record<string, TournamentBadgeStatus> = {
    OPEN: 'success',
    ONGOING: 'warning',
    CANCELLED: 'error',
  };
  return map[status] ?? 'info';
}

export default function CommissionerPublicProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [profile, setProfile] = useState<CommissionerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get(`/commissars/${id}`);
      setProfile(res.data);
      setError(null);
    } catch {
      setError('Failed to load commissioner profile');
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
        <Header />
        <LoadingSpinner />
      </SafeContainer>
    );
  }

  if (error || !profile) {
    return (
      <SafeContainer>
        <Header />
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error ?? 'Commissioner not found'}</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeContainer>
    );
  }

  const location = [profile.city, profile.country].filter(Boolean).join(', ');

  return (
    <SafeContainer>
      <Header />
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Back navigation */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backRow}>
          <Text style={styles.backArrow}>{'←'}</Text>
          <Text style={styles.backText}>Commissioners</Text>
        </TouchableOpacity>

        {/* Profile header card */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarRow}>
            <Avatar uri={profile.photoUrl} name={profile.user.name} size={80} />
            <View style={styles.headerInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{profile.user.name}</Text>
                {profile.isVerified && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedIcon}>{'★'}</Text>
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </View>
              {profile.specialization ? (
                <Text style={styles.specialization}>{profile.specialization}</Text>
              ) : null}
              {location ? (
                <Text style={styles.location}>{location}</Text>
              ) : null}
            </View>
          </View>

          {/* Bio */}
          <View style={styles.bioSection}>
            <Text style={styles.bioText}>
              {profile.bio ?? 'No biography provided yet.'}
            </Text>
          </View>
        </Card>

        {/* Stats bar */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{profile.stats.totalTournaments}</Text>
            <Text style={styles.statLabel}>Tournaments</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{profile.stats.totalParticipants}</Text>
            <Text style={styles.statLabel}>Participants</Text>
          </View>
        </View>

        {/* Tournaments section */}
        <Text style={styles.sectionTitle}>Tournaments by this commissioner</Text>

        {profile.tournaments.length === 0 ? (
          <View style={styles.emptyTournaments}>
            <Text style={styles.emptyIcon}>{'♟'}</Text>
            <Text style={styles.emptyText}>No tournaments yet</Text>
          </View>
        ) : (
          profile.tournaments.map((t) => (
            <TouchableOpacity
              key={t.id}
              activeOpacity={0.7}
              onPress={() => router.push(`/tournaments/${t.id}`)}
            >
              <Card style={styles.tournamentCard}>
                <View style={styles.tournamentHeader}>
                  <Text style={styles.tournamentTitle} numberOfLines={2}>
                    {t.title}
                  </Text>
                  <Badge label={statusLabel(t.status)} status={statusBadge(t.status)} />
                </View>
                <Text style={styles.tournamentLocation}>
                  {[t.city, t.country].filter(Boolean).join(', ')}
                </Text>
                <View style={styles.tournamentMeta}>
                  <Text style={styles.metaText}>
                    {formatDate(t.startDate)} – {formatDate(t.endDate)}
                  </Text>
                  <Text style={styles.metaText}>
                    {t.participantsCount}
                    {t.maxParticipants != null ? `/${t.maxParticipants}` : ''} players
                  </Text>
                </View>
                {t.timeControl ? (
                  <Text style={styles.timeControl}>{t.timeControl}</Text>
                ) : null}
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['3xl'],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  errorText: {
    fontSize: Typography.sizes.base,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  backBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  backBtnText: {
    color: Colors.white,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
  },
  backArrow: {
    fontSize: Typography.sizes.lg,
    color: Colors.gold,
    marginRight: Spacing.sm,
  },
  backText: {
    fontSize: Typography.sizes.sm,
    color: Colors.gold,
    fontWeight: Typography.weights.medium,
  },
  profileCard: {
    marginBottom: Spacing.lg,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  headerInfo: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  name: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gold,
    borderRadius: 12,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    gap: 3,
  },
  verifiedIcon: {
    fontSize: 10,
    color: Colors.white,
  },
  verifiedText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.white,
  },
  specialization: {
    fontSize: Typography.sizes.sm,
    color: Colors.gold,
    fontWeight: Typography.weights.medium,
    marginBottom: Spacing.xs,
  },
  location: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  bioSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  bioText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    lineHeight: Typography.sizes.sm * Typography.lineHeights.relaxed,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  statBox: {
    flex: 1,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: Spacing.md,
  },
  statNumber: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.gold,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  emptyTournaments: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.sizes.base,
    color: Colors.textMuted,
  },
  tournamentCard: {
    marginBottom: Spacing.md,
  },
  tournamentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  tournamentTitle: {
    flex: 1,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  tournamentLocation: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  tournamentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  metaText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  timeControl: {
    fontSize: Typography.sizes.xs,
    color: Colors.gold,
    marginTop: Spacing.xs,
    fontWeight: Typography.weights.medium,
  },
});
