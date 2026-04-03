import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeContainer, Header } from '../components/layout';
import { Button, Card } from '../components/ui';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { Typography } from '../constants/typography';
import api from '../lib/api';

export default function PaymentSuccessScreen() {
  const { tournamentId } = useLocalSearchParams<{ tournamentId?: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'paid' | 'pending'>('loading');

  useEffect(() => {
    async function checkStatus() {
      if (!tournamentId) { setStatus('paid'); return; }
      try {
        const res = await api.get(`/tournaments/${tournamentId}/my-registration`);
        setStatus(res.data.status === 'PAID' ? 'paid' : 'pending');
      } catch {
        setStatus('paid');
      }
    }
    // Small delay for webhook to process
    const timer = setTimeout(checkStatus, 2000);
    return () => clearTimeout(timer);
  }, [tournamentId]);

  return (
    <SafeContainer>
      <Header title="Payment" showBack={false} />
      <View style={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.icon}>{'♔'}</Text>
          <Text style={styles.title}>
            {status === 'loading' ? 'Confirming payment...' : 'Payment Complete!'}
          </Text>
          <Text style={styles.subtitle}>
            {status === 'loading'
              ? 'Please wait while we verify your payment.'
              : 'Your registration has been confirmed. See you at the tournament!'}
          </Text>
          {status !== 'loading' && (
            <>
              {tournamentId && (
                <Button
                  title="View Tournament"
                  onPress={() => router.push(`/tournaments/${tournamentId}` as never)}
                  style={styles.btn}
                />
              )}
              <Button
                title="My Registrations"
                onPress={() => router.push('/(dashboard)/my-registrations' as never)}
                variant="secondary"
                style={styles.btn}
              />
            </>
          )}
        </Card>
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    alignItems: 'center',
    padding: Spacing['2xl'],
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
  },
  icon: {
    fontSize: 56,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: Typography.sizes.sm * 1.5,
    marginBottom: Spacing.xl,
  },
  btn: {
    width: '100%',
    marginBottom: Spacing.sm,
  },
});
