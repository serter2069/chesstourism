import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeContainer } from '../../components/layout';
import { Button } from '../../components/ui';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import api from '../../lib/api';

const TOTAL_STEPS = 3;

// Step 1: Skill level
const SKILL_OPTIONS = [
  { value: 'U1000', label: 'Under 1000' },
  { value: 'U1400', label: 'Under 1400' },
  { value: 'U1800', label: 'Under 1800' },
  { value: '2000+', label: '2000+' },
  { value: 'SPECTATOR', label: 'Just watching' },
];

// Step 2: Countries (multiselect)
const COUNTRY_OPTIONS = [
  { value: 'Russia', label: 'Russia' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Spain', label: 'Spain' },
  { value: 'France', label: 'France' },
  { value: 'Netherlands', label: 'Netherlands' },
  { value: 'Other', label: 'Other' },
];

// Step 3: Experience
const EXPERIENCE_OPTIONS = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'SOME', label: 'Been 1-2 times' },
  { value: 'EXPERIENCED', label: 'Experienced participant' },
];

const STEP_TITLES = [
  'Your playing level?',
  'Countries of interest?',
  'Travel tournament experience?',
];

export default function OnboardingQuizScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [skillLevel, setSkillLevel] = useState<string | null>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [experience, setExperience] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function toggleCountry(value: string) {
    setCountries((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value],
    );
  }

  async function savePreferences() {
    setSaving(true);
    try {
      await api.post('/profile/preferences', {
        skillLevel,
        countries,
        experience,
      });
    } catch {
      // Non-blocking — preferences are optional, onboarding still completes
    } finally {
      setSaving(false);
      router.replace('/');
    }
  }

  async function handleSkip() {
    // Skip = still mark onboardingCompleted on server
    setSaving(true);
    try {
      await api.post('/profile/preferences', {
        skillLevel: null,
        countries: [],
        experience: null,
      });
    } catch {
      // Non-blocking
    } finally {
      setSaving(false);
      router.replace('/');
    }
  }

  function handleNext() {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      savePreferences();
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep(step - 1);
    }
  }

  function renderOption(
    value: string,
    label: string,
    selected: boolean,
    onPress: () => void,
  ) {
    return (
      <TouchableOpacity
        key={value}
        onPress={onPress}
        activeOpacity={0.7}
        style={[styles.option, selected && styles.optionSelected]}
      >
        <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
          {label}
        </Text>
        {selected && <Text style={styles.checkmark}>{'✓'}</Text>}
      </TouchableOpacity>
    );
  }

  function renderStepContent() {
    switch (step) {
      case 1:
        return SKILL_OPTIONS.map((opt) =>
          renderOption(opt.value, opt.label, skillLevel === opt.value, () =>
            setSkillLevel(opt.value),
          ),
        );
      case 2:
        return COUNTRY_OPTIONS.map((opt) =>
          renderOption(opt.value, opt.label, countries.includes(opt.value), () =>
            toggleCountry(opt.value),
          ),
        );
      case 3:
        return EXPERIENCE_OPTIONS.map((opt) =>
          renderOption(opt.value, opt.label, experience === opt.value, () =>
            setExperience(opt.value),
          ),
        );
      default:
        return null;
    }
  }

  return (
    <SafeContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* Progress bar */}
            <View style={styles.progressRow}>
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <View
                  key={i}
                  style={[
                    styles.progressSegment,
                    i < step && styles.progressSegmentActive,
                  ]}
                />
              ))}
            </View>

            <Text style={styles.stepLabel}>
              Step {step} of {TOTAL_STEPS}
            </Text>

            <Text style={styles.logo}>{'♔'}</Text>
            <Text style={styles.title}>{STEP_TITLES[step - 1]}</Text>

            <View style={styles.optionsContainer}>{renderStepContent()}</View>

            <View style={styles.actions}>
              <Button
                title={step === TOTAL_STEPS ? 'Finish' : 'Next'}
                onPress={handleNext}
                loading={saving}
                style={styles.nextBtn}
              />

              <View style={styles.secondaryRow}>
                {step > 1 && (
                  <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                    <Text style={styles.backText}>Back</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
                  <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing['3xl'],
  },
  progressRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  progressSegmentActive: {
    backgroundColor: Colors.gold,
  },
  stepLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: Typography.weights.semibold,
  },
  logo: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontFamily: Typography.fontFamilyHeading,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
  },
  optionsContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing['2xl'],
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  optionSelected: {
    borderColor: Colors.gold,
    backgroundColor: Colors.backgroundAlt,
  },
  optionText: {
    fontSize: Typography.sizes.base,
    color: Colors.text,
    fontWeight: Typography.weights.medium,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: Typography.weights.semibold,
  },
  checkmark: {
    fontSize: Typography.sizes.lg,
    color: Colors.gold,
    fontWeight: Typography.weights.bold,
  },
  actions: {
    gap: Spacing.md,
  },
  nextBtn: {
    width: '100%',
  },
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  backBtn: {
    paddingVertical: Spacing.sm,
  },
  backText: {
    color: Colors.textMuted,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  skipBtn: {
    paddingVertical: Spacing.sm,
  },
  skipText: {
    color: Colors.textMuted,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
});
