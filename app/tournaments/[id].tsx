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
  TextInput,
  Linking,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import { SafeContainer, Header } from '../../components/layout';
import { Button, Card, Badge, LoadingSpinner, Avatar, WatchlistButton } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useAuth } from '../../store/auth';
import api from '../../lib/api';

interface Commissioner {
  id: string;
  userId: string;
  photoUrl?: string | null;
  country?: string | null;
  city?: string | null;
  user?: { name: string; surname: string };
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
  caption?: string | null;
  createdAt: string;
}

interface ScheduleEntry {
  id: string;
  title: string;
  description?: string | null;
  startTime: string;
  endTime?: string | null;
  venue?: string | null;
  roundNumber?: number | null;
}

interface RoundPairing {
  id: string;
  player1Id: string;
  player2Id: string | null;
  result: string | null;
  board: number | null;
}

interface TournamentRound {
  id: string;
  roundNumber: number;
  status: string;
  pairings: RoundPairing[];
}

interface Announcement {
  id: string;
  title: string;
  body: string;
  published: boolean;
  createdAt: string;
}

interface MyRegistration {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  createdAt: string;
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
  timeControl: string | null;
  status: string;
  fee: number | null;
  currency?: string;
  maxParticipants?: number;
  commissioner: Commissioner;
  commissionerId: string;
  participants: Participant[];
  results: Result[];
  photos: Photo[];
  registrationCount?: number;
  myRegistration?: MyRegistration | null;
  _count?: { registrations: number };
}

type TabKey = 'info' | 'participants' | 'rounds' | 'results' | 'photos' | 'announcements' | 'schedule';

