import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeContainer, Header } from '../../../components/layout';
import { Card, Button, LoadingSpinner, Badge } from '../../../components/ui';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import api from '../../../lib/api';

/**
 * Local payment UI state machine. Steps:
 *
 *   info        — show tournament fee + "Pay" button
 *   processing  — user was redirected to Stripe Checkout; waiting for webhook
 *                 NOTE: actual payment confirmation happens server-side via the
 *                 checkout.session.completed webhook, NOT by any polling here.
 *                 The user lands on /payment-success after Stripe redirects them
 *                 to success_url, which then checks Registration.status via API.
 *   success     — reached only if handleConfirmPayment (legacy manual confirm path) succeeds
 *   error       — reached only if handleConfirmPayment fails (legacy path)
 *
 * In the current Stripe Checkout flow (redirect mode), steps 'success' and 'error'
 * are NOT reached via the normal webhook path. The user is redirected away from this
 * screen to Stripe Checkout; on return they land on /payment-success, not here.
 * The handleConfirmPayment function and 'success'/'error' steps are retained for
 * backward compatibility / alternative flows.
 */
type PaymentStep = 'info' | 'processing' | 'success' | 'error';

interface TournamentInfo {
  id: string;
  title: string;
  fee: number | null;
  currency: string;
  city: string;
  country: string;
  startDate: string;
}

