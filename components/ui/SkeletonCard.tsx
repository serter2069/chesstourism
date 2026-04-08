import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

type SkeletonVariant = 'tournament' | 'commissar' | 'ratings-row';

interface SkeletonCardProps {
  variant?: SkeletonVariant;
  count?: number;
}

function SkeletonBlock({ style }: { style?: object }) {
  return <View style={[styles.block, style]} />;
}

function TournamentSkeleton() {
  return (
    <View style={styles.tournamentCard}>
      {/* Header row: title + badge placeholder */}
      <View style={styles.tournamentHeader}>
        <SkeletonBlock style={styles.tournamentTitle} />
        <SkeletonBlock style={styles.tournamentBadge} />
      </View>
      {/* Meta: date + location */}
      <SkeletonBlock style={styles.tournamentMeta1} />
      <SkeletonBlock style={styles.tournamentMeta2} />
      {/* Footer row */}
      <View style={styles.tournamentFooter}>
        <SkeletonBlock style={styles.tournamentFooterItem} />
        <SkeletonBlock style={styles.tournamentFooterItem} />
        <SkeletonBlock style={styles.tournamentFooterItem} />
      </View>
    </View>
  );
}

function CommissarSkeleton() {
  return (
    <View style={styles.commissarCard}>
      {/* Avatar circle */}
      <SkeletonBlock style={styles.commissarAvatar} />
      {/* Text lines */}
      <View style={styles.commissarInfo}>
        <SkeletonBlock style={styles.commissarName} />
        <SkeletonBlock style={styles.commissarLocation} />
        <SkeletonBlock style={styles.commissarMeta} />
      </View>
    </View>
  );
}

function RatingsRowSkeleton() {
  return (
    <View style={styles.ratingsRow}>
      {/* Rank */}
      <SkeletonBlock style={styles.ratingsRank} />
      {/* Name */}
      <SkeletonBlock style={styles.ratingsName} />
      {/* Rating */}
      <SkeletonBlock style={styles.ratingsRating} />
    </View>
  );
}

export default function SkeletonCard({
  variant = 'tournament',
  count = 5,
}: SkeletonCardProps) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => {
      animation.stop();
    };
  }, [opacity]);

  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <Animated.View style={[styles.wrapper, { opacity }]}>
      {items.map((i) => {
        if (variant === 'tournament') return <TournamentSkeleton key={i} />;
        if (variant === 'commissar') return <CommissarSkeleton key={i} />;
        return <RatingsRowSkeleton key={i} />;
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  // Shared base block
  block: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 6,
  },

  // Tournament variant
  tournamentCard: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  tournamentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  tournamentTitle: {
    height: 16,
    flex: 1,
    marginRight: Spacing.sm,
    borderRadius: 4,
  },
  tournamentBadge: {
    height: 16,
    width: 80,
    borderRadius: 10,
  },
  tournamentMeta1: {
    height: 12,
    width: '70%',
    borderRadius: 4,
    marginBottom: 6,
  },
  tournamentMeta2: {
    height: 12,
    width: '50%',
    borderRadius: 4,
    marginBottom: Spacing.md,
  },
  tournamentFooter: {
    flexDirection: 'row',
    gap: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  tournamentFooterItem: {
    height: 28,
    width: 60,
    borderRadius: 4,
  },

  // Commissar variant
  commissarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    height: 82,
  },
  commissarAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flexShrink: 0,
  },
  commissarInfo: {
    flex: 1,
    marginLeft: Spacing.md,
    gap: 8,
  },
  commissarName: {
    height: 14,
    width: '60%',
    borderRadius: 4,
  },
  commissarLocation: {
    height: 11,
    width: '45%',
    borderRadius: 4,
  },
  commissarMeta: {
    height: 11,
    width: '30%',
    borderRadius: 4,
  },

  // Ratings-row variant
  ratingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  ratingsRank: {
    width: 36,
    height: 14,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  ratingsName: {
    flex: 1,
    height: 14,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  ratingsRating: {
    width: 52,
    height: 14,
    borderRadius: 4,
  },
});
