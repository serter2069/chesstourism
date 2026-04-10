import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ProtoPage, ProtoStatus } from '../../constants/protoRegistry';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';

interface ProtoCardProps {
  page: ProtoPage;
}

const statusConfig: Record<ProtoStatus, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pending', bg: Colors.backgroundAlt, text: Colors.textMuted },
  proto: { label: 'Proto', bg: Colors.statusWarningBg, text: Colors.statusWarningText },
  approved: { label: 'Approved', bg: Colors.statusSuccessBg, text: Colors.statusSuccessText },
};

export default function ProtoCard({ page }: ProtoCardProps) {
  const router = useRouter();
  const status = statusConfig[page.status];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/proto/states/${page.id}` as any)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${page.pagId} ${page.title}`}
    >
      <View style={styles.topRow}>
        <View style={styles.pagIdBadge}>
          <Text style={styles.pagId}>{page.pagId}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusText, { color: status.text }]}>{status.label}</Text>
        </View>
      </View>

      <Text style={styles.title}>{page.title}</Text>
      <Text style={styles.route}>{page.route}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.statesCount}>{page.states.length} states</Text>
        <View style={styles.rolesRow}>
          {page.roles.map((role) => (
            <View key={role} style={styles.roleBadge}>
              <Text style={styles.roleText}>{role}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  pagIdBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
  },
  pagId: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilyBold,
    fontWeight: Typography.weights.bold,
    color: Colors.gold,
    letterSpacing: 0.8,
  },
  statusBadge: {
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
  },
  statusText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilySemiBold,
    fontWeight: Typography.weights.semibold,
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontFamily: Typography.fontFamilyHeading,
    color: Colors.text,
    marginBottom: 2,
  },
  route: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statesCount: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilyMedium,
    color: Colors.textMuted,
  },
  rolesRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  roleBadge: {
    backgroundColor: Colors.statusInfoBg,
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
  },
  roleText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilySemiBold,
    fontWeight: Typography.weights.semibold,
    color: Colors.statusInfoText,
  },
});
