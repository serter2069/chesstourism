import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import StateSection from '../StateSection';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import { protoMeta } from '../../../constants/protoMeta';
import { pages } from '../../../constants/pageRegistry';

const BREAKPOINT = 900;

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  guest: { bg: Colors.backgroundAlt, text: Colors.textMuted },
  player: { bg: Colors.statusSuccessBg, text: Colors.successGreen },
  commissar: { bg: Colors.statusInfoBg, text: Colors.primary },
  admin: { bg: Colors.statusErrorBg, text: Colors.error },
};

function getRoleBadgeColors(roleId: string) {
  return ROLE_COLORS[roleId] || ROLE_COLORS.guest;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function PageChip({ id, label }: { id: string; label?: string }) {
  const router = useRouter();
  const page = pages.find((p) => p.id === id);
  return (
    <Pressable
      onPress={() => router.push(`/proto/states/${id}` as any)}
      style={({ pressed }) => [s.pageChip, pressed && { opacity: 0.7 }]}
    >
      <Text style={s.pageChipText}>{label || page?.title || id}</Text>
    </Pressable>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <Text style={s.sectionTitle}>{children}</Text>;
}

function Divider() {
  return <View style={s.divider} />;
}

// ─── Section 1: Project Header ────────────────────────────────────────────────

function ProjectHeader() {
  const { width } = useWindowDimensions();
  const isWide = width >= BREAKPOINT;

  const stats = [
    { label: '50+ countries' },
    { label: 'FIDE-rated' },
    { label: '4 roles' },
    { label: `${pages.length} screens` },
  ];

  return (
    <View style={s.headerBlock}>
      <Text style={s.projectTitle}>{protoMeta.project}</Text>
      <Text style={s.tagline}>{protoMeta.fullName}</Text>
      <Text style={s.descriptionText}>{protoMeta.description}</Text>
      <View style={[s.chipRow, !isWide && { flexWrap: 'wrap' }]}>
        {stats.map((st) => (
          <View key={st.label} style={s.statChip}>
            <Text style={s.statChipText}>{st.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Section 2: Roles ─────────────────────────────────────────────────────────

function RolesSection() {
  const { width } = useWindowDimensions();
  const isWide = width >= BREAKPOINT;

  return (
    <View>
      <SectionTitle>Roles</SectionTitle>
      <View style={[s.rolesGrid, isWide && { flexDirection: 'row' }]}>
        {protoMeta.roles.map((role) => {
          const colors = getRoleBadgeColors(role.id);
          return (
            <View key={role.id} style={[s.roleCard, isWide && { flex: 1 }]}>
              <View style={[s.roleBadge, { backgroundColor: colors.bg }]}>
                <Text style={[s.roleBadgeText, { color: colors.text }]}>{role.id.toUpperCase()}</Text>
              </View>
              <Text style={s.roleLabel}>{role.label}</Text>
              <Text style={s.roleDesc}>{role.description}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ─── Section 3: User Scenarios ────────────────────────────────────────────────

function extractScreenIds(step: string): string[] {
  const matches: string[] = [];
  // Match route patterns like /tournaments, /(auth)/login, /tournaments/:id
  const routeRegex = /\(([^)]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = routeRegex.exec(step)) !== null) {
    // Check if this matches a page route segment
    const segment = m[1];
    const found = pages.find((p) => p.route.includes(segment) || p.id === segment);
    if (found) matches.push(found.id);
  }
  // Also check for direct page id references in the step text
  for (const page of pages) {
    if (step.includes(`/${page.id}`) || step.includes(`(${page.id})`)) {
      if (!matches.includes(page.id)) matches.push(page.id);
    }
  }
  return matches;
}

function ScenariosSection() {
  // Derive role from scenario id
  const scenarioRoleMap: Record<string, string> = {
    'player-register': 'player',
    'commissar-create-tournament': 'commissar',
    'org-apply': 'guest',
    'admin-moderation': 'admin',
  };

  return (
    <View>
      <SectionTitle>User Scenarios</SectionTitle>
      <View style={s.scenariosContainer}>
        {protoMeta.scenarios.map((scenario, idx) => {
          const roleId = scenarioRoleMap[scenario.id] || 'guest';
          const colors = getRoleBadgeColors(roleId);
          return (
            <View key={scenario.id} style={s.scenarioCard}>
              <View style={s.scenarioHeader}>
                <Text style={s.scenarioNumber}>#{idx + 1}</Text>
                <Text style={s.scenarioTitle}>{scenario.label}</Text>
                <View style={[s.roleBadge, { backgroundColor: colors.bg, marginLeft: 'auto' }]}>
                  <Text style={[s.roleBadgeText, { color: colors.text }]}>{roleId.toUpperCase()}</Text>
                </View>
              </View>
              <View style={s.stepsList}>
                {scenario.steps.map((step, stepIdx) => {
                  const screenIds = extractScreenIds(step);
                  return (
                    <View key={stepIdx} style={s.stepRow}>
                      <View style={s.stepNumberWrap}>
                        <Text style={s.stepNumber}>{stepIdx + 1}</Text>
                      </View>
                      <View style={s.stepContent}>
                        <Text style={s.stepText}>{step}</Text>
                        {screenIds.length > 0 && (
                          <View style={s.stepChips}>
                            {screenIds.map((id) => (
                              <PageChip key={id} id={id} />
                            ))}
                          </View>
                        )}
                      </View>
                      {stepIdx < scenario.steps.length - 1 && (
                        <Text style={s.stepArrow}>{'-->'}</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ─── Section 4: Progress Board ────────────────────────────────────────────────

function ProgressSection() {
  const { width } = useWindowDimensions();
  const isWide = width >= BREAKPOINT;

  const total = pages.length;
  const protoPages = pages.filter((p) => (p.qaCycles ?? 0) >= 1 && (p.qaCycles ?? 0) < 5);
  const reviewPages = pages.filter((p) => (p.qaCycles ?? 0) >= 5);
  const approvedCount = 0;
  const progressPct = Math.round(((reviewPages.length + approvedCount) / total) * 100);

  const groups = ['Public', 'Auth', 'Dashboard', 'Commissioner', 'Admin'] as const;

  return (
    <View>
      <SectionTitle>Progress Board</SectionTitle>

      {/* Summary chips */}
      <View style={[s.chipRow, { marginBottom: Spacing.lg }]}>
        <View style={s.progressChip}>
          <Text style={s.progressChipLabel}>Total</Text>
          <Text style={s.progressChipValue}>{total}</Text>
        </View>
        <View style={s.progressChip}>
          <Text style={s.progressChipLabel}>Proto (1-4)</Text>
          <Text style={s.progressChipValue}>{protoPages.length}</Text>
        </View>
        <View style={s.progressChip}>
          <Text style={s.progressChipLabel}>Review (5+)</Text>
          <Text style={s.progressChipValue}>{reviewPages.length}</Text>
        </View>
        <View style={s.progressChip}>
          <Text style={s.progressChipLabel}>Approved</Text>
          <Text style={s.progressChipValue}>{approvedCount}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={s.progressBarOuter}>
        <View style={[s.progressBarInner, { width: `${Math.max(progressPct, 2)}%` }]} />
      </View>
      <Text style={s.progressLabel}>{progressPct}% ready for review</Text>

      <Divider />

      {/* Pages table grouped */}
      {groups.map((group) => {
        const groupPages = pages.filter((p) => p.group === group);
        if (groupPages.length === 0) return null;
        return (
          <View key={group} style={s.groupBlock}>
            <Text style={s.groupTitle}>{group}</Text>
            <View style={s.tableHeader}>
              <Text style={[s.tableHeaderCell, { flex: 3 }]}>Page</Text>
              <Text style={[s.tableHeaderCell, { flex: 1, textAlign: 'center' }]}>QA Cycles</Text>
              <Text style={[s.tableHeaderCell, { flex: 1, textAlign: 'center' }]}>Score</Text>
            </View>
            {groupPages.map((p) => {
              const qc = p.qaCycles ?? 0;
              const qs = p.qaScore ?? 0;
              return (
                <Pressable
                  key={p.id}
                  onPress={() => {}}
                  style={s.tableRow}
                >
                  <View style={{ flex: 3 }}>
                    <PageChip id={p.id} label={p.title} />
                  </View>
                  <Text style={[s.tableCell, { flex: 1, textAlign: 'center' }]}>{qc}/5</Text>
                  <Text style={[s.tableCell, { flex: 1, textAlign: 'center' }]}>{qs}/12</Text>
                </Pressable>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

// ─── Section 5: Navigation Map ────────────────────────────────────────────────

function NavMapSection() {
  return (
    <View>
      <SectionTitle>Navigation Map</SectionTitle>
      <View style={s.navMapContainer}>
        {protoMeta.navFlows.map((flow, idx) => (
          <View key={idx} style={s.navFlowRow}>
            <PageChip id={flow.from} />
            <Text style={s.navArrow}>{'-->'}</Text>
            <PageChip id={flow.to} />
            <Text style={s.navLabel}>[{flow.label}]</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function OverviewStates() {
  return (
    <StateSection title="DEFAULT" description="Project overview and documentation">
      <ScrollView style={s.root} contentContainerStyle={s.rootContent}>
        <ProjectHeader />
        <Divider />
        <RolesSection />
        <Divider />
        <ScenariosSection />
        <Divider />
        <ProgressSection />
        <Divider />
        <NavMapSection />
      </ScrollView>
    </StateSection>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  rootContent: {
    padding: Spacing.xl,
    gap: Spacing['2xl'],
  },

  // Header
  headerBlock: {
    gap: Spacing.md,
  },
  projectTitle: {
    fontSize: Typography.sizes['3xl'],
    fontFamily: Typography.fontFamilyHeading,
    color: Colors.primary,
  },
  tagline: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fontFamilySemiBold,
    color: Colors.gold,
  },
  descriptionText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
    lineHeight: 24,
  },

  // Chips
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  statChip: {
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  statChipText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilySemiBold,
    color: Colors.primary,
  },

  // Section title
  sectionTitle: {
    fontSize: Typography.sizes['2xl'],
    fontFamily: Typography.fontFamilyHeading,
    color: Colors.primary,
    marginBottom: Spacing.lg,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },

  // Roles
  rolesGrid: {
    gap: Spacing.md,
  },
  roleCard: {
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleBadgeText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilyBold,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.8,
  },
  roleLabel: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fontFamilySemiBold,
    color: Colors.text,
  },
  roleDesc: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
    lineHeight: 20,
  },

  // Scenarios
  scenariosContainer: {
    gap: Spacing.lg,
  },
  scenarioCard: {
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  scenarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  scenarioNumber: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyBold,
    color: Colors.gold,
  },
  scenarioTitle: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamilySemiBold,
    color: Colors.text,
    flex: 1,
  },
  stepsList: {
    gap: Spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  stepNumberWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilyBold,
    color: Colors.white,
  },
  stepContent: {
    flex: 1,
    gap: 4,
  },
  stepText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: Colors.text,
    lineHeight: 20,
  },
  stepChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  stepArrow: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    marginTop: 4,
  },

  // Page chip
  pageChip: {
    backgroundColor: Colors.statusInfoBg,
    borderRadius: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  pageChipText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilySemiBold,
    color: Colors.primary,
  },

  // Progress
  progressChip: {
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: Spacing.md,
    alignItems: 'center',
    minWidth: 80,
  },
  progressChipLabel: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  progressChipValue: {
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.fontFamilyBold,
    color: Colors.primary,
  },
  progressBarOuter: {
    height: 8,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressBarInner: {
    height: '100%',
    backgroundColor: Colors.gold,
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },

  // Table
  groupBlock: {
    marginTop: Spacing.lg,
  },
  groupTitle: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fontFamilySemiBold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 4,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: 2,
  },
  tableHeaderCell: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilySemiBold,
    color: Colors.tableHeaderText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tableCell: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: Colors.text,
  },

  // Nav map
  navMapContainer: {
    gap: Spacing.sm,
  },
  navFlowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  navArrow: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyBold,
    color: Colors.gold,
  },
  navLabel: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
  },
});
