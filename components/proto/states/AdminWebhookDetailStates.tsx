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
const GREEN = Colors.adminGreen;
const RED = Colors.adminRed;
const BLUE = Colors.adminBlue;

const LOGS = [
  { time: '2026-04-09 14:23', event: 'payment.completed', status: 'success', code: '200 OK', duration: '143ms' },
  { time: '2026-04-09 13:45', event: 'registration.created', status: 'success', code: '200 OK', duration: '89ms' },
  { time: '2026-04-08 22:10', event: 'payment.completed', status: 'failed', code: '500 Error', duration: '5003ms' },
  { time: '2026-04-08 18:30', event: 'registration.created', status: 'success', code: '200 OK', duration: '112ms' },
  { time: '2026-04-08 15:12', event: 'payment.completed', status: 'success', code: '200 OK', duration: '98ms' },
  { time: '2026-04-08 11:05', event: 'registration.created', status: 'success', code: '200 OK', duration: '76ms' },
];

function StatusDot({ status }: { status: string }) {
  const color = status === 'success' ? GREEN : RED;
  return <View style={[s.dot, { backgroundColor: color }]} />;
}

function ConfigSection({ editable }: { editable?: boolean }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>Configuration</Text>
      <View style={s.configGrid}>
        <View style={s.configItem}>
          <Text style={s.configLabel}>Events Subscribed</Text>
          {editable ? (
            <View style={s.editableEvents}>
              {['payment.completed', 'registration.created', 'result.submitted'].map((e, i) => (
                <TouchableOpacity key={e} style={s.eventTag}>
                  <Text style={s.eventTagText}>{e}</Text>
                  <Feather name={i < 2 ? 'check' : 'plus'} size={10} color={i < 2 ? GREEN : MUTED} />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={s.eventTags}>
              <View style={s.eventTag}><Text style={s.eventTagText}>payment.completed</Text></View>
              <View style={s.eventTag}><Text style={s.eventTagText}>registration.created</Text></View>
            </View>
          )}
        </View>
        <View style={s.configItem}>
          <Text style={s.configLabel}>Secret Key</Text>
          {editable ? (
            <View style={s.formInput}>
              <TextInput style={s.formInputText} value="whsec_a3f8b2c1d4e5..." editable={false} />
              <TouchableOpacity><Feather name="eye" size={14} color={MUTED} /></TouchableOpacity>
            </View>
          ) : (
            <Text style={[s.configValue, s.mono]}>whsec_****...b4c5</Text>
          )}
        </View>
      </View>
    </View>
  );
}

export default function AdminWebhookDetailStates() {
  const router = useRouter();

  return (
    <ScrollView style={{ backgroundColor: BG }}>
      {/* STATE: DEFAULT */}
      <StateSection title="DEFAULT" description="Webhook detail with config, stats, and delivery logs">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="admin" activeTab="dashboard" />
          <View style={s.content}>
            <View style={s.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={[s.heading, s.mono]}>https://api.partner1.com/hooks/chess</Text>
                <View style={[s.badge, { backgroundColor: GREEN + '22', borderColor: GREEN + '44' }]}>
                  <Text style={[s.badgeText, { color: GREEN }]}>Active</Text>
                </View>
              </View>
              <View style={s.headerActions}>
                <TouchableOpacity style={s.btnOutline}>
                  <Feather name="edit-2" size={14} color={TEXT} />
                  <Text style={s.btnOutlineText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnDanger}>
                  <Feather name="trash-2" size={14} color={RED} />
                  <Text style={s.btnDangerText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>

            <ConfigSection />

            <View style={s.section}>
              <Text style={s.sectionTitle}>Statistics</Text>
              <View style={s.statsRow}>
                <View style={s.statCard}>
                  <Text style={s.statValue}>1,234</Text>
                  <Text style={s.statLabel}>Total Sent</Text>
                </View>
                <View style={s.statCard}>
                  <Text style={s.statValue}>1,221</Text>
                  <Text style={s.statLabel}>Success</Text>
                </View>
                <View style={s.statCard}>
                  <Text style={s.statValue}>13</Text>
                  <Text style={s.statLabel}>Failed</Text>
                </View>
                <View style={s.statCard}>
                  <Text style={[s.statValue, { color: GREEN }]}>98.9%</Text>
                  <Text style={s.statLabel}>Success Rate</Text>
                </View>
              </View>
            </View>

            <View style={s.section}>
              <View style={s.sectionHeader}>
                <Text style={s.sectionTitle}>Recent Delivery Logs</Text>
                <TouchableOpacity style={s.retryBtn}>
                  <Feather name="rotate-ccw" size={12} color={RED} />
                  <Text style={s.retryBtnText}>Retry Failed</Text>
                </TouchableOpacity>
              </View>

              <View style={s.table}>
                <View style={s.tableHeader}>
                  <Text style={[s.th, { flex: 1.5 }]}>Timestamp</Text>
                  <Text style={[s.th, { flex: 1.5 }]}>Event</Text>
                  <Text style={[s.th, { flex: 0.5 }]}>Status</Text>
                  <Text style={[s.th, { flex: 1 }]}>Response</Text>
                  <Text style={[s.th, { flex: 0.8 }]}>Duration</Text>
                </View>
                {LOGS.map((l, i) => (
                  <View key={i} style={s.tableRow}>
                    <Text style={[s.tdMuted, s.mono, { flex: 1.5 }]}>{l.time}</Text>
                    <Text style={[s.td, { flex: 1.5 }]}>{l.event}</Text>
                    <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <StatusDot status={l.status} />
                    </View>
                    <Text style={[l.status === 'failed' ? s.tdError : s.tdMuted, { flex: 1 }]}>{l.code}</Text>
                    <Text style={[l.duration === '5003ms' ? s.tdError : s.tdMuted, { flex: 0.8 }]}>{l.duration}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </StateSection>

      {/* STATE: EDIT_MODE */}
      <StateSection title="EDIT_MODE" description="Configuration section in editable form mode">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="admin" activeTab="dashboard" />
          <View style={s.content}>
            <View style={s.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={[s.heading, s.mono]}>https://api.partner1.com/hooks/chess</Text>
                <View style={[s.badge, { backgroundColor: GREEN + '22', borderColor: GREEN + '44' }]}>
                  <Text style={[s.badgeText, { color: GREEN }]}>Active</Text>
                </View>
              </View>
              <View style={s.headerActions}>
                <TouchableOpacity style={s.btnPrimary}>
                  <Feather name="save" size={14} color={Colors.white} />
                  <Text style={s.btnPrimaryText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnOutline}>
                  <Text style={s.btnOutlineText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={s.editForm}>
              <Text style={s.formLabel}>Endpoint URL</Text>
              <View style={s.formInput}>
                <TextInput style={s.formInputText} value="https://api.partner1.com/hooks/chess" />
              </View>

              <ConfigSection editable />

              <View style={s.editActions}>
                <TouchableOpacity style={s.btnPrimary}>
                  <Text style={s.btnPrimaryText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnOutline}>
                  <Text style={s.btnOutlineText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </StateSection>

      {/* STATE: LOADING */}
      <StateSection title="LOADING" description="Skeleton loading state for webhook detail">
        <View style={[s.page, { minHeight: Platform.OS === 'web' ? '100vh' : 844 }]}>
          <ProtoNav variant="admin" activeTab="dashboard" />
          <View style={s.content}>
            <View style={[s.skeleton, { width: '60%', height: 24, marginBottom: Spacing.md }]} />
            <View style={[s.skeleton, { width: 60, height: 20, marginBottom: Spacing.lg }]} />

            <View style={s.section}>
              <View style={[s.skeleton, { width: 120, height: 16, marginBottom: Spacing.md }]} />
              <View style={{ gap: Spacing.sm }}>
                <View style={[s.skeleton, { width: '80%', height: 14 }]} />
                <View style={[s.skeleton, { width: '60%', height: 14 }]} />
              </View>
            </View>

            <View style={s.statsRow}>
              {[1, 2, 3, 4].map(i => (
                <View key={i} style={s.statCard}>
                  <View style={[s.skeleton, { width: 50, height: 24 }]} />
                  <View style={[s.skeleton, { width: 70, height: 12 }]} />
                </View>
              ))}
            </View>

            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text style={[s.th, { flex: 1.5 }]}>Timestamp</Text>
                <Text style={[s.th, { flex: 1.5 }]}>Event</Text>
                <Text style={[s.th, { flex: 0.5 }]}>Status</Text>
                <Text style={[s.th, { flex: 1 }]}>Response</Text>
                <Text style={[s.th, { flex: 0.8 }]}>Duration</Text>
              </View>
              {[1, 2, 3, 4].map(i => (
                <View key={i} style={s.tableRow}>
                  {[1.5, 1.5, 0.5, 1, 0.8].map((f, j) => (
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
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { backgroundColor: BG },
  content: { padding: Spacing.lg },
  heading: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fontFamilyBold,
    color: TEXT,
    marginBottom: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamilySemiBold,
    color: TEXT,
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  configGrid: {
    gap: Spacing.md,
  },
  configItem: {
    gap: Spacing.xs,
  },
  configLabel: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamily,
    color: MUTED,
  },
  configValue: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilySemiBold,
    color: TEXT,
  },
  eventTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  editableEvents: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  eventTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: 4,
    paddingHorizontal: Spacing.sm,
    borderRadius: 4,
    backgroundColor: Colors.adminInputBg,
    borderWidth: 1,
    borderColor: BORDER,
  },
  eventTagText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamily,
    color: TEXT,
  },
  mono: {
    fontFamily: 'Courier',
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: 100,
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
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: 4,
    backgroundColor: RED + '11',
    borderWidth: 1,
    borderColor: RED + '33',
  },
  retryBtnText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilyMedium,
    color: RED,
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
  tdError: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: RED,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
  btnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 6,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  btnOutlineText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: TEXT,
  },
  btnDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.adminDangerBg,
    borderRadius: 6,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: RED + '44',
  },
  btnDangerText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: RED,
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: ACCENT,
    borderRadius: 6,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  btnPrimaryText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: Colors.white,
  },
  editForm: {
    backgroundColor: CARD,
    borderRadius: 8,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: BORDER,
    gap: Spacing.md,
  },
  formLabel: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilySemiBold,
    color: TEXT,
  },
  formInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.adminInputBg,
    borderRadius: 6,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: BORDER,
    gap: Spacing.sm,
  },
  formInputText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: TEXT,
    flex: 1,
  },
  editActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  skeleton: {
    backgroundColor: Colors.adminBorder,
    borderRadius: 4,
  },
});
