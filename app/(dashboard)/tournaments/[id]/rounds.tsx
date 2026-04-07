import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeContainer, Header } from '../../../../components/layout';
import { Button, Card, Badge, LoadingSpinner } from '../../../../components/ui';
import { Colors } from '../../../../constants/colors';
import { Spacing } from '../../../../constants/spacing';
import { Typography } from '../../../../constants/typography';
import api from '../../../../lib/api';

interface Pairing {
  id: string;
  player1Id: string;
  player2Id: string | null;
  result: string | null;
  board: number | null;
}

interface Round {
  id: string;
  roundNumber: number;
  status: string;
  pairings: Pairing[];
}

interface Participant {
  id: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    surname: string;
  };
}

const RESULT_OPTIONS = [
  { label: '-', value: null },
  { label: '1-0', value: '1-0' },
  { label: '0-1', value: '0-1' },
  { label: 'Draw', value: '0.5-0.5' },
];

export default function TournamentRoundsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [expandedRound, setExpandedRound] = useState<string | null>(null);

  const playerNameMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    for (const p of participants) {
      const uid = p.userId || p.user?.id || p.id;
      const name = p.user
        ? [p.user.name, p.user.surname].filter(Boolean).join(' ')
        : uid.slice(0, 8);
      map[uid] = name;
    }
    return map;
  }, [participants]);

  const fetchRounds = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get(`/tournaments/${id}/rounds`);
      setRounds(res.data);
    } catch {
      Alert.alert('Error', 'Failed to load rounds');
    }
  }, [id]);

  const fetchParticipants = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get(`/tournaments/${id}/registrations`);
      const data = Array.isArray(res.data) ? res.data : res.data.items || [];
      setParticipants(data);
    } catch {
      // Silent — participants are secondary
    }
  }, [id]);

  useEffect(() => {
    Promise.all([fetchRounds(), fetchParticipants()]).finally(() => setLoading(false));
  }, [fetchRounds, fetchParticipants]);

  const handleCreateRound = useCallback(async () => {
    if (!id) return;
    try {
      setCreating(true);
      const nextNumber = rounds.length > 0 ? Math.max(...rounds.map((r) => r.roundNumber)) + 1 : 1;
      await api.post(`/tournaments/${id}/rounds`, { roundNumber: nextNumber });
      await fetchRounds();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to create round';
      Alert.alert('Error', message);
    } finally {
      setCreating(false);
    }
  }, [id, rounds, fetchRounds]);

  const handleSetResult = useCallback(async (roundId: string, pairingId: string, result: string | null) => {
    if (!id) return;
    try {
      await api.patch(`/tournaments/${id}/rounds/${roundId}/pairings/${pairingId}`, { result });
      await fetchRounds();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to update result';
      Alert.alert('Error', message);
    }
  }, [id, fetchRounds]);

  if (loading) {
    return (
      <SafeContainer>
        <Header title="Manage Rounds" showBack />
        <LoadingSpinner />
      </SafeContainer>
    );
  }

  return (
    <SafeContainer>
      <Header title="Manage Rounds" showBack />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Button
            title={creating ? 'Creating...' : `Create Round ${rounds.length + 1}`}
            onPress={handleCreateRound}
            loading={creating}
            disabled={creating}
            style={styles.createBtn}
          />

          {rounds.length === 0 && (
            <Text style={styles.emptyText}>No rounds created yet.</Text>
          )}

          {rounds.map((round) => {
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
                  <View style={styles.pairingsSection}>
                    {round.pairings.length === 0 ? (
                      <Text style={styles.noPairings}>No pairings set for this round.</Text>
                    ) : (
                      round.pairings.map((p, idx) => (
                        <View key={p.id} style={[styles.pairingRow, idx % 2 === 0 && styles.pairingRowEven]}>
                          <Text style={styles.pairingBoard}>{p.board ?? idx + 1}</Text>
                          <View style={styles.pairingPlayers}>
                            <Text style={styles.pairingName} numberOfLines={1}>
                              {playerNameMap[p.player1Id] || p.player1Id.slice(0, 8)}
                            </Text>
                            <Text style={styles.vsText}>vs</Text>
                            <Text style={styles.pairingName} numberOfLines={1}>
                              {p.player2Id ? (playerNameMap[p.player2Id] || p.player2Id.slice(0, 8)) : 'BYE'}
                            </Text>
                          </View>
                          <View style={styles.resultBtns}>
                            {RESULT_OPTIONS.map((opt) => {
                              const isActive = p.result === opt.value;
                              return (
                                <TouchableOpacity
                                  key={opt.label}
                                  style={[styles.resultBtn, isActive && styles.resultBtnActive]}
                                  onPress={() => handleSetResult(round.id, p.id, opt.value)}
                                  activeOpacity={0.7}
                                >
                                  <Text style={[styles.resultBtnText, isActive && styles.resultBtnTextActive]}>
                                    {opt.label}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </View>
                      ))
                    )}
                  </View>
                )}
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
  container: {
    padding: Spacing.lg,
    maxWidth: 430,
    alignSelf: 'center' as const,
    width: '100%',
  },
  createBtn: {
    marginBottom: Spacing.lg,
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing['3xl'],
  },
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
  pairingsSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: Spacing.sm,
  },
  noPairings: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing.md,
  },
  pairingRow: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: 6,
  },
  pairingRowEven: {
    backgroundColor: Colors.backgroundAlt + '44',
  },
  pairingBoard: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  pairingPlayers: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  pairingName: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    fontWeight: Typography.weights.medium,
  },
  vsText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginHorizontal: Spacing.sm,
  },
  resultBtns: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  resultBtn: {
    flex: 1,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  resultBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  resultBtnText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
  resultBtnTextActive: {
    color: Colors.white,
  },
  footerSpacer: {
    height: Spacing['4xl'],
  },
});
