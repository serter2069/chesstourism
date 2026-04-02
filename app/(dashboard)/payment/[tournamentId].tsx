import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeContainer, Header } from '../../../components/layout';
import { Card, Button, LoadingSpinner } from '../../../components/ui';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import api from '../../../lib/api';

interface TournamentInfo {
  id: string;
  title: string;
  entryFee: number | null;
  currency: string;
}

export default function PaymentScreen() {
  const { tournamentId } = useLocalSearchParams<{ tournamentId: string }>();
  const [tournament, setTournament] = useState<TournamentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTournament() {
      try {
        setError(null);
        const res = await api.get(`/tournaments/${tournamentId}`);
        setTournament({
          id: res.data.id,
          title: res.data.title,
          entryFee: res.data.entryFee,
          currency: res.data.currency || 'EUR',
        });
      } catch {
        setError('Failed to load tournament details');
      } finally {
        setLoading(false);
      }
    }
    if (tournamentId) {
      fetchTournament();
    }
  }, [tournamentId]);

  const handleStripePay = () => {
    Alert.alert('Coming Soon', 'Stripe payment integration will be available soon.');
  };

  if (loading) {
    return (
      <SafeContainer>
        <Header title="Payment" showBack />
        <LoadingSpinner />
      </SafeContainer>
    );
  }

  if (error || !tournament) {
    return (
      <SafeContainer>
        <Header title="Payment" showBack />
        <View style={styles.container}>
          <Card>
            <Text style={styles.errorText}>{error || 'Tournament not found'}</Text>
          </Card>
        </View>
      </SafeContainer>
    );
  }

  const fee = tournament.entryFee;
  const isFree = fee == null || fee === 0;

  return (
    <SafeContainer>
      <Header title="Payment" showBack />
      <View style={styles.container}>
        {/* Tournament info */}
        <Card style={styles.card}>
          <Text style={styles.cardLabel}>Tournament</Text>
          <Text style={styles.tournamentTitle}>{tournament.title}</Text>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Entry Fee</Text>
            <Text style={styles.feeValue}>
              {isFree ? 'Free' : `${fee} ${tournament.currency}`}
            </Text>
          </View>
        </Card>

        {/* Payment options */}
        {isFree ? (
          <Card style={styles.card}>
            <Text style={styles.infoText}>
              This tournament has no entry fee. You are all set!
            </Text>
          </Card>
        ) : (
          <>
            <Button
              title="Pay via Stripe"
              onPress={handleStripePay}
              style={styles.stripeBtn}
            />

            <Card style={styles.card}>
              <Text style={styles.cashLabel}>Pay Cash at Tournament</Text>
              <Text style={styles.cashText}>
                You can also pay the entry fee in cash at the tournament venue on the day of the event.
                Please bring the exact amount if possible.
              </Text>
            </Card>
          </>
        )}
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  card: {
    marginBottom: Spacing.lg,
  },
  cardLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  tournamentTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderDefault,
    paddingTop: Spacing.md,
  },
  feeLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  feeValue: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.brandPrimary,
  },
  stripeBtn: {
    marginBottom: Spacing.lg,
  },
  cashLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  cashText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.sizes.sm * Typography.lineHeights.relaxed,
  },
  infoText: {
    fontSize: Typography.sizes.sm,
    color: Colors.statusSuccess,
    textAlign: 'center',
  },
  errorText: {
    color: Colors.statusError,
    fontSize: Typography.sizes.sm,
  },
});
