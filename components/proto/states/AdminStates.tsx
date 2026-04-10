import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import ProtoNav from '../ProtoNav';
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

function StatCard({ label, value, icon, iconColor }: { label: string; value: string; icon: string; iconColor?: string }) {
  return (
    <View style={s.statCard}>
      <View style={s.statIconWrap}>
        <Feather name={icon as any} size={20} color={iconColor || ACCENT} />
      </View>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

function StatusDot({ color }: { color: string }) {
  return <View style={[s.dot, { backgroundColor: color }]} />;
}

function SkeletonBox({ width, height }: { width: number | string; height: number }) {
  return <View style={[s.skeleton, { width: width as any, height }]} />;
}

const ACTIVITIES = [
  { icon: 'user-plus', text: 'Magnus Eriksson registered', time: '2 min ago' },
  { icon: 'award', text: 'Tbilisi Open 2025 created', time: '8 min ago' },
  { icon: 'dollar-sign', text: 'Payment received - EUR 50.00', time: '15 min ago' },
  { icon: 'alert-circle', text: 'Dispute opened - Oslo Rapid Cup', time: '22 min ago' },
  { icon: 'user-plus', text: 'Anna Petrov registered', time: '30 min ago' },
  { icon: 'award', text: 'Warsaw Classical 2025 started', time: '45 min ago' },
  { icon: 'dollar-sign', text: 'Payment received - EUR 120.00', time: '1 hr ago' },
  { icon: 'check-circle', text: 'Tournament Reykjavik Open completed', time: '2 hr ago' },
  { icon: 'user-plus', text: 'Giorgi Beridze approved as Commissar', time: '3 hr ago' },
  { icon: 'dollar-sign', text: 'Payout processed - EUR 340.00', time: '4 hr ago' },
];

const QUICK_LINKS = [
  { icon: 'users', label: 'Manage Users' },
  { icon: 'award', label: 'Tournaments' },
  { icon: 'shield', label: 'Moderation' },
  { icon: 'dollar-sign', label: 'Finances' },
  { icon: 'settings', label: 'Webhooks' },
  { icon: 'bar-chart-2', label: 'Analytics' },
];

export default function AdminStates() {
  return (
    <ScrollView style={{ backgroundColor: BG }}>
      {/* STATE: DEFAULT */}
      <StateSection title="DEFAULT" description="Admin dashboard with stats, activity feed, system status">
        <View style={s.page}>
          <ProtoNav variant="admin" activeTab="dashboard" />
          <View style={s.content}>
            <Text style={s.heading}>Admin Dashboard</Text>

            <View style={s.statsRow}>
              <StatCard label="Total Users" value="2,847" icon="users" />
              <StatCard label="Active Tournaments" value="12" icon="award" />
              <StatCard label="Pending Commissar Requests" value="5" icon="user-check" />
              <StatCard label="Revenue This Month" value="EUR 12,450" icon="dollar-sign" />
            </View>

            <Text style={s.sectionTitle}>Recent Activity</Text>
            <View style={s.card}>
              {ACTIVITIES.map((a, i) => (
                <View key={i} style={[s.activityRow, i < ACTIVITIES.length - 1 && s.activityBorder]}>
                  <Feather name={a.icon as any} size={14} color={MUTED} />
                  <Text style={s.activityText}>{a.text}</Text>
                  <Text style={s.activityTime}>{a.time}</Text>
                </View>
              ))}
            </View>

            <Text style={s.sectionTitle}>System Status</Text>
            <View style={s.statusBar}>
              <View style={s.statusItem}><StatusDot color={GREEN} /><Text style={s.statusText}>API: OK</Text></View>
              <View style={s.statusItem}><StatusDot color={GREEN} /><Text style={s.statusText}>DB: OK</Text></View>
              <View style={s.statusItem}><StatusDot color={GREEN} /><Text style={s.statusText}>Payments: OK</Text></View>
            </View>

            <Text style={s.sectionTitle}>Quick Links</Text>
            <View style={s.quickLinks}>
              {QUICK_LINKS.map((l, i) => (
                <TouchableOpacity key={i} style={s.quickLink} activeOpacity={0.7}>
                  <Feather name={l.icon as any} size={16} color={ACCENT} />
                  <Text style={s.quickLinkText}>{l.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </StateSection>

      {/* STATE: ALERT_STATE */}
      <StateSection title="ALERT_STATE" description="Payment gateway degraded warning">
        <View style={s.page}>
          <ProtoNav variant="admin" activeTab="dashboard" />
          <View style={s.content}>
            <View style={s.alertBanner}>
              <Feather name="alert-triangle" size={16} color="#ffc107" />
              <Text style={s.alertText}>Payment gateway degraded - some transactions may fail</Text>
            </View>

            <Text style={s.heading}>Admin Dashboard</Text>

            <View style={s.statsRow}>
              <StatCard label="Total Users" value="2,847" icon="users" />
              <StatCard label="Active Tournaments" value="12" icon="award" />
              <StatCard label="Pending Commissar Requests" value="5" icon="user-check" />
              <StatCard label="Revenue This Month" value="EUR 12,450" icon="dollar-sign" />
            </View>

            <Text style={s.sectionTitle}>System Status</Text>
            <View style={s.statusBar}>
              <View style={s.statusItem}><StatusDot color={GREEN} /><Text style={s.statusText}>API: OK</Text></View>
              <View style={s.statusItem}><StatusDot color={GREEN} /><Text style={s.statusText}>DB: OK</Text></View>
              <View style={s.statusItem}><StatusDot color={YELLOW} /><Text style={[s.statusText, { color: YELLOW }]}>Payments: WARNING</Text></View>
            </View>
          </View>
        </View>
      </StateSection>

      {/* STATE: LOADING */}
      <StateSection title="LOADING" description="Skeleton loading state">
        <View style={s.page}>
          <ProtoNav variant="admin" activeTab="dashboard" />
          <View style={s.content}>
            <Text style={s.heading}>Admin Dashboard</Text>
            <View style={s.statsRow}>
              {[1, 2, 3, 4].map(i => (
                <View key={i} style={s.statCard}>
                  <SkeletonBox width={40} height={40} />
                  <SkeletonBox width={60} height={20} />
                  <SkeletonBox width={80} height={12} />
                </View>
              ))}
            </View>
            <Text style={s.sectionTitle}>Recent Activity</Text>
            <View style={s.card}>
              {[1, 2, 3, 4, 5].map(i => (
                <View key={i} style={[s.activityRow, i < 5 && s.activityBorder]}>
                  <SkeletonBox width={14} height={14} />
                  <SkeletonBox width={'60%'} height={14} />
                  <SkeletonBox width={50} height={12} />
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
    fontSize: Typography.sizes['2xl'],
    fontFamily: Typography.fontFamilyHeading,
    color: TEXT,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fontFamilySemiBold,
    color: TEXT,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: CARD,
    borderRadius: 8,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: BORDER,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a1a2a',
    alignItems: 'center',
    justifyContent: 'center',
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
  card: {
    backgroundColor: CARD,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  activityBorder: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  activityText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: TEXT,
  },
  activityTime: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamily,
    color: MUTED,
  },
  statusBar: {
    flexDirection: 'row',
    backgroundColor: CARD,
    borderRadius: 8,
    padding: Spacing.md,
    gap: Spacing.xl,
    borderWidth: 1,
    borderColor: BORDER,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: TEXT,
  },
  quickLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: CARD,
    borderRadius: 6,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: BORDER,
  },
  quickLinkText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: TEXT,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#2d2a1a',
    borderRadius: 6,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#5a4a1a',
  },
  alertText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: '#ffc107',
    flex: 1,
  },
  skeleton: {
    backgroundColor: '#2a3040',
    borderRadius: 4,
  },
});
