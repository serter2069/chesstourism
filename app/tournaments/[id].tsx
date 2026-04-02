import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import { SafeContainer, Header } from '../../components/layout';
import { Button, Card, Badge, LoadingSpinner, Avatar } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useAuth } from '../../store/auth';
import api from '../../lib/api';

interface Commissar {
  id: string;
  name: string;
  surname: string;
  avatarUrl?: string | null;
  country?: string;
  city?: string;
}

interface Participant {
  id: string;
  user: {
    id: string;
    name: string;
    surname: string;
    country?: string;
  };
  paid: boolean;
  registeredAt: string;
}

interface Result {
  id: string;
  rank: number;
  player: {
    id: string;
    name: string;
    surname: string;
    country?: string;
  };
  score: number;
  ratingChange?: number;
}

interface Photo {
  id: string;
  url: string;
  caption?: string;
}

interface TournamentDetail {
  id: string;
  title: string;
  description?: string;
  rules?: string;
  schedule?: string;
  startDate: string;
  endDate: string;
  city: string;
  country: string;
  venue?: string;
  format: string;
  status: string;
  entryFee: number | null;
  currency?: string;
  maxParticipants?: number;
  commissar: Commissar;
  commissarId: string;
  participants: Participant[];
  results: Result[];
  photos: Photo[];
  _count?: { participants: number };
}

type TabKey = 'info' | 'participants' | 'results' | 'photos';

