import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
import { useRouter } from 'expo-router';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

const BG = '#0f1318';
const CARD = '#1a2030';
const TEXT = '#e0e4ef';
const MUTED = '#8090a8';
const ACCENT = '#e07070';
const BORDER = '#2a3040';
const GREEN = '#4caf50';
const YELLOW = '#ffc107';
const BLUE = '#6b9fd4';
const RED = '#e07070';

const QUEUE = [
  { id: 'DSP-001', type: 'Result', parties: 'Magnus Eriksson vs Erik Halvorsen', tournament: 'Oslo Rapid Cup', date: '2026-04-07', sla: '14h remaining', priority: 'High' },
  { id: 'DSP-002', type: 'Refund', parties: 'Anna Petrov vs Marek Kowalski', tournament: 'Warsaw Classical', date: '2026-04-08', sla: '22h remaining', priority: 'Medium' },
  { id: 'DSP-003', type: 'Conduct', parties: 'David Kipiani vs Rustam Nazarov', tournament: 'Yerevan Masters', date: '2026-04-08', sla: '46h remaining', priority: 'Low' },
  { id: 'DSP-004', type: 'Result', parties: 'Lena Johansson vs Carlos Ruiz', tournament: 'Barcelona Blitz', date: '2026-04-09', sla: '48h remaining', priority: 'Medium' },
];

function PriorityBorder({ priority }: { priority: string }) {
  const colorMap: Record<string, string> = { High: RED, Medium: YELLOW, Low: MUTED };
  return colorMap[priority] || MUTED;
}

function TypeBadge({ type }: { type: string }) {
  const colorMap: Record<string, string> = { Result: BLUE, Refund: YELLOW, Conduct: RED };
  const color = colorMap[type] || MUTED;
  return (
    <View style={[s.badge, { backgroundColor: color + '22', borderColor: color + '44' }]}>
      <Text style={[s.badgeText, { color }]}>{type}</Text>
    </View>
  );
}

