import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import StateSection from '../StateSection';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import { projectMeta } from '../../../constants/protoMeta';
import { pages } from '../../../constants/pageRegistry';

// ─── Role Card ─────────────────────────────────────────────────────────────

function RoleCard({ role }: { role: typeof projectMeta.roles[0] }) {
  const roleScreens = pages.filter((p) => {
    const nav = p.nav;
    if (role.id === 'GUEST') return nav === 'public' || nav === 'none';
    if (role.id === 'PARTICIPANT') return nav === 'client';
    if (role.id === 'COMMISSIONER') return nav === 'client';
    if (role.id === 'ADMIN') return nav === 'admin';
    return false;
  });

  return (
    <View style={s.roleCard}>
      <View style={s.roleHeader}>
        <View style={s.roleBadge}>
          <Text style={s.roleBadgeText}>{role.id}</Text>
        </View>
        <Text style={s.roleTitle}>{role.title}</Text>
      </View>
      <Text style={s.roleDesc}>{role.description}</Text>
      <Text style={s.roleScreenCount}>{roleScreens.length} screens</Text>
    </View>
  );
}

// ─── Scenario Card ─────────────────────────────────────────────────────────

function ScenarioCard({ scenario }: { scenario: typeof projectMeta.scenarios[0] }) {
  const router = useRouter();
  return (
    <View style={s.scenarioCard}>
      <View style={s.scenarioHeader}>
        <Text style={s.scenarioId}>{scenario.id}</Text>
        <Text style={s.scenarioTitle}>{scenario.title}</Text>
      </View>
      <View style={s.scenarioRole}>
        <Feather name="user" size={12} color={Colors.gold} />
        <Text style={s.scenarioRoleText}>{scenario.role}</Text>
      </View>
      <View style={s.scenarioSteps}>
        {scenario.steps.map((step, i) => (
          <View key={i} style={s.stepRow}>
            <TouchableOpacity
              style={s.stepLink}
              activeOpacity={0.7}
              onPress={() => router.push(`/proto/states/${step.screen}` as any)}
            >
              <Feather name="play-circle" size={14} color={Colors.primary} />
              <Text style={s.stepScreen}>{step.screen}</Text>
            </TouchableOpacity>
            {i < scenario.steps.length - 1 && (
              <Feather name="chevron-right" size={12} color={Colors.border} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Progress Bar ──────────────────────────────────────────────────────────

function ProgressSection() {
  const total = pages.length;
  const proto = pages.filter((p) => (p.qaCycles ?? 0) > 0 && (p.qaCycles ?? 0) < 5).length;
  const review = pages.filter((p) => (p.qaCycles ?? 0) >= 5).length;
  const approved = 0;
  const pct = Math.round(((proto + review + approved) / total) * 100);

  return (
    <View style={s.progressCard}>
      <Text style={s.progressTitle}>Progress</Text>
      <View style={s.progressStats}>
        <View style={s.progressStat}>
          <Text style={s.progressNum}>{total}</Text>
          <Text style={s.progressLabel}>Total</Text>
        </View>
        <View style={s.progressStat}>
          <Text style={[s.progressNum, { color: Colors.statusWarningText }]}>{proto}</Text>
          <Text style={s.progressLabel}>Proto</Text>
        </View>
        <View style={s.progressStat}>
          <Text style={[s.progressNum, { color: Colors.primary }]}>{review}</Text>
          <Text style={s.progressLabel}>Review</Text>
        </View>
        <View style={s.progressStat}>
          <Text style={[s.progressNum, { color: Colors.eloPositive }]}>{approved}</Text>
          <Text style={s.progressLabel}>Approved</Text>
        </View>
      </View>
      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${pct}%` as any }]} />
      </View>
      <Text style={s.progressPct}>{pct}% complete</Text>
    </View>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function OverviewStates() {
  return (
    <ScrollView style={s.root} contentContainerStyle={s.content}>
      <StateSection title="DEFAULT" description="Project overview for ChessTourism">
        <View style={s.pageShell}>
          {/* Project Header */}
          <View style={s.projectHeader}>
            <View style={s.logoMark}>
              <View style={[s.logoDot, { backgroundColor: Colors.gold }]} />
              <View style={[s.logoDot, { backgroundColor: Colors.primary }]} />
              <View style={[s.logoDot, { backgroundColor: Colors.primary }]} />
              <View style={[s.logoDot, { backgroundColor: Colors.gold }]} />
            </View>
            <View style={s.projectTitles}>
              <Text style={s.projectName}>
                Chess<Text style={s.projectNameGold}>Tourism</Text>
              </Text>
              <Text style={s.projectTagline}>{projectMeta.tagline}</Text>
            </View>
          </View>
          <Text style={s.projectDesc}>{projectMeta.description}</Text>

          {/* Roles */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Roles</Text>
            <View style={s.rolesGrid}>
              {projectMeta.roles.map((role) => (
                <RoleCard key={role.id} role={role} />
              ))}
            </View>
          </View>

          {/* Scenarios */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>Scenarios</Text>
            <View style={s.scenariosList}>
              {projectMeta.scenarios.map((sc) => (
                <ScenarioCard key={sc.id} scenario={sc} />
              ))}
            </View>
          </View>

          {/* Progress */}
          <View style={s.section}>
            <ProgressSection />
          </View>
        </View>
      </StateSection>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.backgroundAlt },
  content: { padding: Spacing.lg, paddingBottom: Spacing['3xl'] },
  pageShell: { gap: Spacing.xl },
  // Project header
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  logoMark: { width: 40, height: 40, flexDirection: 'row', flexWrap: 'wrap' },
  logoDot: { width: 20, height: 20 },
  projectTitles: { flex: 1 },
  projectName: {
    fontSize: Typography.sizes['3xl'],
    fontFamily: Typography.fontFamilyHeading,
    fontWeight: '700',
    color: Colors.white,
  },
  projectNameGold: { color: Colors.gold },
  projectTagline: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  projectDesc: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
    lineHeight: 24,
  },
  // Sections
  section: { gap: Spacing.md },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fontFamilyBold,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: Colors.gold,
  },
  // Roles
  rolesGrid: { gap: Spacing.md },
  roleCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    borderLeftColor: Colors.gold,
  },
  roleHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xs },
  roleBadge: {
    backgroundColor: Colors.backgroundAlt,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleBadgeText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilyBold,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  roleTitle: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamilySemiBold,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  roleDesc: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  roleScreenCount: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamily,
    color: Colors.gold,
    marginTop: Spacing.xs,
  },
  // Scenarios
  scenariosList: { gap: Spacing.md },
  scenarioCard: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scenarioHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xs },
  scenarioId: {
    fontSize: Typography.sizes.xs,
    fontFamily: 'monospace',
    color: Colors.gold,
    fontWeight: '700',
  },
  scenarioTitle: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamilySemiBold,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  scenarioRole: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.sm },
  scenarioRoleText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilyMedium,
    color: Colors.textMuted,
  },
  scenarioSteps: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, alignItems: 'center' },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  stepLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 4,
  },
  stepScreen: {
    fontSize: Typography.sizes.xs,
    fontFamily: 'monospace',
    color: Colors.primary,
  },
  // Progress
  progressCard: {
    padding: Spacing.xl,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fontFamilyBold,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.lg,
  },
  progressStat: { alignItems: 'center' },
  progressNum: {
    fontSize: Typography.sizes['2xl'],
    fontFamily: Typography.fontFamilyBold,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  progressLabel: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
    marginTop: 2,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.gold,
    borderRadius: 4,
  },
  progressPct: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    textAlign: 'right',
  },
});
