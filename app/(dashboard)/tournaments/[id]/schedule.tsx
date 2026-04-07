import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeContainer, Header } from '../../../../components/layout';
import { Button, Card, LoadingSpinner } from '../../../../components/ui';
import { Colors } from '../../../../constants/colors';
import { Spacing } from '../../../../constants/spacing';
import { Typography } from '../../../../constants/typography';
import api from '../../../../lib/api';

interface ScheduleEntry {
  id: string;
  title: string;
  description?: string | null;
  startTime: string;
  endTime?: string | null;
  venue?: string | null;
  roundNumber?: number | null;
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ScheduleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSchedule = useCallback(async () => {
    if (!id) return;
    try {
      setError(null);
      const res = await api.get(`/tournaments/${id}/schedule`);
      setEntries(res.data);
    } catch {
      setError('Failed to load schedule');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSchedule();
  }, [fetchSchedule]);

  const handleCreate = useCallback(async () => {
    const trimmedTitle = title.trim();
    const trimmedStartTime = startTime.trim();
    if (!trimmedTitle || !trimmedStartTime) {
      Alert.alert('Error', 'Title and start time are required');
      return;
    }
    const start = new Date(trimmedStartTime);
    if (isNaN(start.getTime())) {
      Alert.alert('Error', 'Invalid start time format. Use ISO format: YYYY-MM-DDTHH:mm');
      return;
    }
    try {
      setCreating(true);
      await api.post(`/tournaments/${id}/schedule`, {
        title: trimmedTitle,
        startTime: trimmedStartTime,
        endTime: endTime.trim() || undefined,
        description: description.trim() || undefined,
        venue: venue.trim() || undefined,
      });
      setTitle('');
      setStartTime('');
      setEndTime('');
      setDescription('');
      setVenue('');
      await fetchSchedule();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to create schedule entry';
      Alert.alert('Error', message);
    } finally {
      setCreating(false);
    }
  }, [id, title, startTime, endTime, description, venue, fetchSchedule]);

  const handleDelete = useCallback((entryId: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this schedule entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingId(entryId);
              await api.delete(`/tournaments/${id}/schedule/${entryId}`);
              await fetchSchedule();
            } catch (err: unknown) {
              const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to delete entry';
              Alert.alert('Error', message);
            } finally {
              setDeletingId(null);
            }
          },
        },
      ],
    );
  }, [id, fetchSchedule]);

  if (loading) {
    return (
      <SafeContainer>
        <Header title="Schedule" showBack />
        <LoadingSpinner />
      </SafeContainer>
    );
  }

  return (
    <SafeContainer>
      <Header title="Schedule" showBack />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Create form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Schedule Entry</Text>
          <Card style={styles.formCard}>
            <TextInput
              style={styles.input}
              placeholder="Title (e.g. Round 1)"
              placeholderTextColor={Colors.textMuted}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Start time (YYYY-MM-DDTHH:mm)"
              placeholderTextColor={Colors.textMuted}
              value={startTime}
              onChangeText={setStartTime}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="End time (optional, YYYY-MM-DDTHH:mm)"
              placeholderTextColor={Colors.textMuted}
              value={endTime}
              onChangeText={setEndTime}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Venue (optional)"
              placeholderTextColor={Colors.textMuted}
              value={venue}
              onChangeText={setVenue}
            />
            <TextInput
              style={[styles.input, styles.descInput]}
              placeholder="Description (optional)"
              placeholderTextColor={Colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <Button
              title="Add Entry"
              onPress={handleCreate}
              loading={creating}
            />
          </Card>
        </View>

        {/* List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule Entries</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
          {entries.length === 0 ? (
            <Text style={styles.emptyText}>No schedule entries yet.</Text>
          ) : (
            entries.map((entry) => (
              <Card key={entry.id} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>
                    {entry.roundNumber != null ? `Round ${entry.roundNumber}: ` : ''}{entry.title}
                  </Text>
                </View>
                <Text style={styles.entryTime}>
                  {formatDateTime(entry.startTime)}
                  {entry.endTime ? ` — ${new Date(entry.endTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}` : ''}
                </Text>
                {entry.venue && <Text style={styles.entryVenue}>{entry.venue}</Text>}
                {entry.description && <Text style={styles.entryDesc}>{entry.description}</Text>}
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
                >
                  <Text style={styles.deleteBtnText}>
                    {deletingId === entry.id ? 'Deleting...' : 'Delete'}
                  </Text>
                </TouchableOpacity>
              </Card>
            ))
          )}
        </View>
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
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  formCard: {
    padding: Spacing.md,
    gap: Spacing.sm,
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
  },
  descInput: {
    minHeight: 80,
  },
  entryCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  entryHeader: {
    marginBottom: Spacing.xs,
  },
  entryTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  entryTime: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
    marginBottom: Spacing.xs,
  },
  entryVenue: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  entryDesc: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    lineHeight: Typography.sizes.sm * 1.5,
    marginBottom: Spacing.sm,
  },
  deleteBtn: {
    marginTop: Spacing.xs,
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: 4,
    backgroundColor: Colors.error + '22',
  },
  deleteBtnText: {
    fontSize: Typography.sizes.xs,
    color: Colors.error,
    fontWeight: Typography.weights.medium,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing['3xl'],
  },
});
