import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { usePlatform } from '../../hooks/usePlatform';

interface ProtoLayoutProps {
  title: string;
  route: string;
  children: React.ReactNode;
}

export default function ProtoLayout({ title, route, children }: ProtoLayoutProps) {
  const router = useRouter();
  const { contentMaxWidth } = usePlatform();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.inner, { maxWidth: contentMaxWidth }]}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.push('/proto' as any)}
            accessibilityRole="button"
            accessibilityLabel="Back to proto dashboard"
          >
            <Feather name="arrow-left" size={16} color={Colors.primary} />
            <Text style={styles.backText}>Proto</Text>
          </TouchableOpacity>

        </View>

        {/* Page header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>{title}</Text>
          <Text style={styles.pageRoute}>{route}</Text>
        </View>

        {/* States */}
        {children}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  backText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: Colors.primary,
  },
  pageHeader: {
    marginBottom: Spacing.xl,
  },
  pageTitle: {
    fontSize: Typography.sizes['3xl'],
    fontFamily: Typography.fontFamilyHeading,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  pageRoute: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
  },
});
