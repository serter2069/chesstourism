import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const ANNOUNCEMENTS = [
  {
    title: 'Pairing System Update',
    date: 'Jun 5, 2025',
    body: 'We will be using Swiss system with Buchholz tiebreaks for all rounds. Players should arrive 15 minutes before each round starts.',
  },
  {
    title: 'Venue Details',
    date: 'Jun 1, 2025',
    body: 'The tournament will be held at Tbilisi Chess Club, 15 Rustaveli Ave. Free parking is available behind the building.',
  },
  {
    title: 'Registration Closing Soon',
    date: 'May 28, 2025',
    body: 'Only 33 spots remaining. Register before Jun 10 to secure your place. Late registrations may not be accepted.',
  },
];

// ─── Announcement Card ───────────────────────────────────────────────────────

function AnnouncementCard({ title, date, body, editable }: {
  title: string; date: string; body: string; editable?: boolean;
}) {
  return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={s.cardTitle}>{title}</Text>
          <View style={s.cardDateRow}>
            <Feather name="clock" size={11} color={Colors.textMuted} />
            <Text style={s.cardDate}>{date}</Text>
          </View>
        </View>
        {editable && (
          <View style={s.cardActions}>
            <TouchableOpacity style={s.cardActionBtn} activeOpacity={0.7}>
              <Feather name="edit-2" size={14} color={Colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={s.cardActionBtn} activeOpacity={0.7}>
              <Feather name="trash-2" size={14} color={Colors.error} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Text style={s.cardBody}>{body}</Text>
    </View>
  );
}

// ─── Default Public View ─────────────────────────────────────────────────────

function PublicView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="public" />
      <View style={s.container}>
        <Text style={s.heading}>Announcements</Text>
        <Text style={s.subtext}>Tbilisi Open 2025</Text>

        {ANNOUNCEMENTS.map((a) => (
          <AnnouncementCard key={a.title} {...a} />
        ))}

        <TouchableOpacity style={s.loadMore} activeOpacity={0.7}>
          <Text style={s.loadMoreText}>Load more</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Commissioner View ───────────────────────────────────────────────────────

function CommissionerView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <View style={s.headerRow}>
          <View>
            <Text style={s.heading}>Announcements</Text>
            <Text style={s.subtext}>Tbilisi Open 2025</Text>
          </View>
          <TouchableOpacity style={s.newBtn} activeOpacity={0.85}>
            <Feather name="plus" size={16} color={Colors.primary} />
            <Text style={s.newBtnText}>New</Text>
          </TouchableOpacity>
        </View>

        {ANNOUNCEMENTS.map((a) => (
          <AnnouncementCard key={a.title} {...a} editable />
        ))}
      </View>
    </View>
  );
}

// ─── New Announcement Form ───────────────────────────────────────────────────

function NewAnnouncementView() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  return (
    <View style={s.page}>
      <ProtoNav variant="client" activeTab="cabinet" />
      <View style={s.container}>
        <View style={s.headerRow}>
          <Text style={s.heading}>New Announcement</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={s.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={s.field}>
          <Text style={s.fieldLabel}>Title</Text>
          <TextInput
            style={s.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Announcement title"
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        <View style={s.field}>
          <Text style={s.fieldLabel}>Body</Text>
          <TextInput
            style={[s.input, s.textarea]}
            value={body}
            onChangeText={setBody}
            placeholder="Write your announcement here..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={6}
          />
        </View>

        <TouchableOpacity style={s.postBtn} activeOpacity={0.85}>
          <Text style={s.postBtnText}>Post Announcement</Text>
        </TouchableOpacity>
        <Text style={s.postNote}>All registered players will be notified.</Text>
      </View>
    </View>
  );
}

// ─── Empty View ──────────────────────────────────────────────────────────────

function EmptyView() {
  return (
    <View style={s.page}>
      <ProtoNav variant="public" />
      <View style={s.container}>
        <Text style={s.heading}>Announcements</Text>
        <Text style={s.subtext}>Tbilisi Open 2025</Text>
        <View style={s.emptyWrap}>
          <Feather name="bell-off" size={48} color={Colors.border} />
          <Text style={s.emptyTitle}>No Announcements</Text>
          <Text style={s.emptyDesc}>There are no announcements for this tournament yet. Check back closer to the event date.</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────

export default function TournamentAnnouncementsStates() {
  return (
    <ScrollView style={{ backgroundColor: Colors.backgroundAlt }}>
      <StateSection title="DEFAULT_PUBLIC" description="Public read-only announcements list">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          null
          <View style={{ flex: 1 }}>

        <PublicView />
                </View>
          null
        </View>
</StateSection>
      <StateSection title="COMMISSIONER_VIEW" description="Commissioner view with Edit/Delete on each card and New button">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          null
          <View style={{ flex: 1 }}>

        <CommissionerView />
                </View>
          null
        </View>
</StateSection>
      <StateSection title="NEW_ANNOUNCEMENT" description="New announcement form with Title and Body">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          null
          <View style={{ flex: 1 }}>

        <NewAnnouncementView />
                </View>
          null
        </View>
</StateSection>
      <StateSection title="EMPTY" description="No announcements posted yet">
        <View style={{ minHeight: Platform.OS === 'web' ? '100vh' : 844 }}>
          null
          <View style={{ flex: 1 }}>

        <EmptyView />
                </View>
          null
        </View>
</StateSection>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { backgroundColor: Colors.background },
  container: { padding: Spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: Spacing.lg },
  heading: { fontFamily: Typography.fontFamilyHeading, fontSize: Typography.sizes['2xl'], color: Colors.text },
  subtext: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.textMuted, marginTop: 2, marginBottom: Spacing.lg },
  card: {
    backgroundColor: Colors.background, borderRadius: 12, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: Spacing.sm },
  cardTitle: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.text },
  cardDateRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  cardDate: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted },
  cardBody: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.textMuted, lineHeight: 22 },
  cardActions: { flexDirection: 'row', gap: Spacing.xs },
  cardActionBtn: { padding: Spacing.xs },
  loadMore: { alignItems: 'center', paddingVertical: Spacing.md },
  loadMoreText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.sm, color: Colors.gold },
  newBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.gold, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2, borderRadius: 6,
  },
  newBtnText: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.sm, color: Colors.primary },
  cancelText: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.sm, color: Colors.textMuted },
  field: { marginBottom: Spacing.md },
  fieldLabel: { fontFamily: Typography.fontFamilyMedium, fontSize: Typography.sizes.sm, color: Colors.text, marginBottom: Spacing.xs },
  input: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: Spacing.md,
    paddingVertical: 10, fontFamily: Typography.fontFamily, fontSize: Typography.sizes.base, color: Colors.text,
    backgroundColor: Colors.background,
  },
  textarea: { height: 150, textAlignVertical: 'top' },
  postBtn: {
    backgroundColor: Colors.gold, borderRadius: 8, paddingVertical: 14,
    alignItems: 'center', marginTop: Spacing.md,
  },
  postBtnText: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.base, color: Colors.primary },
  postNote: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm },
  emptyWrap: { alignItems: 'center', paddingVertical: Spacing['3xl'] },
  emptyTitle: { fontFamily: Typography.fontFamilySemiBold, fontSize: Typography.sizes.lg, color: Colors.text, marginTop: Spacing.md },
  emptyDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.sm, maxWidth: 280 },
});
