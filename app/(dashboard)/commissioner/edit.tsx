import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeContainer, Header } from '../../../components/layout';
import { Button, Input, LoadingSpinner } from '../../../components/ui';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import api from '../../../lib/api';

export default function CommissionerEditScreen() {
  const router = useRouter();

  const [bio, setBio] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/commissars/profile');
        const p = res.data;
        setBio(p.bio || '');
        setSpecialization(p.specialization || '');
        setCountry(p.country || '');
        setCity(p.city || '');
        setPhotoUrl(p.photoUrl || '');
      } catch (err: any) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await api.put('/commissars/profile', {
        bio: bio.trim() || null,
        specialization: specialization.trim() || null,
        country: country.trim() || null,
        city: city.trim() || null,
        photoUrl: photoUrl.trim() || null,
      });
      setSuccess('Profile updated successfully');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to save profile';
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeContainer>
        <Header title="Edit Profile" showBack />
        <LoadingSpinner />
      </SafeContainer>
    );
  }

  return (
    <SafeContainer>
      <Header title="Edit Profile" showBack />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Input
            label="Specialization"
            value={specialization}
            onChangeText={(t) => { setSpecialization(t); setSuccess(null); }}
            placeholder="e.g. FIDE Arbiter, National Arbiter"
            maxLength={200}
          />

          <Input
            label="Bio"
            value={bio}
            onChangeText={(t) => { setBio(t); setSuccess(null); }}
            placeholder="Tell about your experience as a commissioner..."
            multiline
            numberOfLines={4}
            maxLength={2000}
          />

          <Input
            label="Country"
            value={country}
            onChangeText={(t) => { setCountry(t); setSuccess(null); }}
            placeholder="e.g. Russia"
            maxLength={100}
          />

          <Input
            label="City"
            value={city}
            onChangeText={(t) => { setCity(t); setSuccess(null); }}
            placeholder="e.g. Moscow"
            maxLength={100}
          />

          <Input
            label="Photo URL"
            value={photoUrl}
            onChangeText={(t) => { setPhotoUrl(t); setSuccess(null); }}
            placeholder="https://example.com/photo.jpg"
            maxLength={500}
            autoCapitalize="none"
            keyboardType="url"
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

          <View style={styles.buttonRow}>
            <Button
              title="Save"
              onPress={handleSave}
              loading={saving}
            />
            <Button
              title="Cancel"
              onPress={() => router.back()}
              variant="secondary"
            />
          </View>
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
    width: '100%',
    alignSelf: 'center',
  },
  form: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
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
  buttonRow: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
});
