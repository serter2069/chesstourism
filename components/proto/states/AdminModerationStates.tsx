import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { useRouter } from 'expo-router';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

const BG = Colors.adminBg;
const CARD = Colors.adminCard;
const TEXT = Colors.adminText;
const MUTED = Colors.adminMuted;
const ACCENT = Colors.adminAccent;
const BORDER = Colors.adminBorder;
const RED = Colors.adminRed;
const YELLOW = Colors.adminYellow;
const GREEN = Colors.adminGreen;
const BLUE = Colors.adminBlue;

const DISPUTES = [
  { id: 'DSP-001', title: 'Result Dispute - Oslo Rapid Cup', priority: 'High', complainant: 'Magnus Eriksson', against: 'Erik Halvorsen', tournament: 'Oslo Rapid Cup', admin: 'System Admin', status: 'Open' },
  { id: 'DSP-002', title: 'Registration Refund Dispute', priority: 'Medium', complainant: 'Anna Petrov', against: 'Marek Kowalski', tournament: 'Warsaw Classical', admin: 'Unassigned', status: 'Open' },
  { id: 'DSP-003', title: 'Misconduct Report', priority: 'Low', complainant: 'David Kipiani', against: 'Rustam Nazarov', tournament: 'Yerevan Masters', admin: 'System Admin', status: 'Open' },
];

function PriorityBadge({ priority }: { priority: string }) {
  const colorMap: Record<string, string> = { High: RED, Medium: YELLOW, Low: MUTED };
  const color = colorMap[priority] || MUTED;
  return (
    <View style={[s.badge, { backgroundColor: color + '22', borderColor: color + '44' }]}>
      <Text style={[s.badgeText, { color }]}>{priority}</Text>
    </View>
  );
}

