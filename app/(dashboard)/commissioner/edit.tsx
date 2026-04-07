import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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
  // Up to 3 cities of work
  const [city1, setCity1] = useState('');
  const [city2, setCity2] = useState('');
  const [city3, setCity3] = useState('');
  const [achievements, setAchievements] = useState('');
  const [website, setWebsite] = useState('');
  const [telegram, setTelegram] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Hidden file input for web avatar selection
  const fileInputRef = useRef<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/commissars/profile');
        const p = res.data;
        setBio(p.bio || '');
        setSpecialization(p.specialization || '');
        setCountry(p.country || '');
        setCity(p.city || '');
        const c: string[] = p.cities || [];
        setCity1(c[0] || '');
        setCity2(c[1] || '');
        setCity3(c[2] || '');
        setAchievements(p.achievements || '');
        setWebsite(p.website || '');
        setTelegram(p.telegram || '');
        setPhotoUrl(p.photoUrl || null);
      } catch {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // --- Avatar upload helpers ---

  async function uploadAvatarBlob(blob: Blob, filename: string) {
    setUploadingAvatar(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('avatar', blob, filename);
      const res = await api.post('/profile/commissioner-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPhotoUrl(res.data.commissioner.photoUrl);
      setSuccess('Avatar updated');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to upload avatar';
      setError(msg);
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handlePickAvatarNative() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Photo library permission is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    const response = await fetch(asset.uri);
    const blob = await response.blob();
    const ext = asset.uri.split('.').pop() || 'jpg';
    await uploadAvatarBlob(blob, `avatar.${ext}`);
  }

  function handlePickAvatarWeb() {
    fileInputRef.current?.click();
  }

  async function handleWebFileChange(e: any) {
    const file = e.target?.files?.[0];
    if (!file) return;
    await uploadAvatarBlob(file, file.name);
    // Reset so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handlePickAvatar() {
    setSuccess(null);
    setError(null);
    if (Platform.OS === 'web') {
      handlePickAvatarWeb();
    } else {
      handlePickAvatarNative();
    }
  }

  // --- Save profile ---

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const cities = [city1.trim(), city2.trim(), city3.trim()].filter(Boolean);
      await api.put('/commissars/profile', {
        bio: bio.trim() || null,
        specialization: specialization.trim() || null,
        country: country.trim() || null,
        city: city.trim() || null,
        cities,
        achievements: achievements.trim() || null,
        website: website.trim() || null,
        telegram: telegram.trim() || null,
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

      {/* Hidden file input for web avatar selection */}
      {Platform.OS === 'web' && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' } as any}
          onChange={handleWebFileChange}
        />
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>

          {/* Avatar section */}
          <View style={styles.avatarSection}>
            <TouchableOpacity
              onPress={handlePickAvatar}
              disabled={uploadingAvatar}
              style={styles.avatarTouchable}
              activeOpacity={0.75}
            >
              {photoUrl ? (
                <Image source={{ uri: photoUrl }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarPlaceholderText}>Photo</Text>
                </View>
              )}
              <View style={styles.avatarOverlay}>
                <Text style={styles.avatarOverlayText}>
                  {uploadingAvatar ? 'Uploading...' : 'Change'}
                </Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarHint}>JPG / PNG / WebP, max 5 MB</Text>
          </View>

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

          {/* Cities of work — up to 3 */}
          <Text style={styles.sectionLabel}>Cities of Work (up to 3)</Text>
          <Input
            label="City 1"
            value={city1}
            onChangeText={(t) => { setCity1(t); setSuccess(null); }}
            placeholder="e.g. Moscow"
            maxLength={100}
          />
          <Input
            label="City 2"
            value={city2}
            onChangeText={(t) => { setCity2(t); setSuccess(null); }}
            placeholder="e.g. Saint Petersburg"
            maxLength={100}
          />
          <Input
            label="City 3"
            value={city3}
            onChangeText={(t) => { setCity3(t); setSuccess(null); }}
            placeholder="e.g. Novosibirsk"
            maxLength={100}
          />

          <Input
            label="Achievements / Experience"
            value={achievements}
            onChangeText={(t) => { setAchievements(t); setSuccess(null); }}
            placeholder="e.g. FIDE Arbiter since 2015, organized 30+ tournaments..."
            multiline
            numberOfLines={4}
            maxLength={1000}
          />

          <Input
            label="Website (optional)"
            value={website}
            onChangeText={(t) => { setWebsite(t); setSuccess(null); }}
            placeholder="https://example.com"
            maxLength={200}
            autoCapitalize="none"
            keyboardType="url"
          />

          <Input
            label="Telegram (optional)"
            value={telegram}
            onChangeText={(t) => { setTelegram(t); setSuccess(null); }}
            placeholder="@username"
            maxLength={100}
            autoCapitalize="none"
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
  // Avatar
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatarTouchable: {
    position: 'relative',
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarPlaceholderText: {
    color: '#ffffff',
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingVertical: 4,
    alignItems: 'center',
  },
  avatarOverlayText: {
    color: '#ffffff',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
  },
  avatarHint: {
    marginTop: Spacing.xs,
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  // Section label for cities group
  sectionLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
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
  buttonRow: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
});
