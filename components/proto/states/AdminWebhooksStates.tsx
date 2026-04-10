import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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
const BLUE = '#6b9fd4';

const WEBHOOKS = [
  { url: 'https://api.partner1.com/hooks/chess', events: 'payment.completed, registration.created', status: 'Active', lastTriggered: '2 min ago', successRate: '99.2%' },
  { url: 'https://integrations.fide.org/webhook', events: 'result.submitted', status: 'Active', lastTriggered: '1 hr ago', successRate: '97.8%' },
  { url: 'https://staging-api.chess.org/test', events: 'registration.created', status: 'Inactive', lastTriggered: '3 days ago', successRate: '85.0%' },
];

const ALL_EVENTS = [
  'registration.created',
  'registration.cancelled',
  'payment.completed',
  'payment.failed',
  'result.submitted',
  'tournament.started',
  'tournament.completed',
];

function StatusBadge({ status }: { status: string }) {
  const color = status === 'Active' ? GREEN : MUTED;
  return (
    <View style={[s.badge, { backgroundColor: color + '22', borderColor: color + '44' }]}>
      <Text style={[s.badgeText, { color }]}>{status}</Text>
    </View>
  );
}

export default function AdminWebhooksStates() {
  const router = useRouter();
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set(['registration.created', 'payment.completed']));

  const toggleEvent = (event: string) => {
    setSelectedEvents(prev => {
      const next = new Set(prev);
      if (next.has(event)) next.delete(event);
      else next.add(event);
      return next;
    });
  };

  return (
    <ScrollView style={{ backgroundColor: BG }}>
      {/* STATE: DEFAULT */}
      <StateSection title="DEFAULT" description="Webhook endpoints list with status and success rates">
        <View style={s.page}>
          <ProtoNav variant="admin" activeTab="dashboard" />
          <View style={s.content}>
            <View style={s.headerRow}>
              <Text style={s.heading}>Webhooks</Text>
              <TouchableOpacity style={s.addBtn}>
                <Feather name="plus" size={14} color={TEXT} />
                <Text style={s.addBtnText}>Add Webhook</Text>
              </TouchableOpacity>
            </View>

            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text style={[s.th, { flex: 3 }]}>URL</Text>
                <Text style={[s.th, { flex: 2.5 }]}>Events</Text>
                <Text style={[s.th, { flex: 0.8 }]}>Status</Text>
                <Text style={[s.th, { flex: 1 }]}>Last Triggered</Text>
                <Text style={[s.th, { flex: 0.8 }]}>Success %</Text>
              </View>
              {WEBHOOKS.map((w, i) => (
                <TouchableOpacity key={i} style={s.tableRow} onPress={() => router.push('/proto/states/admin-webhook-detail' as any)}>
                  <Text style={[s.td, s.mono, { flex: 3 }]} numberOfLines={1}>{w.url}</Text>
                  <Text style={[s.tdMuted, { flex: 2.5 }]} numberOfLines={1}>{w.events}</Text>
                  <View style={{ flex: 0.8 }}><StatusBadge status={w.status} /></View>
                  <Text style={[s.tdMuted, { flex: 1 }]}>{w.lastTriggered}</Text>
                  <Text style={[s.td, { flex: 0.8 }]}>{w.successRate}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </StateSection>

      {/* STATE: ADD_WEBHOOK */}
      <StateSection title="ADD_WEBHOOK" description="Add webhook form with URL, events, and secret key">
        <View style={s.page}>
          <ProtoNav variant="admin" activeTab="dashboard" />
          <View style={s.content}>
            <Text style={s.heading}>Webhooks</Text>

            <View style={s.modalOverlay}>
              <View style={s.modal}>
                <Text style={s.modalTitle}>Add Webhook</Text>

                <Text style={s.formLabel}>Endpoint URL</Text>
                <View style={s.formInput}>
                  <Text style={s.formInputText}>https://</Text>
                </View>

                <Text style={s.formLabel}>Events</Text>
                <View style={s.checkboxList}>
                  {ALL_EVENTS.map((e) => (
                    <TouchableOpacity key={e} style={s.checkboxRow} onPress={() => toggleEvent(e)}>
                      <View style={[s.checkbox, selectedEvents.has(e) && s.checkboxChecked]}>
                        {selectedEvents.has(e) && <Feather name="check" size={10} color={TEXT} />}
                      </View>
                      <Text style={s.checkboxLabel}>{e}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={s.formLabel}>Secret Key</Text>
                <View style={s.formInput}>
                  <Text style={[s.formInputText, s.mono]}>whsec_a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5</Text>
                  <TouchableOpacity><Feather name="refresh-cw" size={14} color={MUTED} /></TouchableOpacity>
                </View>

                <View style={s.modalActions}>
                  <TouchableOpacity style={s.btnOutline}><Text style={s.btnOutlineText}>Cancel</Text></TouchableOpacity>
                  <TouchableOpacity style={s.btnPrimary}><Text style={s.btnPrimaryText}>Save</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </StateSection>

      {/* STATE: LOADING */}
      <StateSection title="LOADING" description="Skeleton loading state">
        <View style={s.page}>
          <ProtoNav variant="admin" activeTab="dashboard" />
          <View style={s.content}>
            <Text style={s.heading}>Webhooks</Text>
            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text style={[s.th, { flex: 3 }]}>URL</Text>
                <Text style={[s.th, { flex: 2.5 }]}>Events</Text>
                <Text style={[s.th, { flex: 0.8 }]}>Status</Text>
                <Text style={[s.th, { flex: 1 }]}>Last Triggered</Text>
                <Text style={[s.th, { flex: 0.8 }]}>Success %</Text>
              </View>
              {[1, 2, 3].map(i => (
                <View key={i} style={s.tableRow}>
                  {[3, 2.5, 0.8, 1, 0.8].map((f, j) => (
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

      {/* STATE: WEBHOOK_TEST */}
      <StateSection title="WEBHOOK_TEST" description="Test panel with event dropdown and request/response preview">
        <View style={s.page}>
          <ProtoNav variant="admin" activeTab="dashboard" />
          <View style={s.content}>
            <Text style={s.heading}>Webhooks</Text>

            <View style={s.testPanel}>
              <Text style={s.testTitle}>Test Webhook</Text>
              <Text style={[s.tdMuted, s.mono]}>https://api.partner1.com/hooks/chess</Text>

              <Text style={s.formLabel}>Send Test Event</Text>
              <View style={s.selectWrap}>
                <Text style={s.selectText}>payment.completed</Text>
                <Feather name="chevron-down" size={14} color={MUTED} />
              </View>

              <TouchableOpacity style={s.sendBtn}>
                <Feather name="send" size={14} color={TEXT} />
                <Text style={s.sendBtnText}>Send Test</Text>
              </TouchableOpacity>

              <Text style={s.formLabel}>Request</Text>
              <View style={s.codeBlock}>
                <Text style={s.codeText}>{'POST /hooks/chess HTTP/1.1'}</Text>
                <Text style={s.codeText}>{'Content-Type: application/json'}</Text>
                <Text style={s.codeText}>{'X-Webhook-Signature: sha256=abc123...'}</Text>
                <Text style={s.codeText}>{''}</Text>
                <Text style={s.codeText}>{'{'}</Text>
                <Text style={s.codeText}>{'  "event": "payment.completed",'}</Text>
                <Text style={s.codeText}>{'  "data": { "amount": 50, "currency": "EUR" }'}</Text>
                <Text style={s.codeText}>{'}'}</Text>
              </View>

              <Text style={s.formLabel}>Response</Text>
              <View style={[s.codeBlock, { borderColor: GREEN + '44' }]}>
                <Text style={s.codeText}>{'HTTP/1.1 200 OK'}</Text>
                <Text style={s.codeText}>{'Content-Type: application/json'}</Text>
                <Text style={s.codeText}>{''}</Text>
                <Text style={s.codeText}>{'{ "received": true }'}</Text>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 6,
    backgroundColor: ACCENT + '22',
    borderWidth: 1,
    borderColor: ACCENT + '44',
  },
  addBtnText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: TEXT,
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
    backgroundColor: '#141a28',
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
  mono: {
    fontFamily: 'Courier',
    fontSize: Typography.sizes.xs,
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
  skeleton: {
    backgroundColor: '#2a3040',
    borderRadius: 4,
  },
  modalOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  modal: {
    backgroundColor: CARD,
    borderRadius: 12,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 480,
    borderWidth: 1,
    borderColor: BORDER,
    gap: Spacing.md,
  },
  modalTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fontFamilySemiBold,
    color: TEXT,
    textAlign: 'center',
  },
  formLabel: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilySemiBold,
    color: TEXT,
    marginTop: Spacing.sm,
  },
  formInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141a28',
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
    color: MUTED,
    flex: 1,
  },
  checkboxList: {
    gap: Spacing.sm,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#141a28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: ACCENT + '44',
    borderColor: ACCENT,
  },
  checkboxLabel: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: TEXT,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  btnOutline: {
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
  btnPrimary: {
    backgroundColor: ACCENT,
    borderRadius: 6,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  btnPrimaryText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: '#fff',
  },
  testPanel: {
    backgroundColor: CARD,
    borderRadius: 8,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: BORDER,
    gap: Spacing.sm,
  },
  testTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fontFamilySemiBold,
    color: TEXT,
  },
  selectWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#141a28',
    borderRadius: 6,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: BORDER,
  },
  selectText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: TEXT,
  },
  sendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 6,
    backgroundColor: BLUE + '22',
    borderWidth: 1,
    borderColor: BLUE + '44',
  },
  sendBtnText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: BLUE,
  },
  codeBlock: {
    backgroundColor: '#0a0e14',
    borderRadius: 6,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: BORDER,
  },
  codeText: {
    fontSize: Typography.sizes.xs,
    fontFamily: 'Courier',
    color: MUTED,
    lineHeight: 18,
  },
});