export default function PaymentScreen() {
  const { tournamentId } = useLocalSearchParams<{ tournamentId: string }>();
  const router = useRouter();
  const [tournament, setTournament] = useState<TournamentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<PaymentStep>('info');
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    async function fetchTournament() {
      try {
        setError(null);
        const res = await api.get(`/tournaments/${tournamentId}`);
        setTournament({
          id: res.data.id,
          title: res.data.title,
          fee: res.data.fee,
          currency: res.data.currency || 'USD',
          city: res.data.city,
          country: res.data.country,
          startDate: res.data.startDate,
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

  const handleInitiatePayment = useCallback(async () => {
    if (!tournamentId) return;
    try {
      setPaying(true);
      const res = await api.post(`/payments/tournament/${tournamentId}`);
      setPaymentId(res.data.paymentId);
      const checkoutUrl = res.data.checkoutUrl;
      if (checkoutUrl) {
        // Redirect to Stripe Checkout (web: opens in same tab; native: opens browser)
        await Linking.openURL(checkoutUrl);
        setStep('processing');
      } else {
        setStep('processing');
      }
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to initiate payment';
      Alert.alert('Error', message);
    } finally {
      setPaying(false);
    }
  }, [tournamentId]);

  const handleConfirmPayment = useCallback(async () => {
    if (!paymentId) return;
    try {
      setConfirming(true);
      await api.post(`/payments/${paymentId}/confirm`);
      setStep('success');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Payment confirmation failed';
      setStep('error');
      Alert.alert('Payment Failed', message);
    } finally {
      setConfirming(false);
    }
  }, [paymentId]);

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

  const fee = tournament.fee;
  const isFree = fee == null || fee === 0;

  function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  return (
    <SafeContainer>
      <Header title="Payment" showBack />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* Tournament info card */}
          <Card style={styles.card}>
            <Text style={styles.cardLabel}>Tournament</Text>
            <Text style={styles.tournamentTitle}>{tournament.title}</Text>
            <Text style={styles.tournamentMeta}>
              {tournament.city}, {tournament.country}
            </Text>
            <Text style={styles.tournamentMeta}>
              {formatDate(tournament.startDate)}
            </Text>
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Entry Fee</Text>
              <Text style={styles.feeValue}>
                {isFree ? 'Free' : `${fee} ${tournament.currency}`}
              </Text>
            </View>
          </Card>

          {/* Free tournament */}
          {isFree && (
            <Card style={styles.card}>
              <Text style={styles.infoText}>
                This tournament has no entry fee. You are all set!
              </Text>
            </Card>
          )}

          {/* Step: Info — show Pay button */}
          {!isFree && step === 'info' && (
            <>
              <Button
                title={`Pay Registration Fee: ${fee} ${tournament.currency}`}
                onPress={handleInitiatePayment}
                loading={paying}
                style={styles.payBtn}
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

          {/* Step: Processing — user was redirected to Stripe Checkout.
              The payment outcome is determined entirely server-side:
              - Success: Stripe calls POST /api/payments/webhook with checkout.session.completed
                         → Payment/Registration updated to PAID → user lands on /payment-success
              - Failure: Stripe calls POST /api/payments/webhook with payment_intent.payment_failed
                         → Payment updated to FAILED → Registration stays APPROVED (user can retry)
              - Expiry:  Stripe calls POST /api/payments/webhook with checkout.session.expired
                         → Payment → FAILED, Registration → EXPIRED
              This screen is no longer visible once the redirect happens; it is only shown
              if the user navigates back to this route manually while the session is open. */}
          {!isFree && step === 'processing' && (
            <Card style={styles.card}>
              <Text style={styles.confirmTitle}>Complete Payment</Text>
              <Text style={styles.mockNote}>
                You were redirected to the Stripe secure checkout page.
                After completing payment, your registration will be automatically confirmed.
              </Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount</Text>
                <Text style={styles.summaryValue}>{fee} {tournament.currency}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tournament</Text>
                <Text style={styles.summaryValue}>{tournament.title}</Text>
              </View>
              <View style={styles.divider} />
              <Button
                title="Back to Tournament"
                onPress={() => router.push(`/tournaments/${tournamentId}` as never)}
                variant="secondary"
                style={styles.confirmBtn}
              />
            </Card>
          )}

          {/* Step: Success — receipt */}
          {!isFree && step === 'success' && (
            <Card style={styles.card}>
              <View style={styles.receiptHeader}>
                <Badge label="Payment Successful" status="success" />
              </View>
              <View style={styles.receiptBody}>
                <Text style={styles.receiptTitle}>Payment Receipt</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Amount Paid</Text>
                  <Text style={styles.summaryValue}>{fee} {tournament.currency}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tournament</Text>
                  <Text style={styles.summaryValue}>{tournament.title}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Status</Text>
                  <Text style={[styles.summaryValue, styles.paidText]}>PAID</Text>
                </View>
                {paymentId && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Payment ID</Text>
                    <Text style={styles.summaryValueSmall}>{paymentId}</Text>
                  </View>
                )}
              </View>
              <View style={styles.divider} />
              <Button
                title="Back to Tournament"
                onPress={() => router.push(`/tournaments/${tournament.id}` as never)}
                style={styles.confirmBtn}
              />
            </Card>
          )}

          {/* Step: Error — shown when the legacy handleConfirmPayment call fails.
              In the current Stripe Checkout redirect flow, payment failures are surfaced
              via the Stripe-hosted UI (the user never returns to this screen on failure).
              This step exists as a fallback for non-redirect / manual confirmation paths. */}
          {!isFree && step === 'error' && (
            <Card style={styles.card}>
              <View style={styles.receiptHeader}>
                <Badge label="Payment Failed" status="error" />
              </View>
              <Text style={styles.errorMessage}>
                Something went wrong with your payment. Please try again.
              </Text>
              <Button
                title="Try Again"
                onPress={() => setStep('info')}
                style={styles.confirmBtn}
              />
            </Card>
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
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
  },
  card: {
    marginBottom: Spacing.lg,
  },
  cardLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  tournamentTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  tournamentMeta: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
    marginTop: Spacing.md,
  },
  feeLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  feeValue: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  payBtn: {
    marginBottom: Spacing.lg,
  },
  cashLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  cashText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    lineHeight: Typography.sizes.sm * Typography.lineHeights.relaxed,
  },
  infoText: {
    fontSize: Typography.sizes.sm,
    color: Colors.primary,
    textAlign: 'center',
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.sizes.sm,
  },
  // Confirm step
  confirmTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  summaryLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  summaryValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    maxWidth: '60%',
    textAlign: 'right',
  },
  summaryValueSmall: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    maxWidth: '60%',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  mockNote: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: Spacing.md,
  },
  confirmBtn: {
    marginBottom: Spacing.sm,
  },
  // Receipt
  receiptHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  receiptBody: {
    paddingHorizontal: Spacing.sm,
  },
  receiptTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  paidText: {
    color: Colors.primary,
    fontWeight: Typography.weights.bold,
  },
  errorMessage: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginVertical: Spacing.lg,
  },
});
