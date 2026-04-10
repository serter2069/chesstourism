import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';

interface StateSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function StateSection({ title, description, children }: StateSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (Platform.OS !== 'web') return;
    const url = window.location.href;
    const pageSlug = url.split('/proto/states/')[1]?.split('?')[0] ?? url;
    const text = `Page: ${pageSlug}\nState: ${title}\nURL: ${url}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {
      try {
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch {}
    });
  }, [title]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <View style={styles.accent} />
        <View style={styles.labelRow}>
          <Text style={styles.label}>STATE: {title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>
        {Platform.OS === 'web' && (
          <Pressable onPress={handleCopy} style={[styles.copyChip, copied && styles.copyChipDone]}>
            <Text style={[styles.copyChipText, copied && styles.copyChipTextDone]}>
              {copied ? 'Copied!' : 'Copy'}
            </Text>
          </Pressable>
        )}
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing['2xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 4,
    overflow: 'hidden',
  },
  accent: {
    width: 4,
    alignSelf: 'stretch',
    backgroundColor: Colors.primary,
  },
  labelRow: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  label: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamilyBold,
    fontWeight: Typography.weights.bold,
    color: Colors.gold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: Typography.sizes.xs,
    fontFamily: Typography.fontFamily,
    color: Colors.textMuted,
    marginTop: 2,
  },
  copyChip: {
    backgroundColor: '#CBD5E1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  copyChipDone: {
    backgroundColor: '#D1FAE5',
  },
  copyChipText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '500',
  },
  copyChipTextDone: {
    color: '#065F46',
  },
  content: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
