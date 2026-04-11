import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StateSection from '../StateSection';

export default function OverviewStates() {
  return (
    <View style={styles.container}>
      <StateSection title="Overview">
        <View style={styles.placeholder}>
          <Text style={styles.text}>ChessTourism — Project Overview</Text>
        </View>
      </StateSection>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 32 },
  placeholder: { padding: 24, alignItems: 'center' },
  text: { fontSize: 16, color: '#666' },
});
