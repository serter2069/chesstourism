import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

type PlaceholderType = 'avatar' | 'photo' | 'document' | 'illustration' | 'banner';

interface ProtoPlaceholderImageProps {
  type: PlaceholderType;
  width?: number | string;
  height?: number | string;
  size?: number;   // shorthand for square avatars
  label?: string;
  borderRadius?: number;
}

const typeConfig: Record<PlaceholderType, { icon: string; label: string; bg: string; fg: string }> = {
  avatar:       { icon: 'user',       label: 'Avatar',       bg: Colors.adminInputBg, fg: Colors.textMuted },
  photo:        { icon: 'image',      label: 'Photo',        bg: Colors.adminInputBg, fg: Colors.textMuted },
  document:     { icon: 'file-text',  label: 'Document',     bg: Colors.adminInputBg, fg: Colors.textMuted },
  illustration: { icon: 'aperture',   label: 'Illustration', bg: Colors.adminInputBg, fg: Colors.textMuted },
  banner:       { icon: 'layout',     label: 'Banner',       bg: Colors.adminCard,    fg: Colors.textMuted },
};

export default function ProtoPlaceholderImage({
  type,
  width,
  height,
  size,
  label,
  borderRadius = 4,
}: ProtoPlaceholderImageProps) {
  const config = typeConfig[type];
  const w = size ?? width ?? '100%';
  const h = size ?? height ?? 120;
  const iconSize = size ? Math.round(Number(size) * 0.35) : 24;

  return (
    <View
      style={[
        styles.container,
        { width: w as any, height: h as any, backgroundColor: config.bg, borderRadius },
      ]}
    >
      <Feather name={config.icon as any} size={iconSize} color={config.fg} />
      <Text style={[styles.label, { color: config.fg }]}>{label ?? config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  label: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamily,
    opacity: 0.7,
  },
});
