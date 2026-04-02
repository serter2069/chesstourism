import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeContainer, Header } from '../../../components/layout';
import { Card, Badge, Button } from '../../../components/ui';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import { useAuth } from '../../../store/auth';

export default function CertificateScreen() {
  const { user } = useAuth();

  // Check if user is verified (has email = we consider verified for now)
  const isVerified = !!user?.email;

  const handleDownload = () => {
    Alert.alert('Coming Soon', 'Certificate PDF download will be available soon.');
  };

  return (
    <SafeContainer>
      <Header title="Certificate" showBack />
      <View style={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.cardLabel}>Member Certificate</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>
              {user?.name} {user?.surname}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={[styles.infoValue, { textTransform: 'capitalize' }]}>{user?.role}</Text>
          </View>

          {user?.country && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Country</Text>
              <Text style={styles.infoValue}>{user.country}</Text>
            </View>
          )}

          <View style={styles.statusRow}>
            <Badge
              label={isVerified ? 'Verified Member' : 'Not Verified'}
              status={isVerified ? 'success' : 'warning'}
            />
          </View>
        </Card>

        {isVerified ? (
          <Button
            title="Download Certificate PDF"
            onPress={handleDownload}
            style={styles.downloadBtn}
          />
        ) : (
          <Card style={styles.warningCard}>
            <Text style={styles.warningText}>
              Verify your email first to download your membership certificate.
            </Text>
          </Card>
        )}
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  card: {
    marginBottom: Spacing.xl,
  },
  cardLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  infoLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
  },
  infoValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textPrimary,
  },
  statusRow: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  downloadBtn: {
    marginBottom: Spacing.lg,
  },
  warningCard: {
    backgroundColor: Colors.statusWarning + '11',
    borderColor: Colors.statusWarning + '44',
  },
  warningText: {
    fontSize: Typography.sizes.sm,
    color: Colors.statusWarning,
    textAlign: 'center',
  },
});
