import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { SafeContainer, Header } from '../../../components/layout';
import { Button, Input, Badge } from '../../../components/ui';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import { useAuth } from '../../../store/auth';
import api from '../../../lib/api';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'https://chesstourism.smartlaunchhub.com/api';

interface FideLookupResult {
  name: string | null;
  rating: number | null;
  country: string | null;
  title: string | null;
}

const TITLE_LABELS: Record<string, string> = {
  GM: 'Grandmaster',
  IM: 'International Master',
  FM: 'FIDE Master',
  CM: 'Candidate Master',
  WGM: 'Woman Grandmaster',
  WIM: 'Woman International Master',
  WFM: 'Woman FIDE Master',
  WCM: 'Woman Candidate Master',
};

export default function ProfileScreen() {
  const { user, loadUser } = useAuth();

  const [fideId, setFideId] = useState(user?.fideId || '');
  const [lookupResult, setLookupResult] = useState<FideLookupResult | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [certLoading, setCertLoading] = useState(false);

  async function handleDownloadCertificate() {
    setCertLoading(true);
    try {
      const res = await api.get('/profile/download-token');
      const { downloadToken } = res.data;
      const url = `${API_BASE}/profile/membership-certificate?token=${encodeURIComponent(downloadToken)}`;
      await Linking.openURL(url);
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to download certificate';
      Alert.alert('Error', msg);
    } finally {
      setCertLoading(false);
    }
  }

  async function handleLookup() {
    const cleanId = fideId.trim();
    if (!cleanId) {
      setError('Please enter a FIDE ID');
      return;
    }
    if (!/^\d{3,12}$/.test(cleanId)) {
      setError('FIDE ID must be 3-12 digits');
      return;
    }

    setError(null);
    setSuccess(null);
    setLookupResult(null);
    setLookupLoading(true);

    try {
      const res = await api.post('/profile/fide-lookup', { fideId: cleanId });
      setLookupResult(res.data);
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'FIDE ID not found';
      setError(msg);
    } finally {
      setLookupLoading(false);
    }
  }

  async function handleSave() {
    if (!lookupResult) return;

    setError(null);
    setSuccess(null);
    setSaveLoading(true);

    try {
      await api.put('/profile/fide', {
        fideId: fideId.trim(),
        fideRating: lookupResult.rating,
        fideTitle: lookupResult.title,
      });
      await loadUser();
      setSuccess('FIDE profile saved successfully');
      setLookupResult(null);
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to save FIDE data';
      setError(msg);
    } finally {
      setSaveLoading(false);
    }
  }

  const hasFide = user?.fideId && user?.fideRating;

  return (
    <SafeContainer>
      <Header title="Profile" showBack />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Current FIDE badge */}
        {hasFide && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>FIDE Profile</Text>
            <View style={styles.fideBadgeRow}>
              <View style={styles.fideBadge}>
                {user.fideTitle && (
                  <Text style={styles.fideTitleText}>{user.fideTitle}</Text>
                )}
                <Text style={styles.fideRatingText}>{user.fideRating}</Text>
              </View>
              <View style={styles.fideDetails}>
                <Text style={styles.fideIdLabel}>FIDE ID: {user.fideId}</Text>
                {user.fideTitle && (
                  <Text style={styles.fideTitleLabel}>
                    {TITLE_LABELS[user.fideTitle] || user.fideTitle}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* FIDE ID Lookup */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {hasFide ? 'Update FIDE ID' : 'Link FIDE ID'}
          </Text>
          <Text style={styles.description}>
            Enter your FIDE ID to verify your rating and title.
            Find your ID at ratings.fide.com
          </Text>

          <Input
            label="FIDE ID"
            value={fideId}
            onChangeText={(text) => {
              setFideId(text.replace(/\D/g, ''));
              setError(null);
              setSuccess(null);
              setLookupResult(null);
            }}
            placeholder="e.g. 4100018"
            keyboardType="numeric"
            maxLength={12}
          />

          <Button
            title="Verify"
            onPress={handleLookup}
            loading={lookupLoading}
            disabled={!fideId.trim()}
            variant="secondary"
          />

          {/* Lookup result */}
          {lookupResult && (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Profile Found</Text>

              {lookupResult.name && (
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Name</Text>
                  <Text style={styles.resultValue}>{lookupResult.name}</Text>
                </View>
              )}

              {lookupResult.rating && (
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Rating</Text>
                  <Text style={styles.resultValue}>{lookupResult.rating}</Text>
                </View>
              )}

              {lookupResult.title && (
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Title</Text>
                  <View style={styles.titleBadgeWrap}>
                    <Badge
                      label={lookupResult.title}
                      status="info"
                    />
                    <Text style={styles.titleFullName}>
                      {TITLE_LABELS[lookupResult.title] || lookupResult.title}
                    </Text>
                  </View>
                </View>
              )}

              {lookupResult.country && (
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Country</Text>
                  <Text style={styles.resultValue}>{lookupResult.country}</Text>
                </View>
              )}

              <View style={styles.saveButtonWrap}>
                <Button
                  title="Save to Profile"
                  onPress={handleSave}
                  loading={saveLoading}
                />
              </View>
            </View>
          )}

          {/* Error */}
          {error && (
            <View style={styles.messageBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Success */}
          {success && (
            <View style={[styles.messageBox, styles.successBox]}>
              <Text style={styles.successText}>{success}</Text>
            </View>
          )}
        </View>

        {/* Membership certificate download */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Membership Certificate</Text>
          <Text style={styles.description}>
            Download your membership certificate as a PDF file.
          </Text>
          <Button
            title="Download Certificate"
            onPress={handleDownloadCertificate}
            loading={certLoading}
            variant="secondary"
          />
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
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  // Current FIDE badge
  fideBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  fideBadge: {
    backgroundColor: Colors.gold,
    borderRadius: 8,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    minWidth: 72,
  },
  fideTitleText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  fideRatingText: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: '#FFFFFF',
  },
  fideDetails: {
    marginLeft: Spacing.lg,
    flex: 1,
  },
  fideIdLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  fideTitleLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  // Lookup result
  resultCard: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resultTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resultLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  resultValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  titleBadgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  titleFullName: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  saveButtonWrap: {
    marginTop: Spacing.lg,
  },
  // Messages
  messageBox: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: 4,
    backgroundColor: Colors.statusErrorBg,
  },
  successBox: {
    backgroundColor: Colors.statusSuccessBg,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.sizes.sm,
  },
  successText: {
    color: Colors.primary,
    fontSize: Typography.sizes.sm,
  },
});
