import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { SafeContainer, Header } from '../../../components/layout';
import { Card, Badge, Button, LoadingSpinner } from '../../../components/ui';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import { useAuth } from '../../../store/auth';
import api, { getAuthToken } from '../../../lib/api';

interface Membership {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED';
  createdAt: string;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'https://chesstourism.smartlaunchhub.com/api';

export default function CertificateScreen() {
  const { user } = useAuth();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const fetchMembership = useCallback(async () => {
    try {
      const res = await api.get('/membership/my');
      setMembership(res.data.membership);
    } catch {
      // No membership yet — leave as null
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembership();
  }, [fetchMembership]);

  const handleActivate = async () => {
    setActivating(true);
    try {
      const res = await api.post('/membership/activate');
      setMembership(res.data.membership);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.error || 'Failed to activate membership');
    } finally {
      setActivating(false);
    }
  };

  const handleDownloadCertificate = async () => {
    setDownloading(true);
    try {
      const token = await getAuthToken();
      const url = `${API_BASE}/membership/certificate`;

      if (Platform.OS === 'web') {
        // Web: fetch HTML with Authorization header, open as blob URL
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('Certificate not available');
        }
        const html = await res.text();
        const blob = new Blob([html], { type: 'text/html' });
        const objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl, '_blank');
        // Revoke after short delay to avoid memory leak
        setTimeout(() => URL.revokeObjectURL(objectUrl), 15000);
      } else {
        // Native: pass token as query param (short-lived 15m access token)
        const certUrl = token
          ? `${url}?token=${encodeURIComponent(token)}`
          : url;
        await WebBrowser.openBrowserAsync(certUrl);
      }
    } catch {
      Alert.alert('Error', 'Failed to open certificate. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <SafeContainer>
        <Header title="Membership" showBack />
        <LoadingSpinner />
      </SafeContainer>
    );
  }

  const isActive = membership?.status === 'ACTIVE';

  return (
    <SafeContainer>
      <Header title="Membership" showBack />
      <View style={styles.container}>
        {!membership ? (
          // No membership yet — show join CTA
          <>
            <Card style={styles.card}>
              <Text style={styles.cardLabel}>Federation Membership</Text>
              <Text style={styles.bodyText}>
                Join the International Chess Tourism Federation to receive your official membership
                certificate and access exclusive member benefits.
              </Text>
              <View style={styles.benefitRow}>
                <Text style={styles.bullet}>{'\u2654'}</Text>
                <Text style={styles.benefitText}>Official membership certificate (printable)</Text>
              </View>
              <View style={styles.benefitRow}>
                <Text style={styles.bullet}>{'\u2654'}</Text>
                <Text style={styles.benefitText}>1-year membership validity</Text>
              </View>
              <View style={styles.benefitRow}>
                <Text style={styles.bullet}>{'\u2654'}</Text>
                <Text style={styles.benefitText}>Unique member number</Text>
              </View>
            </Card>
            <Button
              title={activating ? 'Activating...' : 'Join the Federation'}
              onPress={handleActivate}
              disabled={activating}
              style={styles.actionBtn}
            />
          </>
        ) : (
          // Has membership — show card + download
          <>
            <Card style={styles.card}>
              <Text style={styles.cardLabel}>Member Certificate</Text>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>
                  {[user?.name, user?.surname].filter(Boolean).join(' ') || user?.email}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Member No.</Text>
                <Text style={[styles.infoValue, styles.memberNumber]}>
                  #{membership.id.slice(-8).toUpperCase()}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Valid From</Text>
                <Text style={styles.infoValue}>{formatDate(membership.startDate)}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Valid Until</Text>
                <Text style={styles.infoValue}>{formatDate(membership.endDate)}</Text>
              </View>

              <View style={styles.statusRow}>
                <Badge
                  label={isActive ? 'Active Member' : 'Expired'}
                  status={isActive ? 'success' : 'warning'}
                />
              </View>
            </Card>

            {isActive ? (
              <Button
                title={downloading ? 'Opening...' : 'Download Certificate'}
                onPress={handleDownloadCertificate}
                disabled={downloading}
                style={styles.actionBtn}
              />
            ) : (
              <>
                <Card style={styles.warningCard}>
                  <Text style={styles.warningText}>
                    Your membership has expired. Renew to get a new certificate.
                  </Text>
                </Card>
                <Button
                  title={activating ? 'Renewing...' : 'Renew Membership'}
                  onPress={handleActivate}
                  disabled={activating}
                  style={styles.actionBtn}
                />
              </>
            )}
          </>
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
  bodyText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  bullet: {
    fontSize: Typography.sizes.base,
    color: Colors.brandAccent,
  },
  benefitText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
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
  memberNumber: {
    fontFamily: 'monospace',
    color: Colors.brandPrimary,
    fontWeight: Typography.weights.bold,
  },
  statusRow: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  actionBtn: {
    marginBottom: Spacing.lg,
  },
  warningCard: {
    backgroundColor: Colors.statusWarning + '11',
    borderColor: Colors.statusWarning + '44',
    marginBottom: Spacing.lg,
  },
  warningText: {
    fontSize: Typography.sizes.sm,
    color: Colors.statusWarning,
    textAlign: 'center',
  },
});
