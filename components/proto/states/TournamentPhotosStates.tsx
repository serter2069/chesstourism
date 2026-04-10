import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

// ─── Photo Grid ──────────────────────────────────────────────────────────────

function PhotoGrid({ deleteMode }: { deleteMode?: boolean }) {
  const photos = Array.from({ length: 12 }, (_, i) => i + 1);
  return (
    <View style={s.grid}>
      {photos.map((i) => (
        <View key={i} style={s.gridItem}>
          <Image
            source={{ uri: `https://picsum.photos/seed/chess-photo-${i}/800/400` }}
            style={{ width: '100%', aspectRatio: 1, borderRadius: 8 }}
            resizeMode="cover"
          />
          {deleteMode && (
            <TouchableOpacity style={s.deleteBadge} activeOpacity={0.7}>
              <Feather name="x" size={14} color={Colors.background} />
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
}

// ─── Default View ────────────────────────────────────────────────────────────

function DefaultView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <View style={s.headerRow}>
          <View>
            <Text style={s.heading}>Photos</Text>
            <Text style={s.subtext}>12 photos</Text>
          </View>
          <View style={s.headerActions}>
            <TouchableOpacity style={s.uploadBtn} activeOpacity={0.8}>
              <Feather name="upload" size={14} color={Colors.primary} />
              <Text style={s.uploadBtnText}>Upload</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.toggleBtn} activeOpacity={0.7}>
              <Feather name="trash-2" size={14} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
        <PhotoGrid />
      </View>
    </View>
  );
}

// ─── Upload Mode ─────────────────────────────────────────────────────────────

function UploadView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <Text style={s.heading}>Upload Photos</Text>
        <TouchableOpacity style={s.uploadArea} activeOpacity={0.8}>
          <Feather name="upload-cloud" size={40} color={Colors.textMuted} />
          <Text style={s.uploadAreaTitle}>Tap to select photos</Text>
          <Text style={s.uploadAreaDesc}>PNG, JPG up to 10MB each</Text>
        </TouchableOpacity>

        <Text style={s.selectedTitle}>Selected Files</Text>
        {['round3_game1.jpg', 'opening_ceremony.jpg', 'venue_exterior.jpg'].map((f) => (
          <View key={f} style={s.fileRow}>
            <Feather name="image" size={16} color={Colors.textMuted} />
            <Text style={s.fileName}>{f}</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Feather name="x" size={16} color={Colors.error} />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={s.goldBtn} activeOpacity={0.85}>
          <Feather name="upload" size={16} color={Colors.primary} />
          <Text style={s.goldBtnText}>Upload 3 Photos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Uploading View ──────────────────────────────────────────────────────────

function UploadingView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <Text style={s.heading}>Uploading...</Text>
        <View style={s.progressWrap}>
          <View style={s.progressBg}>
            <View style={[s.progressFill, { width: '65%' as any }]} />
          </View>
          <Text style={s.progressText}>Uploading 2 of 3 photos (65%)</Text>
        </View>
        {['round3_game1.jpg', 'opening_ceremony.jpg', 'venue_exterior.jpg'].map((f, i) => (
          <View key={f} style={s.fileRow}>
            <Feather name={i === 0 ? 'check-circle' : i === 1 ? 'loader' : 'clock'} size={16} color={i === 0 ? '#1A6B3A' : Colors.textMuted} />
            <Text style={[s.fileName, i === 0 && { color: Colors.successGreen }]}>{f}</Text>
            <Text style={s.fileStatus}>{i === 0 ? 'Done' : i === 1 ? 'Uploading...' : 'Pending'}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Delete Mode ─────────────────────────────────────────────────────────────

function DeleteView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <View style={s.headerRow}>
          <View>
            <Text style={s.heading}>Select Photos to Delete</Text>
            <Text style={s.subtext}>3 selected</Text>
          </View>
          <TouchableOpacity style={s.cancelToggle} activeOpacity={0.7}>
            <Text style={s.cancelToggleText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <PhotoGrid deleteMode />
        <TouchableOpacity style={s.deleteBtn} activeOpacity={0.85}>
          <Feather name="trash-2" size={16} color={Colors.background} />
          <Text style={s.deleteBtnText}>Delete Selected (3)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Empty View ──────────────────────────────────────────────────────────────

function EmptyView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <Text style={s.heading}>Photos</Text>
        <View style={s.emptyWrap}>
          <Feather name="camera" size={48} color={Colors.border} />
          <Text style={s.emptyTitle}>No Photos Yet</Text>
          <Text style={s.emptyDesc}>Upload photos from the tournament to share with players and visitors.</Text>
          <TouchableOpacity style={s.goldBtn} activeOpacity={0.85}>
            <Feather name="upload" size={16} color={Colors.primary} />
            <Text style={s.goldBtnText}>Upload Photos</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export default function TournamentPhotosStates() {
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT" description="Photo gallery grid with 12 photos">
        <DefaultView />
      </StateSection>
      <StateSection title="UPLOAD_MODE" description="Upload area with selected files list">
        <UploadView />
      </StateSection>
      <StateSection title="UPLOADING" description="Upload in progress with progress bar">
        <UploadingView />
      </StateSection>
      <StateSection title="DELETE_MODE" description="Delete mode with X badges on each photo">
        <DeleteView />
      </StateSection>
      <StateSection title="EMPTY" description="No photos uploaded yet">
        <EmptyView />
      </StateSection>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { backgroundColor: Colors.background },
  container: { padding: Spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: Spacing.lg },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  heading: { fontFamily: Typography.fontFamilyHeading, fontSize: Typography.sizes['2xl'], color: Colors.text },
  subtext: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.textMuted, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  gridItem: { position: 'relative' as any, width: '31%' as any },
  deleteBadge: {
    position: 'absolute', top: 4, right: 4,
    width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.error,
    alignItems: 'center', justifyContent: 'center',
  },
  uploadBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.gold, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2, borderRadius: 6,
  },
  uploadBtnText: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.xs, color: Colors.primary },
  toggleBtn: { padding: Spacing.xs, borderWidth: 1, borderColor: Colors.border, borderRadius: 6 },
  uploadArea: {
    borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.border, borderRadius: 12,
    padding: Spacing.xl, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg,
  },
  uploadAreaTitle: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.text, marginTop: Spacing.md },
  uploadAreaDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.textMuted, marginTop: 4 },
  selectedTitle: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.text, marginBottom: Spacing.sm },
  fileRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  fileName: { flex: 1, fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.text },
  fileStatus: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted },
  goldBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.gold, borderRadius: 8, paddingVertical: 14, marginTop: Spacing.lg,
  },
  goldBtnText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.primary },
  progressWrap: { marginBottom: Spacing.lg },
  progressBg: { height: 6, backgroundColor: Colors.border, borderRadius: 3, marginBottom: Spacing.sm },
  progressFill: { height: 6, backgroundColor: Colors.gold, borderRadius: 3 },
  progressText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.textMuted },
  cancelToggle: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md },
  cancelToggleText: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.sm, color: Colors.gold },
  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm,
    backgroundColor: Colors.error, borderRadius: 8, paddingVertical: 14, marginTop: Spacing.lg,
  },
  deleteBtnText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.background },
  emptyWrap: { alignItems: 'center', paddingVertical: Spacing['3xl'] },
  emptyTitle: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.lg, color: Colors.text, marginTop: Spacing.md },
  emptyDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm, maxWidth: 280 },
});
