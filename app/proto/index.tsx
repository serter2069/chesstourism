import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { protoPages, ProtoPage } from '../../constants/protoRegistry';
import ProtoCard from '../../components/proto/ProtoCard';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { usePlatform } from '../../hooks/usePlatform';

function groupPages(pages: ProtoPage[]): Record<string, ProtoPage[]> {
  return pages.reduce<Record<string, ProtoPage[]>>((acc, page) => {
    if (!acc[page.group]) acc[page.group] = [];
    acc[page.group].push(page);
    return acc;
  }, {});
}

export default function ProtoDashboard() {
  const { contentMaxWidth, columns } = usePlatform();
  const grouped = groupPages(protoPages);
  const groups = Object.keys(grouped).sort();
  const approvedCount = protoPages.filter((p) => p.status === 'approved').length;
  const total = protoPages.length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.inner, { maxWidth: contentMaxWidth }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Proto Dashboard</Text>
            <Text style={styles.subtitle}>
              {total} pages · {approvedCount}/{total} approved
            </Text>
          </View>

          {/* Groups */}
          {groups.map((group) => (
            <View key={group} style={styles.groupSection}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupTitle}>{group}</Text>
                <Text style={styles.groupCount}>{grouped[group].length}</Text>
              </View>
              <View style={[styles.grid, { gap: Spacing.md }]}>
                {grouped[group].map((page) => (
                  <View
                    key={page.id}
                    style={[
                      styles.gridItem,
                      { width: columns > 1 ? `${Math.floor(100 / columns) - 1}%` : '100%' },
                    ]}
                  >
                    <ProtoCard page={page} />
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },
  scrollContent: {
    alignItems: 'center',
    padding: Spacing.lg,
    paddingBottom: Spacing['3xl'],
  },
  inner: {
    width: '100%',
  },
  header: {
    marginBottom: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: Typography.sizes['3xl'],
    fontFamily: Typography.fontFamilyHeading,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
  },
  groupSection: {
    marginBottom: Spacing.xl,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  groupTitle: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamilyBold,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  groupCount: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilySemiBold,
    color: Colors.textMuted,
    backgroundColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {},
});