export default function AdminDisputesStates() {
  const router = useRouter();
  const [replyText, setReplyText] = useState('');

  return (
    <ScrollView style={{ backgroundColor: BG }}>
      {/* STATE: DEFAULT */}
      <StateSection title="DEFAULT" description="Dispute queue with priority colors and SLA timers">
        <View style={s.page}>
          <ProtoNav variant="admin" activeTab="moderation" />
          <View style={s.content}>
            <View style={s.headerRow}>
              <Text style={s.heading}>Dispute Queue</Text>
              <TouchableOpacity style={s.toggleBtn}>
                <Feather name="user" size={14} color={MUTED} />
                <Text style={s.toggleText}>My Cases</Text>
              </TouchableOpacity>
            </View>

            {QUEUE.map((d, i) => (
              <TouchableOpacity key={i} style={[s.disputeCard, { borderLeftColor: PriorityBorder({ priority: d.priority }) }]} onPress={() => router.push('/proto/states/admin-moderation' as any)}>
                <View style={s.disputeHeader}>
                  <Text style={s.disputeId}>{d.id}</Text>
                  <TypeBadge type={d.type} />
                  <View style={{ flex: 1 }} />
                  <Feather name="clock" size={12} color={d.sla.includes('14h') ? RED : MUTED} />
                  <Text style={[s.slaText, d.sla.includes('14h') && { color: RED }]}>{d.sla}</Text>
                </View>
                <Text style={s.disputeParties}>{d.parties}</Text>
                <View style={s.disputeMeta}>
                  <Text style={s.disputeMetaText}>{d.tournament}</Text>
                  <Text style={s.disputeMetaText}>Opened {d.date}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </StateSection>

      {/* STATE: DISPUTE_OPEN */}
      <StateSection title="DISPUTE_OPEN" description="Conversation thread view with resolution form">
        <View style={s.page}>
          <ProtoNav variant="admin" activeTab="moderation" />
          <View style={s.content}>
            <Text style={s.heading}>DSP-001: Result Dispute</Text>

            <View style={s.detailCard}>
              <View style={s.detailRow}>
                <Text style={s.detailLabel}>Tournament</Text>
                <Text style={s.detailValue}>Oslo Rapid Cup</Text>
              </View>
              <View style={s.detailRow}>
                <Text style={s.detailLabel}>Parties</Text>
                <Text style={s.detailValue}>Magnus Eriksson vs Erik Halvorsen</Text>
              </View>
              <View style={s.detailRow}>
                <Text style={s.detailLabel}>SLA</Text>
                <Text style={[s.detailValue, { color: RED }]}>14h remaining</Text>
              </View>
            </View>

            <Text style={s.sectionTitle}>Conversation</Text>

            <View style={s.messageCard}>
              <View style={s.messageHeader}>
                <Feather name="user" size={12} color={BLUE} />
                <Text style={[s.messageName, { color: BLUE }]}>Magnus Eriksson (Player)</Text>
                <Text style={s.messageTime}>Apr 7, 14:30</Text>
              </View>
              <Text style={s.messageText}>My game result in round 5 was recorded incorrectly. The scoresheet shows I won but the system records a loss.</Text>
            </View>

            <View style={s.messageCard}>
              <View style={s.messageHeader}>
                <Feather name="shield" size={12} color={YELLOW} />
                <Text style={[s.messageName, { color: YELLOW }]}>Erik Halvorsen (Commissar)</Text>
                <Text style={s.messageTime}>Apr 7, 16:20</Text>
              </View>
              <Text style={s.messageText}>I acknowledge the data entry error. I have the original scoresheet confirming Magnus won. Will correct immediately.</Text>
            </View>

            <View style={s.messageCard}>
              <View style={s.messageHeader}>
                <Feather name="shield" size={12} color={ACCENT} />
                <Text style={[s.messageName, { color: ACCENT }]}>Admin</Text>
                <Text style={s.messageTime}>Apr 7, 17:00</Text>
              </View>
              <Text style={s.messageText}>Reviewed evidence. Result correction approved.</Text>
            </View>

            <TextInput
              style={s.replyInput}
              placeholder="Write a message..."
              placeholderTextColor={MUTED}
              multiline
              value={replyText}
              onChangeText={setReplyText}
            />

            <Text style={s.sectionTitle}>Resolution</Text>
            <View style={s.resolutionForm}>
              <TouchableOpacity style={s.resBtn}><Text style={s.resBtnText}>Dismiss</Text></TouchableOpacity>
              <TouchableOpacity style={[s.resBtn, s.resBtnActive]}><Text style={[s.resBtnText, { color: GREEN }]}>Side with Player</Text></TouchableOpacity>
              <TouchableOpacity style={s.resBtn}><Text style={s.resBtnText}>Side with Commissar</Text></TouchableOpacity>
              <TouchableOpacity style={s.resBtn}><Text style={[s.resBtnText, { color: YELLOW }]}>Escalate</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </StateSection>

      {/* STATE: LOADING */}
      <StateSection title="LOADING" description="Skeleton loading state">
        <View style={s.page}>
          <ProtoNav variant="admin" activeTab="moderation" />
          <View style={s.content}>
            <Text style={s.heading}>Dispute Queue</Text>
            {[1, 2, 3].map(i => (
              <View key={i} style={[s.disputeCard, { borderLeftColor: BORDER }]}>
                <View style={{ gap: Spacing.sm }}>
                  <View style={[s.skeleton, { width: 80, height: 14 }]} />
                  <View style={[s.skeleton, { width: '70%', height: 16 }]} />
                  <View style={[s.skeleton, { width: '50%', height: 12 }]} />
                </View>
              </View>
            ))}
          </View>
        </View>
      </StateSection>

      {/* STATE: STATS */}
      <StateSection title="STATS" description="Dispute statistics overview">
        <View style={s.page}>
          <ProtoNav variant="admin" activeTab="moderation" />
          <View style={s.content}>
            <Text style={s.heading}>Dispute Statistics</Text>

            <View style={s.statsRow}>
              <View style={s.statCard}>
                <Text style={s.statValue}>18h</Text>
                <Text style={s.statLabel}>Avg Resolution Time</Text>
              </View>
              <View style={s.statCard}>
                <Text style={s.statValue}>94%</Text>
                <Text style={s.statLabel}>Resolution Rate</Text>
              </View>
              <View style={s.statCard}>
                <Text style={s.statValue}>4</Text>
                <Text style={s.statLabel}>Open Disputes</Text>
              </View>
              <View style={s.statCard}>
                <Text style={s.statValue}>127</Text>
                <Text style={s.statLabel}>Total Resolved</Text>
              </View>
            </View>

            <Text style={s.sectionTitle}>Open by Category</Text>
            <View style={s.chartPlaceholder}>
              <View style={s.chartBar}>
                <View style={[s.chartFill, { width: '50%', backgroundColor: BLUE }]} />
                <Text style={s.chartLabel}>Result (2)</Text>
              </View>
              <View style={s.chartBar}>
                <View style={[s.chartFill, { width: '25%', backgroundColor: YELLOW }]} />
                <Text style={s.chartLabel}>Refund (1)</Text>
              </View>
              <View style={s.chartBar}>
                <View style={[s.chartFill, { width: '25%', backgroundColor: RED }]} />
                <Text style={s.chartLabel}>Conduct (1)</Text>
              </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 6,
    backgroundColor: CARD,
    borderWidth: 1,
    borderColor: BORDER,
  },
  toggleText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: MUTED,
  },
  disputeCard: {
    backgroundColor: CARD,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: BORDER,
    borderLeftWidth: 4,
  },
  disputeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  disputeId: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilySemiBold,
    color: MUTED,
  },
  slaText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamily,
    color: MUTED,
    marginLeft: 4,
  },
  disputeParties: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilySemiBold,
    color: TEXT,
    marginBottom: 4,
  },
  disputeMeta: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  disputeMetaText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamily,
    color: MUTED,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilyMedium,
  },
  detailCard: {
    backgroundColor: CARD,
    borderRadius: 8,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: BORDER,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  detailLabel: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: MUTED,
  },
  detailValue: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilySemiBold,
    color: TEXT,
  },
  messageCard: {
    backgroundColor: '#141a28',
    borderRadius: 6,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: BORDER,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 6,
  },
  messageName: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilySemiBold,
  },
  messageTime: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamily,
    color: MUTED,
    marginLeft: 'auto',
  },
  messageText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: MUTED,
    lineHeight: 20,
  },
  replyInput: {
    backgroundColor: '#141a28',
    borderRadius: 6,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: BORDER,
    color: TEXT,
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    minHeight: 60,
    textAlignVertical: 'top',
    marginTop: Spacing.sm,
  },
  resolutionForm: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  resBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#141a28',
  },
  resBtnActive: {
    borderColor: GREEN + '44',
    backgroundColor: GREEN + '11',
  },
  resBtnText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: TEXT,
  },
  skeleton: {
    backgroundColor: '#2a3040',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: 120,
    backgroundColor: CARD,
    borderRadius: 8,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: BORDER,
  },
  statValue: {
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.fontFamilyBold,
    color: TEXT,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamily,
    color: MUTED,
    textAlign: 'center',
  },
  chartPlaceholder: {
    backgroundColor: CARD,
    borderRadius: 8,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: BORDER,
    gap: Spacing.md,
  },
  chartBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  chartFill: {
    height: 24,
    borderRadius: 4,
  },
  chartLabel: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: MUTED,
  },
});
