import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing, typography } from './constants/theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ChesTourism</Text>
      <Text style={styles.subtitle}>International Chess Tourism Association</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
