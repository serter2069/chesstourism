import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import api from '../../lib/api';

type CertData = {
  participantName: string;
  tournamentName: string;
  place: number | null;
  date: string;
  status: 'valid' | 'revoked';
};

export default function VerifyCertificateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<CertData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) { setError(true); setLoading(false); return; }

    api.get(`/verify/${id}`)
      .then((res) => setData(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.gold} />
        <Text style={styles.loadingText}>Verifying certificate...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.chessPiece}>{'\u265A'}</Text>
        <Text style={styles.errorTitle}>Certificate Not Found</Text>
        <Text style={styles.errorSubtitle}>
          This certificate ID does not exist or has been removed.
        </Text>
      </View>
    );
  }

  const isValid = data.status === 'valid';
  const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.center}>
      <View style={styles.card}>
        <Text style={styles.chessPiece}>{'\u265F'}</Text>

        <Text style={styles.orgName}>IACT</Text>
        <Text style={styles.orgSubtitle}>International Association of Chess Tourism</Text>

        <View style={styles.divider} />

        <Text style={styles.label}>Certificate of Participation</Text>
        <Text style={styles.participantName}>{data.participantName}</Text>

        <Text style={styles.tournamentName}>{data.tournamentName}</Text>

        {data.place && (
          <Text style={styles.placeText}>Place: {data.place}</Text>
        )}

        <Text style={styles.dateText}>{formattedDate}</Text>

        <View style={styles.divider} />

        <View style={[styles.badge, isValid ? styles.badgeValid : styles.badgeRevoked]}>
          <Text style={[styles.badgeText, isValid ? styles.badgeTextValid : styles.badgeTextRevoked]}>
            {isValid ? 'IACT Verified \u2713' : 'Revoked'}
          </Text>
        </View>

        <Text style={styles.certId}>ID: {id}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundAlt,
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: Spacing['2xl'],
    maxWidth: 430,
    width: '100%',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chessPiece: {
    fontSize: Typography.sizes.iconLg,
    marginBottom: Spacing.md,
  },
  orgName: {
    fontFamily: Typography.fontFamilyHeading,
    fontSize: Typography.sizes['3xl'],
    color: Colors.primary,
    letterSpacing: 4,
  },
  orgSubtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: Colors.gold,
    marginVertical: Spacing.lg,
  },
  label: {
    fontFamily: Typography.fontFamilyMedium,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  participantName: {
    fontFamily: Typography.fontFamilyHeading,
    fontSize: Typography.sizes['2xl'],
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  tournamentName: {
    fontFamily: Typography.fontFamilySemiBold,
    fontSize: Typography.sizes.base,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  placeText: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.lg,
    color: Colors.gold,
    marginBottom: Spacing.sm,
  },
  dateText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  badge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 24,
  },
  badgeValid: {
    backgroundColor: Colors.statusSuccessBg,
  },
  badgeRevoked: {
    backgroundColor: Colors.statusErrorBg,
  },
  badgeText: {
    fontFamily: Typography.fontFamilyBold,
    fontSize: Typography.sizes.sm,
    letterSpacing: 1,
  },
  badgeTextValid: {
    color: Colors.eloPositive,
  },
  badgeTextRevoked: {
    color: Colors.error,
  },
  certId: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },
  loadingText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },
  errorTitle: {
    fontFamily: Typography.fontFamilyHeading,
    fontSize: Typography.sizes.xl,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  errorSubtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    maxWidth: 300,
  },
});
