import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeContainer, Header } from '../../components/layout';
import { Avatar, Badge, Button, Card, LoadingSpinner } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import api from '../../lib/api';

interface CommissarProfile {
  id: string;
  user_id: string;
  experience_years: number;
  specializations: string[];
  rating: number;
  approved: boolean;
  license_number?: string | null;
  user: {
    id: string;
    name: string;
    surname: string;
    country?: string | null;
    city?: string | null;
    avatar_url?: string | null;
    bio?: string | null;
  };
}

export default function CommissarProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [profile, setProfile] = useState<CommissarProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/commissars/${id}`);
        if (!cancelled) {
          setProfile(res.data);
          setError(null);
        }
      } catch {
        if (!cancelled) setError('Failed to load commissar profile');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <SafeContainer>
        <Header title="Commissar" showBack />
        <LoadingSpinner />
      </SafeContainer>
    );
  }

  if (error || !profile) {
    return (
      <SafeContainer>
        <Header title="Commissar" showBack />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{error || 'Profile not found'}</Text>
        </View>
      </SafeContainer>
    );
  }

  const fullName = `${profile.user.name} ${profile.user.surname}`;
  const location = [profile.user.city, profile.user.country].filter(Boolean).join(', ');

  return (
    <SafeContainer>
      <Header title="Commissar" showBack />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Avatar + Name */}
        <View style={styles.avatarSection}>
          <Avatar uri={profile.user.avatar_url} name={fullName} size={80} />
          <Text style={styles.name}>{fullName}</Text>
          {location ? <Text style={styles.location}>{location}</Text> : null}
        </View>

        {/* Stats */}
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profile.experience_years}</Text>
              <Text style={styles.statLabel}>Years exp.</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{profile.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              {profile.approved ? (
                <Badge label="Approved" status="success" />
              ) : (
                <Badge label="Pending" status="warning" />
              )}
            </View>
          </View>
        </Card>

        {/* Specializations */}
        {profile.specializations && profile.specializations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specializations</Text>
            <View style={styles.badges}>
              {profile.specializations.map((s) => (
                <Badge key={s} label={s} status="info" />
              ))}
            </View>
          </View>
        )}

        {/* Bio */}
        {profile.user.bio ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Card>
              <Text style={styles.bioText}>{profile.user.bio}</Text>
            </Card>
          </View>
        ) : null}

        {/* License */}
        {profile.license_number ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>License</Text>
            <Card>
              <Text style={styles.licenseText}>{profile.license_number}</Text>
            </Card>
          </View>
        ) : null}

        {/* Tournaments placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tournaments</Text>
          <Card>
            <Text style={styles.placeholderText}>No tournaments yet</Text>
          </Card>
        </View>

        {/* Contact placeholder */}
        <Button
          title="Contact commissar"
          onPress={() => {}}
          disabled
          style={styles.contactBtn}
        />
      </ScrollView>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing['4xl'],
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  name: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  location: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  statsCard: {
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.brandPrimary,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.borderDefault,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  bioText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.sizes.sm * Typography.lineHeights.normal,
  },
  licenseText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textAccent,
    fontWeight: Typography.weights.medium,
  },
  placeholderText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  contactBtn: {
    marginTop: Spacing.md,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
  },
});
