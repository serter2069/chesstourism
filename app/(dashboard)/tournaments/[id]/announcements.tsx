import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeContainer, Header } from '../../../../components/layout';
import { Button, Card, Badge, LoadingSpinner } from '../../../../components/ui';
import { Colors } from '../../../../constants/colors';
import { Spacing } from '../../../../constants/spacing';
import { Typography } from '../../../../constants/typography';
import api from '../../../../lib/api';

interface Announcement {
  id: string;
  title: string;
  body: string;
  published: boolean;
  createdAt: string;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AnnouncementsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [creating, setCreating] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const fetchAnnouncements = useCallback(async () => {
    if (!id) return;
    try {
      setError(null);
      const res = await api.get(`/tournaments/${id}/announcements`);
      setAnnouncements(res.data);
    } catch {
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleCreate = useCallback(async () => {
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    if (!trimmedTitle || !trimmedBody) {
      Alert.alert('Error', 'Title and body are required');
      return;
    }
    try {
      setCreating(true);
      await api.post(`/tournaments/${id}/announcements`, {
        title: trimmedTitle,
        body: trimmedBody,
      });
      setTitle('');
      setBody('');
      await fetchAnnouncements();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to create announcement';
      Alert.alert('Error', message);
    } finally {
      setCreating(false);
    }
  }, [id, title, body, fetchAnnouncements]);

  const handlePublish = useCallback(async (annId: string) => {
    Alert.alert(
      'Publish Announcement',
      'This will email all registered participants. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Publish',
          onPress: async () => {
            try {
              setPublishingId(annId);
              await api.patch(`/tournaments/${id}/announcements/${annId}/publish`);
              await fetchAnnouncements();
            } catch (err: unknown) {
              const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to publish';
              Alert.alert('Error', message);
            } finally {
              setPublishingId(null);
            }
          },
        },
      ],
    );
  }, [id, fetchAnnouncements]);

  if (loading) {
    return (
      <SafeContainer>
        <Header title="Announcements" showBack />
        <LoadingSpinner />
      </SafeContainer>
    );
  }

  return (
    <SafeContainer>
      <Header title="Announcements" showBack />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        {/* Create form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Post Announcement</Text>
          <Card style={styles.formCard}>
            <TextInput
              style={styles.input}
              placeholder="Title"
              placeholderTextColor={Colors.textMuted}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.bodyInput]}
              placeholder="Announcement body..."
              placeholderTextColor={Colors.textMuted}
              value={body}
              onChangeText={setBody}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Button
              title="Create Draft"
              onPress={handleCreate}
              loading={creating}
            />
          </Card>
        </View>

        {/* List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Announcements</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
          {announcements.length === 0 ? (
            <Text style={styles.emptyText}>No announcements yet.</Text>
          ) : (
            announcements.map((ann) => (
              <Card key={ann.id} style={styles.annCard}>
                <View style={styles.annHeader}>
                  <Text style={styles.annTitle}>{ann.title}</Text>
                  <Badge
                    label={ann.published ? 'Published' : 'Draft'}
                    status={ann.published ? 'success' : 'warning'}
                  />
                </View>
                <Text style={styles.annBody}>{ann.body}</Text>
                <Text style={styles.annDate}>{formatDate(ann.createdAt)}</Text>
                {!ann.published && (
                  <View style={styles.publishRow}>
                    <Button
                      title={publishingId === ann.id ? 'Publishing...' : 'Publish & Email Participants'}
                      onPress={() => handlePublish(ann.id)}
                      loading={publishingId === ann.id}
                      variant="secondary"
                    />
                  </View>
                )}
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
    maxWidth: 430,
    alignSelf: 'center' as const,
    width: '100%',
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
  bodyInput: {
    minHeight: 100,
  },
  annCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  annHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  annTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  annBody: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    lineHeight: Typography.sizes.sm * 1.5,
    marginBottom: Spacing.sm,
  },
  annDate: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  publishRow: {
    marginTop: Spacing.sm,
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
