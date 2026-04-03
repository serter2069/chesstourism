import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../store/auth';
import { useWatchlist } from '../../store/watchlist';
import { Colors } from '../../constants/colors';

interface WatchlistButtonProps {
  tournamentId: string;
  size?: number;
}

export function WatchlistButton({ tournamentId, size = 24 }: WatchlistButtonProps) {
  const { user } = useAuth();
  const { isWatchlisted, toggle } = useWatchlist();
  const router = useRouter();

  const active = isWatchlisted(tournamentId);

  const handlePress = () => {
    if (!user) {
      router.push('/(auth)/login');
      return;
    }
    toggle(tournamentId);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={styles.button}
      accessibilityLabel={active ? 'Remove from watchlist' : 'Add to watchlist'}
      accessibilityRole="button"
    >
      <Text style={[styles.icon, { fontSize: size }, active && styles.iconActive]}>
        {active ? '\u2665' : '\u2661'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
  icon: {
    color: '#999',
    lineHeight: 28,
  },
  iconActive: {
    color: Colors.gold,
  },
});
