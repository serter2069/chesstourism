import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeContainer, Header } from '../../../components/layout';
import { Button, Input } from '../../../components/ui';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import { useAuth } from '../../../store/auth';
import api from '../../../lib/api';

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

// Format DateTime from server (ISO string) to YYYY-MM-DD for display/editing
function toDateString(val?: string | null): string {
  if (!val) return '';
  return val.slice(0, 10); // "2025-01-15T00:00:00.000Z" -> "2025-01-15"
}

export default function ProfileScreen() {
  const { user, loadUser } = useAuth();

  // ── Personal Info state ──────────────────────────────────
  const [name, setName] = useState(user?.name || '');
  const [surname, setSurname] = useState(user?.surname || '');
  const [country, setCountry] = useState(user?.country || '');
  const [birthDate, setBirthDate] = useState(toDateString(user?.birthDate));
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoError, setInfoError] = useState<string | null>(null);
  const [infoSuccess, setInfoSuccess] = useState<string | null>(null);

  // ── FIDE state ───────────────────────────────────────────
  const [fideId, setFideId] = useState(user?.fideId || '');
  const [fideRating, setFideRating] = useState(
    user?.fideRating ? String(user.fideRating) : ''
  );
  const [fideTitle, setFideTitle] = useState(user?.fideTitle || '');
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ── Personal Info save ───────────────────────────────────
  async function handleInfoSave() {
    // Validate birthDate if provided
    if (birthDate.trim()) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate.trim())) {
        setInfoError('Birth date must be in YYYY-MM-DD format (e.g. 1990-01-15)');
        return;
      }
      const parsed = new Date(birthDate.trim());
      if (isNaN(parsed.getTime())) {
        setInfoError('Invalid birth date');
        return;
      }
    }

    setInfoError(null);
    setInfoSuccess(null);
    setInfoLoading(true);

    try {
      await api.put('/users/me', {
        name: name.trim() || undefined,
        surname: surname.trim() || undefined,
        country: country.trim() || undefined,
        birthDate: birthDate.trim() || undefined,
      });
      await loadUser();
      setInfoSuccess('Personal info saved');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to save personal info';
      setInfoError(msg);
    } finally {
      setInfoLoading(false);
    }
  }

  // ── FIDE save ────────────────────────────────────────────
  async function handleSave() {
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
    setSaveLoading(true);

    const parsedRating = parseInt(fideRating.trim(), 10);
    const cleanTitle = fideTitle.trim().toUpperCase();

    try {
      await api.put('/profile/fide', {
        fideId: cleanId,
        fideRating: isNaN(parsedRating) ? undefined : parsedRating,
        fideTitle: cleanTitle || undefined,
      });
      await loadUser();
      setSuccess('FIDE profile saved successfully');
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
        {/* ── Personal Info section ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Info</Text>

          <Input
            label="First Name"
            value={name}
            onChangeText={(text) => { setName(text); setInfoError(null); setInfoSuccess(null); }}
            placeholder="e.g. Magnus"
            autoCapitalize="words"
          />

          <Input
            label="Surname"
            value={surname}
            onChangeText={(text) => { setSurname(text); setInfoError(null); setInfoSuccess(null); }}
            placeholder="e.g. Carlsen"
            autoCapitalize="words"
          />

          <Input
            label="Country"
            value={country}
            onChangeText={(text) => { setCountry(text); setInfoError(null); setInfoSuccess(null); }}
            placeholder="e.g. Norway"
            autoCapitalize="words"
          />

          <Input
            label="Birth Date"
            value={birthDate}
            onChangeText={(text) => { setBirthDate(text); setInfoError(null); setInfoSuccess(null); }}
            placeholder="YYYY-MM-DD (e.g. 1990-11-30)"
            keyboardType="numeric"
            maxLength={10}
          />

          <Button
            title="Save Personal Info"
            onPress={handleInfoSave}
            loading={infoLoading}
          />

          {infoError && (
            <View style={styles.messageBox}>
              <Text style={styles.errorText}>{infoError}</Text>
            </View>
          )}
          {infoSuccess && (
            <View style={[styles.messageBox, styles.successBox]}>
              <Text style={styles.successText}>{infoSuccess}</Text>
            </View>
          )}
        </View>

        {/* ── Current FIDE badge ── */}
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

        {/* ── FIDE fields — text entry ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {hasFide ? 'Update FIDE Profile' : 'Link FIDE Profile'}
          </Text>
          <Text style={styles.description}>
            Enter your FIDE ID and rating manually.
            Find your ID at ratings.fide.com
          </Text>

          <Input
            label="FIDE ID"
            value={fideId}
            onChangeText={(text) => {
              setFideId(text.replace(/\D/g, ''));
              setError(null);
              setSuccess(null);
            }}
            placeholder="e.g. 4100018"
            keyboardType="numeric"
            maxLength={12}
          />

          <Input
            label="FIDE Rating (optional)"
            value={fideRating}
            onChangeText={(text) => {
              setFideRating(text.replace(/\D/g, ''));
              setError(null);
              setSuccess(null);
            }}
            placeholder="e.g. 2100"
            keyboardType="numeric"
            maxLength={4}
          />

          <Input
            label="FIDE Title (optional)"
            value={fideTitle}
            onChangeText={(text) => {
              setFideTitle(text);
              setError(null);
              setSuccess(null);
            }}
            placeholder="e.g. GM, IM, FM, CM"
            autoCapitalize="characters"
            maxLength={3}
          />

          <Button
            title="Save FIDE Profile"
            onPress={handleSave}
            loading={saveLoading}
            disabled={!fideId.trim()}
          />

          {error && (
            <View style={styles.messageBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {success && (
            <View style={[styles.messageBox, styles.successBox]}>
              <Text style={styles.successText}>{success}</Text>
            </View>
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
    color: Colors.white,
    letterSpacing: 1,
  },
  fideRatingText: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
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
