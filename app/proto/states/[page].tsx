import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { pages } from '../../../constants/pageRegistry';
import ProtoLayout from '../../../components/proto/ProtoLayout';
import LandingStates from '../../../components/proto/states/LandingStates';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';

const STATE_COMPONENTS: Record<string, React.ComponentType> = {
  landing: LandingStates,
};

function WorkInProgress({ id, title, route, stateCount, nav }: {
  id: string; title: string; route: string; stateCount: number; nav: string;
}) {
  const router = useRouter();
  return (
    <View style={wip.root}>
      <View style={wip.iconWrap}>
        <Feather name="layers" size={32} color={Colors.primary} />
      </View>
      <Text style={wip.heading}>Not prototyped yet</Text>
      <Text style={wip.sub}>
        Create{' '}
        <Text style={wip.code}>components/proto/states/{id}States.tsx</Text>
        {' '}and register it in{' '}
        <Text style={wip.code}>[page].tsx</Text>
      </Text>

      <View style={wip.metaBlock}>
        <Row label="Route" value={route} />
        <Row label="Nav" value={nav} />
        <Row label="States" value={String(stateCount)} />
      </View>

      <TouchableOpacity style={wip.backBtn} onPress={() => router.push('/proto' as any)} activeOpacity={0.8}>
        <Feather name="arrow-left" size={14} color={Colors.gold} />
        <Text style={wip.backText}>Back to dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={wip.row}>
      <Text style={wip.label}>{label}</Text>
      <Text style={wip.value}>{value}</Text>
    </View>
  );
}

const wip = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
    backgroundColor: Colors.backgroundAlt,
    minHeight: 400,
  },
  iconWrap: {
    width: 64, height: 64,
    borderRadius: 16,
    backgroundColor: Colors.background,
    borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  heading: {
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.fontFamilyHeading,
    color: Colors.text,
  },
  sub: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 420,
  },
  code: {
    fontFamily: 'monospace',
    backgroundColor: Colors.border,
    color: Colors.gold,
  },
  metaBlock: {
    marginTop: Spacing.md,
    backgroundColor: Colors.background,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 8,
    padding: Spacing.lg,
    gap: Spacing.sm,
    minWidth: 280,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.xl },
  label: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: Colors.textMuted,
  },
  value: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilySemiBold,
    color: Colors.text,
  },
  backBtn: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 6,
    borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  backText: {
    fontSize: Typography.sizes.sm,
    fontFamily: Typography.fontFamilyMedium,
    color: Colors.gold,
  },
});

export default function ProtoStatePage() {
  const { page } = useLocalSearchParams<{ page: string }>();
  const pageDef = pages.find((p) => p.id === page);

  if (!pageDef) {
    return (
      <View style={[wip.root, { gap: Spacing.sm }]}>
        <Feather name="alert-circle" size={32} color={Colors.error} />
        <Text style={[wip.heading, { color: Colors.error }]}>Page not found</Text>
        <Text style={wip.sub}>"{page}" is not registered in pageRegistry.ts</Text>
      </View>
    );
  }

  const StatesComponent = STATE_COMPONENTS[pageDef.id];

  if (!StatesComponent) {
    return (
      <ProtoLayout title={pageDef.title} route={pageDef.route}>
        <WorkInProgress
          id={pageDef.id}
          title={pageDef.title}
          route={pageDef.route}
          stateCount={pageDef.stateCount}
          nav={pageDef.nav}
        />
      </ProtoLayout>
    );
  }

  return (
    <ProtoLayout title={pageDef.title} route={pageDef.route}>
      <StatesComponent />
    </ProtoLayout>
  );
}
