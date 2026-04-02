import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { usePlatform } from '../../hooks/usePlatform';

interface SafeContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function SafeContainer({ children, style }: SafeContainerProps) {
  const { contentMaxWidth } = usePlatform();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.inner, { maxWidth: contentMaxWidth }, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    width: '100%',
  },
});