const STATUS_BADGE: Record<string, { label: string; status: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  REGISTRATION_OPEN: { label: 'Registration Open', status: 'success' },
  REGISTRATION_CLOSED: { label: 'Registration Closed', status: 'warning' },
  IN_PROGRESS: { label: 'In Progress', status: 'info' },
  COMPLETED: { label: 'Completed', status: 'default' },
  CANCELLED: { label: 'Cancelled', status: 'error' },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function TournamentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [tournament, setTournament] = useState<TournamentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('info');
  const [registering, setRegistering] = useState(false);

  const fetchTournament = useCallback(async () => {
    if (!id) return;
    try {
      setError(null);
      const res = await api.get(`/tournaments/${id}`);
      setTournament(res.data);
    } catch {
      setError('Failed to load tournament');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTournament();
  }, [fetchTournament]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTournament();
  }, [fetchTournament]);

  const handleRegister = useCallback(async () => {
    if (!id || !user) return;
    try {
      setRegistering(true);
      await api.post(`/tournaments/${id}/register`);
      await fetchTournament();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      Alert.alert('Error', message);
    } finally {
      setRegistering(false);
    }
  }, [id, user, fetchTournament]);

  const handleShare = useCallback(async () => {
    if (!tournament) return;
    const url = `https://chesstourism.smartlaunchhub.com/tournaments/${tournament.id}`;
    const message = `Check out this chess tournament: ${tournament.title}`;
    try {
      if (Platform.OS === 'web') {
        if (typeof navigator !== 'undefined' && navigator.share) {
          await navigator.share({ title: tournament.title, text: message, url });
        } else {
          await navigator.clipboard?.writeText(url);
          Alert.alert('Link copied', 'Tournament link copied to clipboard.');
        }
      } else {
        await Share.share({ message: `${message}\n${url}`, url });
      }
    } catch {
      // User cancelled share — no action needed
    }
  }, [tournament]);

  if (loading) {
    return (
      <SafeContainer>
        <Header title="Tournament" showBack />
        <LoadingSpinner />
      </SafeContainer>
    );
  }

  if (error || !tournament) {
    return (
      <SafeContainer>
        <Header title="Tournament" showBack />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Tournament not found'}</Text>
          <Button title="Retry" onPress={fetchTournament} variant="secondary" />
        </View>
      </SafeContainer>
    );
  }

  const badge = STATUS_BADGE[tournament.status] || { label: tournament.status, status: 'default' as const };
  const isOwner = user?.role === 'commissar' && user?.id === tournament.commissarId;
  const isAdmin = user?.role === 'admin';
  const myParticipation = tournament.participants?.find((p) => p.user.id === user?.id);
  const isRegistered = !!myParticipation;
  const isPaid = myParticipation?.paid ?? false;
  const canRegister = tournament.status === 'REGISTRATION_OPEN' && user && user.role === 'participant' && !isRegistered;
  const hasResults = tournament.status === 'COMPLETED' || tournament.status === 'IN_PROGRESS';
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'info', label: 'Info' },
    { key: 'participants', label: `Players (${tournament.participants?.length || 0})` },
    ...(hasResults ? [{ key: 'results' as TabKey, label: 'Results' }] : []),
    ...(tournament.photos?.length ? [{ key: 'photos' as TabKey, label: 'Photos' }] : []),
  ];

  const shareUrl = `https://chesstourism.smartlaunchhub.com/tournaments/${tournament.id}`;
  const ogDescription = tournament.description
    ? tournament.description.slice(0, 160)
    : `${formatDate(tournament.startDate)} — ${tournament.city}, ${tournament.country}`;

  return (
    <SafeContainer>
      <Head>
        <title>{tournament.title} — ChesTourism</title>
        <meta name="description" content={ogDescription} />
        <meta property="og:title" content={tournament.title} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="ChesTourism" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={tournament.title} />
        <meta name="twitter:description" content={ogDescription} />
      </Head>
      <Header title={tournament.title} showBack />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brandPrimary} />
        }
      >
        {/* Title section */}
        <View style={styles.titleSection}>
          <Badge label={badge.label} status={badge.status} style={styles.statusBadge} />
          <Text style={styles.title}>{tournament.title}</Text>
          <Text style={styles.dates}>
            {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
          </Text>
          <Text style={styles.location}>
            {tournament.venue ? `${tournament.venue}, ` : ''}{tournament.city}, {tournament.country}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Format</Text>
              <Text style={styles.metaValue}>{tournament.format}</Text>
            </View>
            {tournament.entryFee != null && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Entry Fee</Text>
                <Text style={styles.metaValue}>
                  {tournament.entryFee === 0 ? 'Free' : `${tournament.entryFee} ${tournament.currency || 'EUR'}`}
                </Text>
              </View>
            )}
            {tournament.maxParticipants != null && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Max Players</Text>
                <Text style={styles.metaValue}>{tournament.maxParticipants}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          {!user && (
            <Button
              title="Sign In to Participate"
              onPress={() => router.push('/(auth)/login')}
            />
          )}
          {canRegister && (
            <Button
              title="Register"
              onPress={handleRegister}
              loading={registering}
            />
          )}
          {isRegistered && !isPaid && (
            <Button
              title="Pay Entry Fee"
              onPress={() => Alert.alert('Payment', 'Payment integration coming soon')}
              variant="secondary"
            />
          )}
          {isRegistered && isPaid && (
            <Badge label="Paid" status="success" style={styles.paidBadge} />
          )}
          {(isOwner || isAdmin) && (
            <Button
              title="Manage Tournament"
              onPress={() => router.push(`/(auth)/commissar/tournament/${tournament.id}` as never)}
              variant="secondary"
            />
          )}
          <Button
            title="Share Tournament"
            onPress={handleShare}
            variant="secondary"
          />
        </View>

        {/* Commissar card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Commissar</Text>
          <Card>
            <View style={styles.commissarRow}>
              <Avatar
                uri={tournament.commissar?.avatarUrl}
                name={`${tournament.commissar?.name || ''} ${tournament.commissar?.surname || ''}`}
                size={48}
              />
              <View style={styles.commissarInfo}>
                <Text style={styles.commissarName}>
                  {tournament.commissar?.name} {tournament.commissar?.surname}
                </Text>
                {(tournament.commissar?.city || tournament.commissar?.country) && (
                  <Text style={styles.commissarMeta}>
                    {[tournament.commissar?.city, tournament.commissar?.country].filter(Boolean).join(', ')}
                  </Text>
                )}
              </View>
            </View>
          </Card>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab content */}
        {activeTab === 'info' && (
          <View style={styles.section}>
            {tournament.description && (
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Description</Text>
                <Text style={styles.infoText}>{tournament.description}</Text>
              </View>
            )}
            {tournament.rules && (
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Rules</Text>
                <Text style={styles.infoText}>{tournament.rules}</Text>
              </View>
            )}
            {tournament.schedule && (
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Schedule</Text>
                <Text style={styles.infoText}>{tournament.schedule}</Text>
              </View>
            )}
            {!tournament.description && !tournament.rules && !tournament.schedule && (
              <Text style={styles.emptyTab}>No additional information available.</Text>
            )}
          </View>
        )}

        {activeTab === 'participants' && (
          <View style={styles.section}>
            {(!tournament.participants || tournament.participants.length === 0) ? (
              <Text style={styles.emptyTab}>No participants registered yet.</Text>
            ) : (
              <Card style={styles.listCard}>
                {tournament.participants.map((p, idx) => (
                  <View
                    key={p.id}
                    style={[styles.participantRow, idx % 2 === 0 && styles.rowEven]}
                  >
                    <Text style={styles.participantRank}>{idx + 1}</Text>
                    <View style={styles.participantInfo}>
                      <Text style={styles.participantName}>
                        {p.user.name} {p.user.surname}
                      </Text>
                      {p.user.country && (
                        <Text style={styles.participantMeta}>{p.user.country}</Text>
                      )}
                    </View>
                    {p.paid && <Badge label="Paid" status="success" />}
                  </View>
                ))}
              </Card>
            )}
          </View>
        )}

        {activeTab === 'results' && (
          <View style={styles.section}>
            {(!tournament.results || tournament.results.length === 0) ? (
              <Text style={styles.emptyTab}>Results not yet available.</Text>
            ) : (
              <Card style={styles.listCard}>
                <View style={styles.resultsHeader}>
                  <Text style={[styles.resultsHeaderText, styles.resultRank]}>#</Text>
                  <Text style={[styles.resultsHeaderText, styles.resultName]}>Player</Text>
                  <Text style={[styles.resultsHeaderText, styles.resultScore]}>Score</Text>
                  <Text style={[styles.resultsHeaderText, styles.resultRating]}>+/-</Text>
                </View>
                {tournament.results.map((r, idx) => (
                  <View
                    key={r.id}
                    style={[styles.resultRow, idx % 2 === 0 && styles.rowEven]}
                  >
                    <Text style={[styles.resultText, styles.resultRank]}>{r.rank}</Text>
                    <View style={styles.resultName}>
                      <Text style={styles.resultText}>
                        {r.player.name} {r.player.surname}
                      </Text>
                      {r.player.country && (
                        <Text style={styles.participantMeta}>{r.player.country}</Text>
                      )}
                    </View>
                    <Text style={[styles.resultText, styles.resultScore]}>{r.score}</Text>
                    <Text style={[
                      styles.resultText,
                      styles.resultRating,
                      r.ratingChange != null && r.ratingChange > 0 ? styles.ratingPositive : undefined,
                      r.ratingChange != null && r.ratingChange < 0 ? styles.ratingNegative : undefined,
                    ]}>
                      {r.ratingChange != null ? (r.ratingChange > 0 ? `+${r.ratingChange}` : `${r.ratingChange}`) : '-'}
                    </Text>
                  </View>
                ))}
              </Card>
            )}
          </View>
        )}

        {activeTab === 'photos' && (
          <View style={styles.section}>
            {(!tournament.photos || tournament.photos.length === 0) ? (
              <Text style={styles.emptyTab}>No photos yet.</Text>
            ) : (
              <View style={styles.photoGrid}>
                {tournament.photos.map((photo) => (
                  <View key={photo.id} style={styles.photoItem}>
                    <Image source={{ uri: photo.url }} style={styles.photoImage} resizeMode="cover" />
                    {photo.caption && (
                      <Text style={styles.photoCaption} numberOfLines={1}>{photo.caption}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
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
  // Title section
  titleSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.bgSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  statusBadge: {
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  dates: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  location: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xl,
  },
  metaItem: {},
  metaLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
    fontWeight: Typography.weights.semibold,
  },
  // Actions
  actions: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  paidBadge: {
    alignSelf: 'flex-start',
  },
  // Sections
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  // Commissar
  commissarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commissarInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  commissarName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
  },
  commissarMeta: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  // Tabs
  tabBar: {
    flexDirection: 'row',
    marginTop: Spacing.xl,
    marginHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  tab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: -1,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.brandPrimary,
  },
  tabText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  tabTextActive: {
    color: Colors.brandPrimary,
    fontWeight: Typography.weights.semibold,
  },
  // Info tab
  infoBlock: {
    marginBottom: Spacing.xl,
  },
  infoLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.sizes.sm * Typography.lineHeights.relaxed,
  },
  emptyTab: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing['3xl'],
  },
  // Participants / Results list
  listCard: {
    padding: 0,
    overflow: 'hidden',
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  rowEven: {
    backgroundColor: Colors.bgSurface + '44',
  },
  participantRank: {
    width: 28,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    fontWeight: Typography.weights.medium,
  },
  participantMeta: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  // Results
  resultsHeader: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.bgSurface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  resultsHeaderText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  resultText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
  },
  resultRank: {
    width: 28,
  },
  resultName: {
    flex: 1,
  },
  resultScore: {
    width: 50,
    textAlign: 'center',
    fontWeight: Typography.weights.semibold,
  },
  resultRating: {
    width: 50,
    textAlign: 'right',
  },
  ratingPositive: {
    color: Colors.statusSuccess,
  },
  ratingNegative: {
    color: Colors.statusError,
  },
  // Photos
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  photoItem: {
    width: '48%',
    marginBottom: Spacing.sm,
  },
  photoImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: Colors.bgSurface,
  },
  photoCaption: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  // Error
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    color: Colors.statusError,
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  footer: {
    height: Spacing['2xl'],
  },
});
