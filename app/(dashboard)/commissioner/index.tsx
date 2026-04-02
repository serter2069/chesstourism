import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeContainer, Header } from '../../../components/layout';
import { Button, Card, Badge, LoadingSpinner } from '../../../components/ui';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import { useAuth } from '../../../store/auth';
import api from '../../../lib/api';

interface CommissionerProfile {
  id: string;
  userId: string;
  bio: string | null;
  specialization: string | null;
  country: string | null;
  city: string | null;
  photoUrl: string | null;
  isVerified: boolean;
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    rating: number;
  };
}

interface Tournament {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  city: string;
  country: string;
  status: string;
  _count?: { registrations: number };
}

const STATUS_BADGE: Record<string, { label: string; status: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  DRAFT: { label: 'Draft', status: 'default' },
  REGISTRATION_OPEN: { label: 'Open', status: 'success' },
  REGISTRATION_CLOSED: { label: 'Closed', status: 'warning' },
  IN_PROGRESS: { label: 'In Progress', status: 'info' },
  COMPLETED: { label: 'Completed', status: 'default' },
  CANCELLED: { label: 'Cancelled', status: 'error' },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function CommissionerCabinetScreen() {
  const router = useRouter();
  const { user, loadUser } = useAuth();

  const [profile, setProfile] = useState<CommissionerProfile | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registerLoading, setRegisterLoading] = useState(false);

  const isCommissioner = user?.role === 'COMMISSIONER';

  const fetchData = useCallback(async () => {
    if (!isCommissioner) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const [profileRes, tournamentsRes] = await Promise.all([
        api.get('/commissars/profile'),
        api.get('/commissars/tournaments'),
      ]);
      setProfile(profileRes.data);
      setTournaments(tournamentsRes.data.tournaments || []);
    } catch (err: any) {
      // 404 means commissioner record doesn't exist yet
      if (err?.response?.status === 404) {
        setProfile(null);
      } else {
        setError('Failed to load commissioner data');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isCommissioner]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  async function handleRegister() {
    setRegisterLoading(true);
    setError(null);
    try {
      await api.post('/commissars/register');
      await loadUser();
      await fetchData();
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to register as commissioner';
      setError(msg);
    } finally {
      setRegisterLoading(false);
    }
  }

  // Not a commissioner — show CTA
  if (!isCommissioner && !loading) {
    return (
      <SafeContainer>
        <Header title="Commissioner" showBack />
        <View style={styles.ctaContainer}>
          <Text style={styles.ctaTitle}>Become a Commissioner</Text>
          <Text style={styles.ctaDescription}>
            Organize chess tournaments, manage registrations, and build your reputation
            as a tournament commissioner.
          </Text>
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          <Button
            title="Register as Commissioner"
            onPress={handleRegister}
            loading={registerLoading}
          />
        </View>
      </SafeContainer>
    );
  }

  // Stats
  const totalTournaments = tournaments.length;
  const totalParticipants = tournaments.reduce(
    (sum, t) => sum + (t._count?.registrations || 0),
    0,
  );

  return (
    <SafeContainer>
      <Header title="Commissioner Cabinet" showBack />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {loading && <LoadingSpinner />}

        {error && !loading && (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Button title="Retry" onPress={fetchData} variant="secondary" />
          </Card>
        )}

        {!loading && profile && (
          <>
            {/* Profile card */}
            <View style={styles.profileSection}>
              <Card>
                <View style={styles.profileRow}>
                  {profile.photoUrl ? (
                    <Image source={{ uri: profile.photoUrl }} style={styles.avatar} />
                  ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                      <Text style={styles.avatarInitial}>
                        {(profile.user.name || profile.user.email)[0].toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>
                      {profile.user.name || profile.user.email}
                    </Text>
                    {profile.specialization && (
                      <Text style={styles.profileSpecialization}>{profile.specialization}</Text>
                    )}
                    <View style={styles.badgeRow}>
                      {profile.isVerified && <Badge label="Verified" status="success" />}
                      <Badge label="Commissioner" status="info" />
                    </View>
                  </View>
                </View>

                {profile.bio && (
                  <Text style={styles.bioText}>{profile.bio}</Text>
                )}

                {(profile.city || profile.country) && (
                  <Text style={styles.locationText}>
                    {[profile.city, profile.country].filter(Boolean).join(', ')}
                  </Text>
                )}

                <View style={styles.editButtonWrap}>
                  <Button
                    title="Edit Profile"
                    onPress={() => router.push('/(dashboard)/commissioner/edit' as never)}
                    variant="secondary"
                  />
                </View>
              </Card>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <Card style={styles.statCard}>
                <Text style={styles.statValue}>{totalTournaments}</Text>
                <Text style={styles.statLabel}>Tournaments</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text style={styles.statValue}>{totalParticipants}</Text>
                <Text style={styles.statLabel}>Participants</Text>
              </Card>
            </View>

            {/* My Tournaments */}
            <View style={styles.tournamentsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>My Tournaments</Text>
                <Button
                  title="Create"
                  onPress={() => router.push('/(dashboard)/tournaments/create' as never)}
                  variant="secondary"
                />
              </View>

              {tournaments.length === 0 && (
                <View style={styles.empty}>
                  <Text style={styles.emptyTitle}>No Tournaments Yet</Text>
                  <Text style={styles.emptyText}>
                    Create your first tournament to get started.
                  </Text>
                </View>
              )}

              {tournaments.map((t) => {
                const badge = STATUS_BADGE[t.status] || { label: t.status, status: 'default' as const };
                return (
                  <TouchableOpacity
                    key={t.id}
                    onPress={() => router.push(`/(dashboard)/tournaments/${t.id}/edit` as never)}
                    activeOpacity={0.7}
                    style={styles.tournamentCard}
                  >
                    <Card>
                      <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle} numberOfLines={2}>
                          {t.title}
                        </Text>
                        <Badge label={badge.label} status={badge.status} />
                      </View>
                      <Text style={styles.cardMeta}>
                        {formatDate(t.startDate)} - {formatDate(t.endDate)}
                      </Text>
                      <Text style={styles.cardMeta}>
                        {t.city}, {t.country}
                      </Text>
                      {t._count?.registrations != null && (
                        <Text style={styles.cardParticipants}>
                          {t._count.registrations} participant{t._count.registrations !== 1 ? 's' : ''}
                        </Text>
                      )}
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        <View style={styles.bottomPad} />
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
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
  },
  // CTA (non-commissioner)
  ctaContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
  },
  ctaTitle: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    fontFamily: Typography.fontFamilyHeading,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  ctaDescription: {
    fontSize: Typography.sizes.base,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing['3xl'],
  },
  // Profile
  profileSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  profileName: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: 2,
  },
  profileSpecialization: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  bioText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  locationText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  editButtonWrap: {
    marginTop: Spacing.xs,
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  statValue: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.gold,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  // Tournaments
  tournamentsSection: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  empty: {
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  tournamentCard: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  cardMeta: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  cardParticipants: {
    fontSize: Typography.sizes.sm,
    color: Colors.gold,
    fontWeight: Typography.weights.medium,
    marginTop: Spacing.sm,
  },
  // Error
  errorCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  errorBox: {
    padding: Spacing.md,
    borderRadius: 4,
    backgroundColor: '#FFEBEE',
    marginBottom: Spacing.lg,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.sizes.sm,
  },
  bottomPad: {
    height: Spacing['2xl'],
  },
});
