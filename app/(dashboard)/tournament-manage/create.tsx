import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeContainer, Header } from '../../../components/layout';
import { Button, Input } from '../../../components/ui';
import { Colors } from '../../../constants/colors';
import { Spacing } from '../../../constants/spacing';
import { Typography } from '../../../constants/typography';
import api from '../../../lib/api';

const FORMAT_OPTIONS = ['CLASSICAL', 'RAPID', 'BLITZ'] as const;

export default function CreateTournamentScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [format, setFormat] = useState<string>('CLASSICAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [ratingLimit, setRatingLimit] = useState('');
  const [timeControl, setTimeControl] = useState('');
  const [rules, setRules] = useState('');
  const [schedule, setSchedule] = useState('');

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!startDate.trim()) errs.startDate = 'Start date is required';
    if (!endDate.trim()) errs.endDate = 'End date is required';
    if (startDate && endDate && startDate >= endDate) {
      errs.endDate = 'End date must be after start date';
    }
    const maxP = parseInt(maxParticipants, 10);
    if (maxParticipants && (isNaN(maxP) || maxP <= 0)) {
      errs.maxParticipants = 'Must be a positive number';
    }
    const fee = parseFloat(entryFee);
    if (entryFee && (isNaN(fee) || fee < 0)) {
      errs.entryFee = 'Must be a non-negative number';
    }
    const rl = parseInt(ratingLimit, 10);
    if (ratingLimit && (isNaN(rl) || rl <= 0)) {
      errs.ratingLimit = 'Must be a positive number';
    }
    // Validate date format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (startDate && !dateRegex.test(startDate)) {
      errs.startDate = 'Use YYYY-MM-DD format';
    }
    if (endDate && !dateRegex.test(endDate)) {
      errs.endDate = 'Use YYYY-MM-DD format';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await api.post('/tournaments', {
        title: title.trim(),
        description: description.trim() || undefined,
        timeControl: timeControl.trim() || format.toLowerCase(),
        startDate,
        endDate,
        city: city.trim() || undefined,
        country: country.trim() || undefined,
        maxParticipants: maxParticipants ? parseInt(maxParticipants, 10) : undefined,
        fee: entryFee ? parseFloat(entryFee) : undefined,
        currency: currency.trim() || 'USD',
        ratingLimit: ratingLimit ? parseInt(ratingLimit, 10) : undefined,
      });

      Alert.alert('Success', 'Tournament created successfully');
      const newId = res.data?.id;
      if (newId) {
        router.replace(`/tournaments/${newId}` as never);
      } else {
        router.back();
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.error ||
        (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.message ||
        'Failed to create tournament';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeContainer>
      <Header title="Create Tournament" showBack />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Input
            label="Title *"
            placeholder="Tournament name"
            value={title}
            onChangeText={setTitle}
            error={errors.title}
          />

          <Input
            label="Description"
            placeholder="Tournament description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={styles.multiline}
          />

          {/* Format picker as chip buttons */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Format *</Text>
            <View style={styles.chipRow}>
              {FORMAT_OPTIONS.map((f) => (
                <Button
                  key={f}
                  title={f}
                  variant={format === f ? 'primary' : 'secondary'}
                  onPress={() => setFormat(f)}
                  style={styles.chip}
                />
              ))}
            </View>
          </View>

          <Input
            label="Start Date * (YYYY-MM-DD)"
            placeholder="2026-06-01"
            value={startDate}
            onChangeText={setStartDate}
            error={errors.startDate}
          />

          <Input
            label="End Date * (YYYY-MM-DD)"
            placeholder="2026-06-05"
            value={endDate}
            onChangeText={setEndDate}
            error={errors.endDate}
          />

          <Input
            label="City"
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />

          <Input
            label="Country"
            placeholder="Country"
            value={country}
            onChangeText={setCountry}
          />

          <Input
            label="Venue Address"
            placeholder="Full venue address"
            value={venueAddress}
            onChangeText={setVenueAddress}
          />

          <Input
            label="Max Participants"
            placeholder="e.g. 64"
            value={maxParticipants}
            onChangeText={setMaxParticipants}
            keyboardType="numeric"
            error={errors.maxParticipants}
          />

          <Input
            label="Entry Fee"
            placeholder="0"
            value={entryFee}
            onChangeText={setEntryFee}
            keyboardType="numeric"
            error={errors.entryFee}
          />

          <Input
            label="Currency"
            placeholder="USD"
            value={currency}
            onChangeText={setCurrency}
          />

          <Input
            label="Rating Limit"
            placeholder="e.g. 2200 (leave empty for open)"
            value={ratingLimit}
            onChangeText={setRatingLimit}
            keyboardType="numeric"
            error={errors.ratingLimit}
          />

          <Input
            label="Time Control"
            placeholder="e.g. 90+30, 15+10"
            value={timeControl}
            onChangeText={setTimeControl}
          />

          <Button
            title="Create Tournament"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submitBtn}
          />
        </View>
      </ScrollView>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing['4xl'],
    maxWidth: 430,
    alignSelf: 'center' as const,
    width: '100%',
  },
  form: {
    padding: Spacing.lg,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  fieldGroup: {
    marginBottom: Spacing.lg,
  },
  fieldLabel: {
    color: Colors.textMuted,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    marginBottom: Spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    minHeight: 40,
  },
  submitBtn: {
    marginTop: Spacing.lg,
  },
});