function TabBar({ tabs, active, onSelect }: { tabs: string[]; active: string; onSelect?: (tab: string) => void }) {
  return (
    <View style={s.tabBar}>
      {tabs.map(t => (
        <TouchableOpacity key={t} style={[s.tab, active === t && s.tabActive]} onPress={() => onSelect?.(t)}>
          <Text style={[s.tabText, active === t && s.tabTextActive]}>{t}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function AdminModerationStates() {
  const router = useRouter();
  const [adminNotes, setAdminNotes] = useState('');
  const [activeModTab, setActiveModTab] = useState('Disputes (3)');

  return (
    <ScrollView style={{ backgroundColor: BG }}>
      {/* STATE: DEFAULT */}
      <StateSection title="DEFAULT" description="Disputes, reports, flags tabs with open items">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="admin" activeTab="moderation" />
          <View style={s.content}>
            <Text style={s.heading}>Moderation</Text>
            <TabBar tabs={['Disputes (3)', 'Reports (7)', 'Flags (2)']} active={activeModTab} onSelect={setActiveModTab} />

            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text style={[s.th, { flex: 0.8 }]}>ID</Text>
                <Text style={[s.th, { flex: 0.8 }]}>Priority</Text>
                <Text style={[s.th, { flex: 2.5 }]}>Title</Text>
                <Text style={[s.th, { flex: 1.5 }]}>Tournament</Text>
                <Text style={[s.th, { flex: 1.5 }]}>Complainant</Text>
                <Text style={[s.th, { flex: 1.2 }]}>Assigned</Text>
                <Text style={[s.th, { flex: 0.8 }]}>Status</Text>
                <Text style={[s.th, { flex: 0.8 }]}>Action</Text>
              </View>
              {DISPUTES.map((d, i) => (
                <View key={i} style={s.tableRow}>
                  <Text style={[s.tdMuted, { flex: 0.8 }]}>{d.id}</Text>
                  <View style={{ flex: 0.8 }}><PriorityBadge priority={d.priority} /></View>
                  <Text style={[s.td, { flex: 2.5 }]}>{d.title}</Text>
                  <Text style={[s.tdMuted, { flex: 1.5 }]}>{d.tournament}</Text>
                  <Text style={[s.tdMuted, { flex: 1.5 }]}>{d.complainant}</Text>
                  <Text style={[s.tdMuted, { flex: 1.2 }]}>{d.admin}</Text>
                  <View style={{ flex: 0.8 }}>
                    <View style={[s.badge, { backgroundColor: BLUE + '22', borderColor: BLUE + '44' }]}>
                      <Text style={[s.badgeText, { color: BLUE }]}>{d.status}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 0.8 }}>
                    <TouchableOpacity style={s.openBtn} onPress={() => router.push('/proto/states/admin-disputes' as any)}><Text style={s.openBtnText}>Open</Text></TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </StateSection>

      {/* STATE: DISPUTE_DETAIL */}
      <StateSection title="DISPUTE_DETAIL" description="Dispute detail with timeline, messages, resolution options">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="admin" activeTab="moderation" />
          <View style={s.content}>
            <Text style={s.heading}>Moderation</Text>

            <View style={s.detailPanel}>
              <View style={s.detailHeader}>
                <Text style={s.detailTitle}>Result Dispute - Oslo Rapid Cup</Text>
                <PriorityBadge priority="High" />
              </View>

              <Text style={s.sectionTitle}>Timeline</Text>
              <View style={s.timeline}>
                {[
                  { time: 'Apr 7, 14:30', text: 'Dispute opened by Magnus Eriksson', icon: 'alert-circle' },
                  { time: 'Apr 7, 15:00', text: 'Assigned to System Admin', icon: 'user' },
                  { time: 'Apr 7, 16:20', text: 'Commissar Erik Halvorsen notified', icon: 'bell' },
                ].map((e, i) => (
                  <View key={i} style={s.timelineItem}>
                    <View style={s.timelineDot}><Feather name={e.icon as any} size={12} color={MUTED} /></View>
                    <View style={s.timelineContent}>
                      <Text style={s.timelineTime}>{e.time}</Text>
                      <Text style={s.timelineText}>{e.text}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <Text style={s.sectionTitle}>Messages</Text>
              <View style={s.messageCard}>
                <Text style={s.messageName}>Magnus Eriksson (Player)</Text>
                <Text style={s.messageText}>My opponent's result was recorded incorrectly. I won the game in round 5 but the result shows a loss. I have the signed scoresheet as evidence.</Text>
              </View>
              <View style={s.messageCard}>
                <Text style={s.messageName}>Erik Halvorsen (Commissar)</Text>
                <Text style={s.messageText}>I've reviewed the scoresheets. There appears to have been a data entry error. The result will be corrected in the system.</Text>
              </View>

              <Text style={s.sectionTitle}>Admin Notes</Text>
              <TextInput
                style={s.textarea}
                multiline
                numberOfLines={3}
                placeholder="Add notes about this dispute..."
                placeholderTextColor={MUTED}
                value={adminNotes}
                onChangeText={setAdminNotes}
              />

              <Text style={s.sectionTitle}>Resolution</Text>
              <View style={s.resolutionOptions}>
                <TouchableOpacity style={s.resolutionBtn}><Text style={s.resolutionText}>Dismiss</Text></TouchableOpacity>
                <TouchableOpacity style={s.resolutionBtn}><Text style={s.resolutionText}>Side with Player</Text></TouchableOpacity>
                <TouchableOpacity style={s.resolutionBtn}><Text style={s.resolutionText}>Side with Commissar</Text></TouchableOpacity>
                <TouchableOpacity style={[s.resolutionBtn, { borderColor: YELLOW + '44' }]}><Text style={[s.resolutionText, { color: YELLOW }]}>Escalate</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </StateSection>

      {/* STATE: LOADING */}
      <StateSection title="LOADING" description="Skeleton loading state">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="admin" activeTab="moderation" />
          <View style={s.content}>
            <Text style={s.heading}>Moderation</Text>
            <TabBar tabs={['Disputes', 'Reports', 'Flags']} active="Disputes" />
            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text style={[s.th, { flex: 1 }]}>ID</Text>
                <Text style={[s.th, { flex: 1 }]}>Priority</Text>
                <Text style={[s.th, { flex: 3 }]}>Title</Text>
                <Text style={[s.th, { flex: 1.5 }]}>Tournament</Text>
                <Text style={[s.th, { flex: 1 }]}>Action</Text>
              </View>
              {[1, 2, 3].map(i => (
                <View key={i} style={s.tableRow}>
                  {[1, 1, 3, 1.5, 1].map((f, j) => (
                    <View key={j} style={{ flex: f, paddingHorizontal: 4 }}>
                      <View style={[s.skeleton, { height: 14, width: '80%' }]} />
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </View>
      </StateSection>

      {/* STATE: ALL_RESOLVED */}
      <StateSection title="ALL_RESOLVED" description="All tabs showing empty, all clear">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="admin" activeTab="moderation" />
          <View style={s.content}>
            <Text style={s.heading}>Moderation</Text>
            <TabBar tabs={['Disputes (0)', 'Reports (0)', 'Flags (0)']} active="Disputes (0)" />

            <View style={s.emptyState}>
              <Feather name="check-circle" size={48} color={GREEN} />
              <Text style={s.emptyTitle}>All Clear</Text>
              <Text style={s.emptyText}>No open disputes. All moderation items have been resolved.</Text>
            </View>
          </View>
        </View>
      </StateSection>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { backgroundColor: BG },
  content: { padding: Spacing.lg },
  heading: {
    fontSize: Typography.sizes['2xl'],
    fontFamily: Typography.fontFamilyHeading,
    color: TEXT,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamilySemiBold,
    color: TEXT,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  tabBar: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 6,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
  },
  tabActive: {
    backgroundColor: ACCENT + '22',
    borderColor: ACCENT + '44',
  },
  tabText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: MUTED,
  },
  tabTextActive: {
    color: ACCENT,
  },
  table: {
    backgroundColor: CARD,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.adminInputBg,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  th: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilySemiBold,
    color: MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  td: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: TEXT,
  },
  tdMuted: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: MUTED,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilyMedium,
  },
  openBtn: {
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: 4,
    backgroundColor: BLUE + '22',
    borderWidth: 1,
    borderColor: BLUE + '44',
    alignSelf: 'flex-start',
  },
  openBtnText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilyMedium,
    color: BLUE,
  },
  skeleton: {
    backgroundColor: Colors.adminBorder,
    borderRadius: 4,
  },
  detailPanel: {
    backgroundColor: CARD,
    borderRadius: 8,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: BORDER,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  detailTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fontFamilyBold,
    color: TEXT,
    flex: 1,
  },
  timeline: {
    gap: Spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.adminBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineContent: {
    flex: 1,
  },
  timelineTime: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamily,
    color: MUTED,
  },
  timelineText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: TEXT,
  },
  messageCard: {
    backgroundColor: Colors.adminInputBg,
    borderRadius: 6,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: BORDER,
  },
  messageName: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilySemiBold,
    color: ACCENT,
    marginBottom: 4,
  },
  messageText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: MUTED,
    lineHeight: 20,
  },
  textarea: {
    backgroundColor: Colors.adminInputBg,
    borderRadius: 6,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: BORDER,
    color: TEXT,
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  resolutionOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  resolutionBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: Colors.adminInputBg,
  },
  resolutionText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: TEXT,
  },
  emptyState: {
    backgroundColor: CARD,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    padding: Spacing['2xl'],
    alignItems: 'center',
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fontFamilySemiBold,
    color: TEXT,
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: MUTED,
    textAlign: 'center',
    maxWidth: 300,
  },
});
