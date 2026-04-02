import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeContainer, Header } from '../../../../components/layout';
import { Button, Card, Input, LoadingSpinner } from '../../../../components/ui';
import { Colors } from '../../../../constants/colors';
import { Spacing } from '../../../../constants/spacing';
import { Typography } from '../../../../constants/typography';
import api from '../../../../lib/api';

const MAX_PHOTOS = 10;

interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string;
}

export default function TournamentPhotosScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tournaments/${id}/photos`);
      const data = res.data;
      setPhotos(Array.isArray(data) ? data : data.items || data.photos || []);
    } catch {
      // Photos endpoint may not exist yet — show empty
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  function handleUploadPhoto() {
    setShowForm(true);
  }

  async function handleSubmitPhoto() {
    const trimmedUrl = photoUrl.trim();
    if (!trimmedUrl) {
      Alert.alert('Error', 'Photo URL is required');
      return;
    }

    try {
      new URL(trimmedUrl);
    } catch {
      Alert.alert('Error', 'Please enter a valid URL (https://...)');
      return;
    }

    try {
      setUploading(true);
      await api.post(`/tournaments/${id}/photos`, {
        url: trimmedUrl,
        caption: photoCaption.trim() || undefined,
      });
      setPhotoUrl('');
      setPhotoCaption('');
      setShowForm(false);
      fetchPhotos();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.error ||
        (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.message ||
        'Failed to add photo';
      Alert.alert('Error', message);
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <SafeContainer>
        <Header title="Tournament Photos" showBack />
        <LoadingSpinner />
      </SafeContainer>
    );
  }

  const limitReached = photos.length >= MAX_PHOTOS;

  return (
    <SafeContainer>
      <Header title="Tournament Photos" showBack />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.subtitle}>
              {photos.length} / {MAX_PHOTOS} photos
            </Text>
            {!limitReached && (
              <Button
                title="Upload Photo"
                onPress={handleUploadPhoto}
                style={styles.uploadBtn}
              />
            )}
            {limitReached && (
              <Text style={styles.limitText}>Photo limit reached</Text>
            )}
          </View>

          {showForm && (
            <Card style={styles.formCard}>
              <Input
                label="Photo URL *"
                placeholder="https://example.com/photo.jpg"
                value={photoUrl}
                onChangeText={setPhotoUrl}
                autoCapitalize="none"
                keyboardType="url"
              />
              <Input
                label="Caption (optional)"
                placeholder="Describe the photo..."
                value={photoCaption}
                onChangeText={setPhotoCaption}
              />
              <View style={styles.formButtons}>
                <Button
                  title="Cancel"
                  variant="secondary"
                  onPress={() => {
                    setShowForm(false);
                    setPhotoUrl('');
                    setPhotoCaption('');
                  }}
                  style={styles.formBtn}
                />
                <Button
                  title="Add Photo"
                  onPress={handleSubmitPhoto}
                  loading={uploading}
                  disabled={uploading}
                  style={styles.formBtn}
                />
              </View>
            </Card>
          )}

          {photos.length === 0 && (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No photos uploaded yet.</Text>
            </Card>
          )}

          <View style={styles.grid}>
            {photos.map((photo) => (
              <View key={photo.id} style={styles.photoWrapper}>
                <Image
                  source={{ uri: photo.thumbnailUrl || photo.url }}
                  style={styles.photo}
                  resizeMode="cover"
                />
              </View>
            ))}
          </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  uploadBtn: {
    paddingHorizontal: Spacing.lg,
  },
  limitText: {
    fontSize: Typography.sizes.xs,
    color: Colors.statusWarning,
    fontWeight: Typography.weights.medium,
  },
  formCard: {
    marginBottom: Spacing.lg,
  },
  formButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  formBtn: {
    flex: 1,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  photoWrapper: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  footerSpacer: {
    height: Spacing['4xl'],
  },
});
