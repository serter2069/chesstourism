import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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
  caption?: string;
  thumbnailUrl?: string;
}

export default function TournamentPhotosScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showCaptionForm, setShowCaptionForm] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [photoCaption, setPhotoCaption] = useState('');

  // Hidden file input for web
  const fileInputRef = useRef<any>(null);

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tournaments/${id}/photos`);
      const data = res.data;
      setPhotos(Array.isArray(data) ? data : data.items || data.photos || []);
    } catch {
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // --- Upload helpers ---

  async function uploadPhotoBlob(blob: Blob, filename: string) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('photo', blob, filename);
      const res = await api.post(`/tournaments/${id}/photos/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url: string = res.data.url;
      // Store url and show caption form before final DB save
      setPendingUrl(url);
      setShowCaptionForm(true);
    } catch (err: unknown) {
      const message =
        (err as any)?.response?.data?.error || 'Failed to upload photo';
      Alert.alert('Upload Error', message);
    } finally {
      setUploading(false);
    }
  }

  async function handlePickPhotoNative() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Photo library permission is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.9,
    });

    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    const response = await fetch(asset.uri);
    const blob = await response.blob();
    const ext = asset.uri.split('.').pop() || 'jpg';
    await uploadPhotoBlob(blob, `photo.${ext}`);
  }

  function handlePickPhotoWeb() {
    fileInputRef.current?.click();
  }

  async function handleWebFileChange(e: any) {
    const file = e.target?.files?.[0];
    if (!file) return;
    await uploadPhotoBlob(file, file.name);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleUploadPhoto() {
    if (Platform.OS === 'web') {
      handlePickPhotoWeb();
    } else {
      handlePickPhotoNative();
    }
  }

  async function handleConfirmCaption() {
    if (!pendingUrl) return;
    try {
      setUploading(true);
      await api.post(`/tournaments/${id}/photos`, {
        url: pendingUrl,
        caption: photoCaption.trim() || undefined,
      });
      setPendingUrl(null);
      setPhotoCaption('');
      setShowCaptionForm(false);
      fetchPhotos();
    } catch (err: unknown) {
      const message =
        (err as any)?.response?.data?.error || 'Failed to save photo';
      Alert.alert('Error', message);
    } finally {
      setUploading(false);
    }
  }

  function handleCancelCaption() {
    setPendingUrl(null);
    setPhotoCaption('');
    setShowCaptionForm(false);
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

      {/* Hidden file input for web */}
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
      >
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.subtitle}>
              {photos.length} / {MAX_PHOTOS} photos
            </Text>
            {!limitReached && !showCaptionForm && (
              <Button
                title={uploading ? 'Uploading...' : 'Upload Photo'}
                onPress={handleUploadPhoto}
                disabled={uploading}
                style={styles.uploadBtn}
              />
            )}
            {limitReached && (
              <Text style={styles.limitText}>Photo limit reached</Text>
            )}
          </View>

          {showCaptionForm && pendingUrl && (
            <Card style={styles.formCard}>
              <Text style={styles.formTitle}>Photo uploaded. Add a caption?</Text>
              <Image
                source={{ uri: pendingUrl }}
                style={styles.previewImage}
                resizeMode="cover"
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
                  onPress={handleCancelCaption}
                  style={styles.formBtn}
                />
                <Button
                  title="Save Photo"
                  onPress={handleConfirmCaption}
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
    maxWidth: 430,
    alignSelf: 'center' as const,
    width: '100%',
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
    color: Colors.textMuted,
    fontWeight: Typography.weights.medium,
  },
  uploadBtn: {
    paddingHorizontal: Spacing.lg,
  },
  limitText: {
    fontSize: Typography.sizes.xs,
    color: Colors.gold,
    fontWeight: Typography.weights.medium,
  },
  formCard: {
    marginBottom: Spacing.lg,
  },
  formTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: Spacing.md,
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  footerSpacer: {
    height: Spacing['4xl'],
  },
});
