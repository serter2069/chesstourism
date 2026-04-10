import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { pages } from '../../../constants/pageRegistry';
import ProtoLayout from '../../../components/proto/ProtoLayout';
import LandingStates from '../../../components/proto/states/LandingStates';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

const STATE_COMPONENTS: Record<string, React.ComponentType> = {
  landing: LandingStates,
};

export default function ProtoStatePage() {
  const { page } = useLocalSearchParams<{ page: string }>();
  const pageDef = pages.find((p) => p.id === page);

  if (!pageDef) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Page "{page}" not found in page registry.</Text>
      </View>
    );
  }

  const StatesComponent = STATE_COMPONENTS[pageDef.id];

  if (!StatesComponent) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>No states component for "{pageDef.id}" yet.</Text>
        <Text style={styles.notFoundSub}>Create components/proto/states/{pageDef.id}States.tsx</Text>
      </View>
    );
  }

  return (
    <ProtoLayout title={pageDef.title} route={pageDef.route}>
      <StatesComponent />
    </ProtoLayout>
  );
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundAlt,
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
  notFoundText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  notFoundSub: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
    textAlign: 'center',
    opacity: 0.6,
  },
});
