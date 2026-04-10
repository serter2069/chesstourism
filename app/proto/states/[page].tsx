import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { protoPages } from '../../../constants/protoRegistry';
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
  const pageDef = protoPages.find((p) => p.id === page);

  if (!pageDef) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Page "{page}" not found in proto registry.</Text>
      </View>
    );
  }

  const StatesComponent = STATE_COMPONENTS[pageDef.id];

  if (!StatesComponent) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>No states component for "{pageDef.id}".</Text>
      </View>
    );
  }

  return (
    <ProtoLayout pagId={pageDef.pagId} title={pageDef.title} route={pageDef.route}>
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
  },
  notFoundText: {
    fontSize: Typography.sizes.base,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
