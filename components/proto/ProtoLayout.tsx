import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

interface ProtoLayoutProps {
  title: string;
  route: string;
  nav?: string;
  children: React.ReactNode;
}

export default function ProtoLayout({ title, route, children }: ProtoLayoutProps) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.inner}>
          {/* States */}
          {children}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundAlt,
  },
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
});
