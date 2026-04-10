import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { PageEntry, NavVariant } from '../../constants/pageRegistry';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';

interface ProtoCardProps {
  page: PageEntry;
}

const navColors: Record<NavVariant, { bg: string; text: string }> = {
  none: { bg: Colors.backgroundAlt, text: Colors.textMuted },
  public: { bg: Colors.statusInfoBg, text: Colors.statusInfoText },
  auth: { bg: Colors.statusWarningBg, text: Colors.statusWarningText },
  client: { bg: Colors.statusSuccessBg, text: Colors.statusSuccessText },
  admin: { bg: '#2d1a1a', text: '#e07070' },
};

export default function ProtoCard({ page }: ProtoCardProps) {
  const router = useRouter();
  const nav = navColors[page.nav];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/proto/states/${page.id}` as any)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={page.title}
    >
      <View style={styles.topRow}>
        <View style={[styles.navBadge, { backgroundColor: nav.bg }]}>
          <Text style={[styles.navText, { color: nav.text }]}>{page.nav}</Text>
        </View>
        <Text style={styles.statesCount}>{page.stateCount} states</Text>
      </View>

      <Text style={styles.title}>{page.title}</Text>
      <Text style={styles.route}>{page.route}</Text>
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
  navBadge: {
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
  },
  navText: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilySemiBold,
    fontWeight: Typography.weights.semibold,
  },
  statesCount: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilyMedium,
    color: Colors.textMuted,
  },
  title: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamilyHeading,
    color: Colors.text,
    marginBottom: 2,
  },
  route: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
  },
});