const STATUS_BADGE: Record<string, { label: string; status: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  DRAFT: { label: 'Draft', status: 'default' },
  PUBLISHED: { label: 'Coming Soon', status: 'default' },
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
  const [downloadingCertificate, setDownloadingCertificate] = useState(false);

  // Schedule state
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);

  // Rounds state
  const [rounds, setRounds] = useState<TournamentRound[]>([]);
  const [expandedRound, setExpandedRound] = useState<string | null>(null);

  // Announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Photos state
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [addingPhoto, setAddingPhoto] = useState(false);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null);

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

  const fetchPhotos = useCallback(async () => {
    if (!id) return;
    try {
      setPhotosLoading(true);
      const res = await api.get(`/tournaments/${id}/photos`);
      setPhotos(res.data);
    } catch {
      // Silent — photos are optional
    } finally {
      setPhotosLoading(false);
    }
  }, [id]);

  const fetchSchedule = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get(`/tournaments/${id}/schedule`);
      setSchedule(res.data);
    } catch {
      // Silent — schedule is optional
    }
  }, [id]);

  const fetchAnnouncements = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get(`/tournaments/${id}/announcements`);
      setAnnouncements(res.data);
    } catch {
      // Silent — announcements are optional
    }
  }, [id]);

  const fetchRounds = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get(`/tournaments/${id}/rounds`);
      setRounds(res.data);
    } catch {
      // Silent — rounds are optional
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchPhotos();
  }, [id, fetchPhotos]);

  useEffect(() => {
    if (id) fetchSchedule();
  }, [id, fetchSchedule]);

  useEffect(() => {
    if (id) fetchAnnouncements();
  }, [id, fetchAnnouncements]);

  useEffect(() => {
    if (id) fetchRounds();
  }, [id, fetchRounds]);

  const handleAddPhoto = useCallback(async () => {
    const trimmedUrl = photoUrl.trim();
    if (!trimmedUrl) {
      Alert.alert('Error', 'Please enter a photo URL');
      return;
    }
    try {
      new URL(trimmedUrl);
    } catch {
      Alert.alert('Error', 'Please enter a valid URL (http or https)');
      return;
    }
    try {
      setAddingPhoto(true);
      await api.post(`/tournaments/${id}/photos`, {
        url: trimmedUrl,
        caption: photoCaption.trim() || undefined,
      });
      setPhotoUrl('');
      setPhotoCaption('');
      setShowAddPhoto(false);
      await fetchPhotos();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to add photo';
      Alert.alert('Error', message);
    } finally {
      setAddingPhoto(false);
    }
  }, [id, photoUrl, photoCaption, fetchPhotos]);

  const handleDeletePhoto = useCallback((photoId: string) => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingPhotoId(photoId);
              await api.delete(`/tournaments/${id}/photos/${photoId}`);
              await fetchPhotos();
            } catch (err: unknown) {
              const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to delete photo';
              Alert.alert('Error', message);
            } finally {
              setDeletingPhotoId(null);
            }
          },
        },
      ],
    );
  }, [id, fetchPhotos]);

  const handleRegister = useCallback(async () => {
    if (!id || !user) return;
    try {
      setRegistering(true);
      await api.post(`/tournaments/${id}/register`);
      // UC-28: if tournament has a fee, redirect to payment page immediately after registration
      if (tournament && tournament.fee != null && tournament.fee > 0) {
        router.push(`/(dashboard)/payment/${id}` as never);
      } else {
        await fetchTournament();
      }
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      Alert.alert('Error', message);
    } finally {
      setRegistering(false);
    }
  }, [id, user, tournament, fetchTournament, router]);

  const handleDownloadCertificate = useCallback(async () => {
    if (!id) return;
    try {
      setDownloadingCertificate(true);
      const tokenRes = await api.get('/profile/download-token');
      const { downloadToken } = tokenRes.data;
      const apiBase = process.env.EXPO_PUBLIC_API_URL || 'https://chesstourism.smartlaunchhub.com/api';
      const url = `${apiBase}/tournaments/${id}/my-certificate?token=${encodeURIComponent(downloadToken)}`;
      await Linking.openURL(url);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to download certificate';
      Alert.alert('Error', message);
    } finally {
      setDownloadingCertificate(false);
    }
  }, [id]);

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
  const isOwner = user?.role === 'COMMISSIONER' && user?.id === tournament.commissioner?.userId;
  const isAdmin = user?.role === 'ADMIN';
  const myReg = tournament.myRegistration;
  const isRegistered = !!myReg;
  const regStatus = myReg?.status;
  const isFull = !!(tournament.maxParticipants && (tournament.registrationCount ?? 0) >= tournament.maxParticipants);
  const canRegister = ['PUBLISHED', 'REGISTRATION_OPEN'].includes(tournament.status) && user && !isRegistered && !isFull;
  const hasResults = tournament.status === 'COMPLETED' || tournament.status === 'IN_PROGRESS';
  const canDownloadCertificate = tournament.status === 'COMPLETED' && !!user && !!myReg && ['APPROVED', 'PAID'].includes(myReg.status);
  // Build a player name map from participants for display in rounds
  const playerNameMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    if (tournament.participants) {
      for (const p of tournament.participants) {
        map[p.user.id] = [p.user.name, p.user.surname].filter(Boolean).join(' ');
      }
    }
    return map;
  }, [tournament.participants]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'info', label: 'Info' },
    { key: 'participants', label: `Players (${tournament.participants?.length || 0})` },
    ...(rounds.length > 0 ? [{ key: 'rounds' as TabKey, label: `Rounds (${rounds.length})` }] : []),
    ...(hasResults ? [{ key: 'results' as TabKey, label: 'Results' }] : []),
    ...(schedule.length > 0 ? [{ key: 'schedule' as TabKey, label: `Schedule (${schedule.length})` }] : []),
    { key: 'photos', label: photos.length ? `Photos (${photos.length})` : 'Photos' },
    ...(announcements.length > 0 ? [{ key: 'announcements' as TabKey, label: `News (${announcements.length})` }] : []),
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Title section */}
        <View style={styles.titleSection}>
          <Badge label={badge.label} status={badge.status} style={styles.statusBadge} />
          <View style={styles.titleRow}>
            <Text style={styles.title}>{tournament.title}</Text>
            <WatchlistButton tournamentId={tournament.id} size={26} />
          </View>
          <Text style={styles.dates}>
            {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
          </Text>
          <Text style={styles.location}>
            {tournament.venue ? `${tournament.venue}, ` : ''}{tournament.city}, {tournament.country}
          </Text>
          <View style={styles.metaRow}>
            {tournament.timeControl && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Format</Text>
                <Text style={styles.metaValue}>{tournament.timeControl}</Text>
              </View>
            )}
            {tournament.fee != null && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Entry Fee</Text>
                <Text style={styles.metaValue}>
                  {tournament.fee === 0 ? 'Free' : `${tournament.fee} ${tournament.currency || 'EUR'}`}
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
          {!user && ['PUBLISHED', 'REGISTRATION_OPEN'].includes(tournament.status) && (
            <Button
              title="Sign In to Register"
              onPress={() => router.push({ pathname: '/(auth)/login', params: { returnUrl: `/tournaments/${tournament.id}` } } as any)}
            />
          )}
          {canRegister && (
            <Button
              title={isFull ? 'Tournament Full' : 'Register for Tournament'}
              onPress={handleRegister}
              loading={registering}
              disabled={isFull}
            />
          )}
          {isFull && !isRegistered && user && (
            <Badge label="Tournament Full" status="warning" style={styles.regStatusBadge} />
          )}
          {isRegistered && regStatus === 'PENDING' && (
            <Badge label="Pending Approval" status="warning" style={styles.regStatusBadge} />
          )}
          {isRegistered && regStatus === 'APPROVED' && (
            <View style={styles.regStatusRow}>
              <Badge label="Approved" status="success" style={styles.regStatusBadge} />
              {(tournament.fee ?? 0) > 0 ? (
                <Button
                  title={`Pay Registration Fee: ${tournament.fee} ${tournament.currency || 'USD'}`}
                  onPress={() => router.push(`/(dashboard)/payment/${tournament.id}` as never)}
                />
              ) : null}
            </View>
          )}
          {isRegistered && regStatus === 'REJECTED' && (
            <Badge label="Registration Rejected" status="error" style={styles.regStatusBadge} />
          )}
          {isRegistered && regStatus === 'PAID' && (
            <Badge label="Registered & Paid" status="success" style={styles.regStatusBadge} />
          )}
          {(isOwner || isAdmin) && (
            <Button
              title="Edit Tournament"
              onPress={() => router.push(`/(dashboard)/tournaments/${tournament.id}/edit` as never)}
              variant="secondary"
            />
          )}
          {canDownloadCertificate && (
            <Button
              title="Download Certificate"
              onPress={handleDownloadCertificate}
              loading={downloadingCertificate}
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
                uri={tournament.commissioner?.photoUrl}
                name={[tournament.commissioner?.user?.name, tournament.commissioner?.user?.surname].filter(Boolean).join(' ')}
                size={48}
              />
              <View style={styles.commissarInfo}>
                <Text style={styles.commissarName}>
                  {[tournament.commissioner?.user?.name, tournament.commissioner?.user?.surname].filter(Boolean).join(' ')}
                </Text>
                {(tournament.commissioner?.city || tournament.commissioner?.country) && (
                  <Text style={styles.commissarMeta}>
                    {[tournament.commissioner?.city, tournament.commissioner?.country].filter(Boolean).join(', ')}
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
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.participantRow, idx % 2 === 0 && styles.rowEven]}
                    activeOpacity={0.7}
                    onPress={() => router.push(`/users/${p.user.id}` as never)}
                  >
                    <Text style={styles.participantRank}>{idx + 1}</Text>
                    <View style={styles.participantInfo}>
                      <Text style={styles.participantName}>
                        {[p.user.name, p.user.surname].filter(Boolean).join(' ')}
                      </Text>
                      {p.user.country && (
                        <Text style={styles.participantMeta}>{p.user.country}</Text>
                      )}
                    </View>
                    {p.paid && <Badge label="Paid" status="success" />}
                  </TouchableOpacity>
                ))}
              </Card>
            )}
          </View>
        )}

        {activeTab === 'rounds' && (
          <View style={styles.section}>
            {rounds.length === 0 ? (
              <Text style={styles.emptyTab}>No rounds yet.</Text>
            ) : (
              rounds.map((round) => {
                const isExpanded = expandedRound === round.id;
                return (
                  <Card key={round.id} style={styles.roundCard}>
                    <TouchableOpacity
                      style={styles.roundHeader}
                      onPress={() => setExpandedRound(isExpanded ? null : round.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.roundTitle}>Round {round.roundNumber}</Text>
                      <Badge
                        label={round.status}
                        status={round.status === 'COMPLETED' ? 'success' : round.status === 'IN_PROGRESS' ? 'info' : 'default'}
                      />
                    </TouchableOpacity>
                    {isExpanded && (
                      <View style={styles.pairingsContainer}>
                        {round.pairings.length === 0 ? (
                          <Text style={styles.emptyTab}>No pairings set.</Text>
                        ) : (
                          <>
                            <View style={styles.pairingsHeaderRow}>
                              <Text style={[styles.pairingsHeaderText, styles.pairingBoard]}>#</Text>
                              <Text style={[styles.pairingsHeaderText, styles.pairingPlayer]}>White</Text>
                              <Text style={[styles.pairingsHeaderText, styles.pairingResult]}>Result</Text>
                              <Text style={[styles.pairingsHeaderText, styles.pairingPlayer]}>Black</Text>
                            </View>
                            {round.pairings.map((p, idx) => (
                              <View key={p.id} style={[styles.pairingRow, idx % 2 === 0 && styles.rowEven]}>
                                <Text style={[styles.pairingText, styles.pairingBoard]}>{p.board ?? idx + 1}</Text>
                                <Text style={[styles.pairingText, styles.pairingPlayer]} numberOfLines={1}>
                                  {playerNameMap[p.player1Id] || p.player1Id.slice(0, 8)}
                                </Text>
                                <Text style={[styles.pairingText, styles.pairingResult, styles.pairingResultValue]}>
                                  {p.result || '-'}
                                </Text>
                                <Text style={[styles.pairingText, styles.pairingPlayer]} numberOfLines={1}>
                                  {p.player2Id ? (playerNameMap[p.player2Id] || p.player2Id.slice(0, 8)) : 'BYE'}
                                </Text>
                              </View>
                            ))}
                          </>
                        )}
                      </View>
                    )}
                  </Card>
                );
              })
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
                  <TouchableOpacity
                    key={r.id}
                    style={[styles.resultRow, idx % 2 === 0 && styles.rowEven]}
                    activeOpacity={0.7}
                    onPress={() => router.push(`/users/${r.player.id}` as never)}
                  >
                    <Text style={[styles.resultText, styles.resultRank]}>{r.rank}</Text>
                    <View style={styles.resultName}>
                      <Text style={styles.resultText}>
                        {[r.player.name, r.player.surname].filter(Boolean).join(' ')}
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
                  </TouchableOpacity>
                ))}
              </Card>
            )}
          </View>
        )}

        {activeTab === 'schedule' && (
          <View style={styles.section}>
            {schedule.length === 0 ? (
              <Text style={styles.emptyTab}>No schedule entries yet.</Text>
            ) : (
              schedule.map((entry) => (
                <Card key={entry.id} style={styles.scheduleCard}>
                  <View style={styles.scheduleHeader}>
                    <Text style={styles.scheduleTitle}>
                      {entry.roundNumber != null ? `Round ${entry.roundNumber}: ` : ''}{entry.title}
                    </Text>
                  </View>
                  <Text style={styles.scheduleTime}>
                    {new Date(entry.startTime).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    {entry.endTime ? ` — ${new Date(entry.endTime).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit' })}` : ''}
                  </Text>
                  {entry.venue && <Text style={styles.scheduleVenue}>{entry.venue}</Text>}
                  {entry.description && <Text style={styles.scheduleDesc}>{entry.description}</Text>}
                </Card>
              ))
            )}
          </View>
        )}

        {activeTab === 'photos' && (
          <View style={styles.section}>
            {/* Add photo button for commissioner / admin */}
            {(isOwner || isAdmin) && (
              <View style={styles.addPhotoSection}>
                {!showAddPhoto ? (
                  <Button
                    title="Add Photo"
                    onPress={() => setShowAddPhoto(true)}
                    variant="secondary"
                  />
                ) : (
                  <Card style={styles.addPhotoCard}>
                    <Text style={styles.addPhotoTitle}>Add Photo</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Photo URL (https://...)"
                      placeholderTextColor={Colors.textMuted}
                      value={photoUrl}
                      onChangeText={setPhotoUrl}
                      autoCapitalize="none"
                      keyboardType="url"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Caption (optional)"
                      placeholderTextColor={Colors.textMuted}
                      value={photoCaption}
                      onChangeText={setPhotoCaption}
                    />
                    <View style={styles.addPhotoActions}>
                      <Button
                        title="Cancel"
                        onPress={() => { setShowAddPhoto(false); setPhotoUrl(''); setPhotoCaption(''); }}
                        variant="secondary"
                      />
                      <Button
                        title="Add"
                        onPress={handleAddPhoto}
                        loading={addingPhoto}
                      />
                    </View>
                  </Card>
                )}
              </View>
            )}

            {photosLoading ? (
              <LoadingSpinner />
            ) : photos.length === 0 ? (
              <Text style={styles.emptyTab}>No photos yet.</Text>
            ) : (
              <View style={styles.photoGrid}>
                {photos.map((photo) => (
                  <View key={photo.id} style={styles.photoItem}>
                    <Image source={{ uri: photo.url }} style={styles.photoImage} resizeMode="cover" />
                    {photo.caption && (
                      <Text style={styles.photoCaption} numberOfLines={1}>{photo.caption}</Text>
                    )}
                    {(isOwner || isAdmin) && (
                      <TouchableOpacity
                        style={styles.deletePhotoBtn}
                        onPress={() => handleDeletePhoto(photo.id)}
                        disabled={deletingPhotoId === photo.id}
                      >
                        <Text style={styles.deletePhotoBtnText}>
                          {deletingPhotoId === photo.id ? '...' : 'Delete'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === 'announcements' && (
          <View style={styles.section}>
            {announcements.length === 0 ? (
              <Text style={styles.emptyTab}>No announcements yet.</Text>
            ) : (
              announcements.map((ann) => (
                <Card key={ann.id} style={styles.announcementCard}>
                  <Text style={styles.announcementTitle}>{ann.title}</Text>
                  <Text style={styles.announcementBody}>{ann.body}</Text>
                  <Text style={styles.announcementDate}>{formatDate(ann.createdAt)}</Text>
                </Card>
              ))
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
    backgroundColor: Colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statusBadge: {
    marginBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  dates: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  location: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
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
    color: Colors.text,
    fontWeight: Typography.weights.semibold,
  },
  // Actions
  actions: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  regStatusBadge: {
    alignSelf: 'flex-start',
  },
  regStatusRow: {
    gap: Spacing.sm,
  },
  // Sections
  section: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
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
    color: Colors.text,
  },
  commissarMeta: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  // Tabs
  tabBar: {
    flexDirection: 'row',
    marginTop: Spacing.xl,
    marginHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: -1,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  // Info tab
  infoBlock: {
    marginBottom: Spacing.xl,
  },
  infoLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
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
    backgroundColor: Colors.backgroundAlt + '44',
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
    color: Colors.text,
    fontWeight: Typography.weights.medium,
  },
  participantMeta: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  // Results
  resultsHeader: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resultsHeaderText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textMuted,
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
    color: Colors.text,
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
    color: Colors.primary,
  },
  ratingNegative: {
    color: Colors.error,
  },
  // Photos
  addPhotoSection: {
    marginBottom: Spacing.md,
  },
  addPhotoCard: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  addPhotoTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    backgroundColor: Colors.backgroundAlt,
    marginBottom: Spacing.xs,
  },
  addPhotoActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'flex-end',
    marginTop: Spacing.xs,
  },
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
    backgroundColor: Colors.backgroundAlt,
  },
  photoCaption: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  deletePhotoBtn: {
    marginTop: Spacing.xs,
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
    borderRadius: 4,
    backgroundColor: Colors.error + '22',
  },
  deletePhotoBtnText: {
    fontSize: Typography.sizes.xs,
    color: Colors.error,
    fontWeight: Typography.weights.medium,
  },
  // Schedule
  scheduleCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  scheduleHeader: {
    marginBottom: Spacing.xs,
  },
  scheduleTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  scheduleTime: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
    marginBottom: Spacing.xs,
  },
  scheduleVenue: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  scheduleDesc: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    lineHeight: Typography.sizes.sm * Typography.lineHeights.relaxed,
  },
  // Rounds
  roundCard: {
    marginBottom: Spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  roundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  roundTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  pairingsContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  pairingsHeaderRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pairingsHeaderText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  pairingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  pairingText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text,
  },
  pairingBoard: {
    width: 28,
  },
  pairingPlayer: {
    flex: 1,
  },
  pairingResult: {
    width: 60,
    textAlign: 'center',
  },
  pairingResultValue: {
    fontWeight: Typography.weights.semibold,
  },
  // Announcements
  announcementCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  announcementTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  announcementBody: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    lineHeight: Typography.sizes.sm * Typography.lineHeights.relaxed,
    marginBottom: Spacing.sm,
  },
  announcementDate: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  // Error
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  footer: {
    height: Spacing['2xl'],
  },
});
