import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeContainer, Header } from '../../../../components/layout';
import { Button, Card, Badge, Input, LoadingSpinner } from '../../../../components/ui';
import { Colors } from '../../../../constants/colors';
import { Spacing } from '../../../../constants/spacing';
import { Typography } from '../../../../constants/typography';
import api from '../../../../lib/api';

interface Tournament {
  id: string;
  title: string;
  description?: string;
  format: string;
  startDate: string;
  endDate: string;
  city?: string;
  country?: string;
  venueAddress?: string;
  maxParticipants?: number;
  fee?: number;
  entryFee?: number;
  currency?: string;
  ratingLimit?: number;
  timeControl?: string;
  rules?: string;
  schedule?: string;
  status: string;
}

interface Participant {
  id: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    surname: string;
    email: string;
  };
  paid: boolean;
  name?: string;
  surname?: string;
}

const FORMAT_OPTIONS = ['CLASSICAL', 'RAPID', 'BLITZ'] as const;

const STATUS_TRANSITIONS: Record<string, { label: string; nextStatus: string } | null> = {
  DRAFT: { label: 'Open Registration', nextStatus: 'REGISTRATION_OPEN' },
  REGISTRATION_OPEN: { label: 'Close Registration', nextStatus: 'REGISTRATION_CLOSED' },
  REGISTRATION_CLOSED: { label: 'Start Tournament', nextStatus: 'IN_PROGRESS' },
  IN_PROGRESS: null, // Navigate to results page instead
  COMPLETED: null,
  CANCELLED: null,
};

const STATUS_BADGE_MAP: Record<string, { label: string; status: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
  DRAFT: { label: 'Draft', status: 'default' },
  REGISTRATION_OPEN: { label: 'Registration Open', status: 'success' },
  REGISTRATION_CLOSED: { label: 'Registration Closed', status: 'warning' },
  IN_PROGRESS: { label: 'In Progress', status: 'info' },
  COMPLETED: { label: 'Completed', status: 'default' },
  CANCELLED: { label: 'Cancelled', status: 'error' },
};

