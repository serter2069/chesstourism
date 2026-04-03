import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeContainer, Header } from '../../../../components/layout';
import { Button, Card, Input, LoadingSpinner } from '../../../../components/ui';
import { Colors } from '../../../../constants/colors';
import { Spacing } from '../../../../constants/spacing';
import { Typography } from '../../../../constants/typography';
import api from '../../../../lib/api';

interface Participant {
  id: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    surname: string;
  };
  name?: string;
  surname?: string;
}

interface ResultEntry {
  userId: string;
  place: string;
  score: string;
}

export default function TournamentResultsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchParticipants = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tournaments/${id}/participants`);
      const data = res.data;
      const items: Participant[] = Array.isArray(data) ? data : data.items || data.participants || [];
      setParticipants(items);

      // Initialize results entries
      setResults(
        items.map((p) => ({
          userId: p.userId || p.user?.id || p.id,
          place: '',
          score: '',
        })),
      );
    } catch {
      Alert.alert('Error', 'Failed to load participants');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  function updateResult(index: number, field: 'place' | 'score', value: string) {
    setResults((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  async function handleSubmit() {
    // Validate — all participants need a place
    const hasEmpty = results.some((r) => !r.place.trim());
    if (hasEmpty) {
      Alert.alert('Validation', 'Please enter a place for every participant.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = results.map((r) => ({
        userId: r.userId,
        place: parseInt(r.place, 10),
        score: r.score ? parseFloat(r.score) : undefined,
      }));

      await api.post(`/tournaments/${id}/results`, payload);
      Alert.alert('Success', 'Results submitted and tournament completed.');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to submit results';
      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <SafeContainer>
        <Header title="Enter Results" showBack />
        <LoadingSpinner />
      </SafeContainer>
    );
  }

  return (
    <SafeContainer>
      <Header title="Enter Results" showBack />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.subtitle}>
            Enter place and score for each participant.
          </Text>

          {participants.length === 0 && (
            <Text style={styles.noData}>No participants to score.</Text>
          )}

          {participants.map((p, index) => {
            const pName = p.user
              ? [p.user.name, p.user.surname].filter(Boolean).join(' ')
              : [p.name, p.surname].filter(Boolean).join(' ') || 'Unknown';

            return (
              <Card key={p.id} style={styles.resultCard}>
                <Text style={styles.participantName}>{pName}</Text>
                <View style={styles.inputRow}>
                  <View style={styles.inputCol}>
                    <Input
                      label="Place"
                      placeholder="1"
                      value={results[index]?.place || ''}
                      onChangeText={(v) => updateResult(index, 'place', v)}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.inputCol}>
                    <Input
                      label="Score"
                      placeholder="0.0"
                      value={results[index]?.score || ''}
                      onChangeText={(v) => updateResult(index, 'score', v)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </Card>
            );
          })}

          {participants.length > 0 && (
            <Button
              title="Submit Results & Complete Tournament"
              onPress={handleSubmit}
              loading={submitting}
              disabled={submitting}
              style={styles.submitBtn}
            />
          )}
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
  container: {
    padding: Spacing.lg,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
  },
  noData: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  resultCard: {
    marginBottom: Spacing.md,
  },
  participantName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  inputCol: {
    flex: 1,
  },
  submitBtn: {
    marginTop: Spacing.lg,
  },
  footerSpacer: {
    height: Spacing['4xl'],
  },
});