export default function EditTournamentScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusChanging, setStatusChanging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [format, setFormat] = useState('CLASSICAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [ratingLimit, setRatingLimit] = useState('');
  const [timeControl, setTimeControl] = useState('');
  const [rules, setRules] = useState('');
  const [schedule, setSchedule] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tRes, pRes] = await Promise.all([
        api.get(`/tournaments/${id}`),
        api.get(`/tournaments/${id}/registrations`).catch(() => ({ data: [] })),
      ]);

      const t: Tournament = tRes.data;
      setTournament(t);

      // Pre-fill form
      setTitle(t.title || '');
      setDescription(t.description || '');
      setFormat(t.format || t.timeControl?.toUpperCase() || 'CLASSICAL');
      setStartDate(t.startDate ? t.startDate.split('T')[0] : '');
      setEndDate(t.endDate ? t.endDate.split('T')[0] : '');
      setCity(t.city || '');
      setCountry(t.country || '');
      setVenueAddress(t.venueAddress || '');
      setMaxParticipants(t.maxParticipants ? String(t.maxParticipants) : '');
      const feeVal = t.fee != null ? t.fee : t.entryFee;
      setEntryFee(feeVal != null ? String(feeVal) : '');
      setCurrency(t.currency || 'USD');
      setRatingLimit(t.ratingLimit ? String(t.ratingLimit) : '');
      setTimeControl(t.timeControl || '');
      setRules(t.rules || '');
      setSchedule(t.schedule || '');

      const pData = pRes.data;
      setParticipants(Array.isArray(pData) ? pData : pData.items || pData.participants || []);
    } catch {
      Alert.alert('Error', 'Failed to load tournament');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (startDate && endDate && startDate >= endDate) {
      errs.endDate = 'End date must be after start date';
    }
    const maxP = parseInt(maxParticipants, 10);
    if (maxParticipants && (isNaN(maxP) || maxP <= 0)) {
      errs.maxParticipants = 'Must be a positive number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;

    try {
      setSaving(true);
      await api.put(`/tournaments/${id}`, {
        title: title.trim(),
        description: description.trim() || undefined,
        timeControl: timeControl.trim() || format.toLowerCase(),
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        city: city.trim() || undefined,
        country: country.trim() || undefined,
        maxParticipants: maxParticipants ? parseInt(maxParticipants, 10) : undefined,
        fee: entryFee ? parseFloat(entryFee) : undefined,
        currency: currency.trim() || 'USD',
        ratingLimit: ratingLimit ? parseInt(ratingLimit, 10) : undefined,
      });

      Alert.alert('Success', 'Tournament updated');
      fetchData();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update tournament';
      Alert.alert('Error', message);
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(nextStatus: string) {
    try {
      setStatusChanging(true);
      await api.patch(`/tournaments/${id}/status`, { status: nextStatus });
      Alert.alert('Success', 'Status updated');
      fetchData();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to change status';
      Alert.alert('Error', message);
    } finally {
      setStatusChanging(false);
    }
  }

  const [confirmingCash, setConfirmingCash] = useState<string | null>(null);

  async function handleMarkPaidCash(participant: Participant) {
    const pUserId = participant.userId || participant.id;
    const pName = participant.user
      ? `${participant.user.name} ${participant.user.surname}`
      : 'this participant';
    Alert.alert(
      'Confirm Cash Payment',
      `Mark ${pName} as paid (cash)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              setConfirmingCash(participant.id);
              await api.patch(`/tournaments/${id}/participants/${pUserId}/confirm-cash`);
              Alert.alert('Success', 'Cash payment confirmed');
              fetchData();
            } catch (err: unknown) {
              const message =
                (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.error ||
                (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.message ||
                'Failed to confirm cash payment';
              Alert.alert('Error', message);
            } finally {
              setConfirmingCash(null);
            }
          },
        },
      ],
    );
  }

  if (loading) {
    return (
      <SafeContainer>
        <Header title="Edit Tournament" showBack />
        <LoadingSpinner />
      </SafeContainer>
    );
  }

  if (!tournament) {
    return (
      <SafeContainer>
        <Header title="Edit Tournament" showBack />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Tournament not found</Text>
        </View>
      </SafeContainer>
    );
  }

  const statusBadge = STATUS_BADGE_MAP[tournament.status] || { label: tournament.status, status: 'default' as const };
  const transition = STATUS_TRANSITIONS[tournament.status];

  return (
    <SafeContainer>
      <Header title="Edit Tournament" showBack />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Status section */}
        <Card style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status:</Text>
            <Badge label={statusBadge.label} status={statusBadge.status} />
          </View>
          {transition && (
            <Button
              title={transition.label}
              onPress={() => handleStatusChange(transition.nextStatus)}
              loading={statusChanging}
              disabled={statusChanging}
              style={styles.statusBtn}
            />
          )}
          {tournament.status === 'IN_PROGRESS' && (
            <Button
              title="Enter Results"
              onPress={() => router.push(`/(dashboard)/tournaments/${id}/results` as never)}
              style={styles.statusBtn}
            />
          )}
        </Card>

        {/* Quick links */}
        <View style={styles.quickLinks}>
          <Button
            title="Registrations"
            variant="secondary"
            onPress={() => router.push(`/(dashboard)/tournaments/${id}/registrations` as never)}
            style={styles.quickBtn}
          />
          <Button
            title="Photos"
            variant="secondary"
            onPress={() => router.push(`/(dashboard)/tournaments/${id}/photos` as never)}
            style={styles.quickBtn}
          />
          {tournament.status === 'IN_PROGRESS' && (
            <Button
              title="Results"
              variant="secondary"
              onPress={() => router.push(`/(dashboard)/tournaments/${id}/results` as never)}
              style={styles.quickBtn}
            />
          )}
        </View>

        {/* Edit form */}
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Tournament Details</Text>

          <Input
            label="Title *"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
          />

          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={styles.multiline}
          />

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Format</Text>
            <View style={styles.chipRow}>
              {FORMAT_OPTIONS.map((f) => (
                <Button
                  key={f}
                  title={f}
                  variant={format === f ? 'primary' : 'secondary'}
                  onPress={() => setFormat(f)}
                  style={styles.chip}
                />
              ))}
            </View>
          </View>

          <Input
            label="Start Date (YYYY-MM-DD)"
            value={startDate}
            onChangeText={setStartDate}
          />

          <Input
            label="End Date (YYYY-MM-DD)"
            value={endDate}
            onChangeText={setEndDate}
            error={errors.endDate}
          />

          <Input label="City" value={city} onChangeText={setCity} />
          <Input label="Country" value={country} onChangeText={setCountry} />
          <Input label="Venue Address" value={venueAddress} onChangeText={setVenueAddress} />

          <Input
            label="Max Participants"
            value={maxParticipants}
            onChangeText={setMaxParticipants}
            keyboardType="numeric"
            error={errors.maxParticipants}
          />

          <Input
            label="Entry Fee"
            value={entryFee}
            onChangeText={setEntryFee}
            keyboardType="numeric"
          />

          <Input label="Currency" value={currency} onChangeText={setCurrency} />

          <Input
            label="Rating Limit"
            placeholder="e.g. 2200 (leave empty for open)"
            value={ratingLimit}
            onChangeText={setRatingLimit}
            keyboardType="numeric"
          />

          <Input
            label="Time Control"
            placeholder="e.g. 90+30, 15+10"
            value={timeControl}
            onChangeText={setTimeControl}
          />

          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={saving}
            disabled={saving}
            style={styles.saveBtn}
          />
        </View>

        {/* Participants section */}
        <View style={styles.participantsSection}>
          <Text style={styles.sectionTitle}>
            Participants ({participants.length})
          </Text>
          {participants.length === 0 && (
            <Text style={styles.noParticipants}>No participants yet.</Text>
          )}
          {participants.map((p) => {
            const pName = p.user
              ? `${p.user.name} ${p.user.surname}`
              : `${p.name || ''} ${p.surname || ''}`.trim() || 'Unknown';
            return (
              <Card key={p.id} style={styles.participantCard}>
                <View style={styles.participantRow}>
                  <View style={styles.participantInfo}>
                    <Text style={styles.participantName}>{pName}</Text>
                    {p.user?.email && (
                      <Text style={styles.participantEmail}>{p.user.email}</Text>
                    )}
                  </View>
                  <View style={styles.participantActions}>
                    {p.paid ? (
                      <Badge label="Paid" status="success" />
                    ) : (
                      <TouchableOpacity
                        onPress={() => handleMarkPaidCash(p)}
                        disabled={confirmingCash === p.id}
                      >
                        <Badge
                          label={confirmingCash === p.id ? 'Confirming...' : 'Mark Paid'}
                          status="warning"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </Card>
            );
          })}
        </View>

        <View style={styles.footerSpacer} />
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
  statusCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statusLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textMuted,
  },
  statusBtn: {
    marginTop: Spacing.sm,
  },
  quickLinks: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  quickBtn: {
    flex: 1,
  },
  form: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  fieldGroup: {
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    color: Colors.textMuted,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    marginBottom: Spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    minHeight: 40,
  },
  saveBtn: {
    marginTop: Spacing.lg,
  },
  participantsSection: {
    paddingHorizontal: Spacing.lg,
  },
  noParticipants: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  participantCard: {
    marginTop: Spacing.sm,
  },
  participantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  participantName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: Colors.text,
  },
  participantEmail: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  participantActions: {},
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['4xl'],
  },
  emptyText: {
    fontSize: Typography.sizes.base,
    color: Colors.textMuted,
  },
  footerSpacer: {
    height: Spacing['4xl'],
  },
});
