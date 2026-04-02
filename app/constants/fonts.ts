/**
 * Font loader for Clay brand system.
 * Uses expo-google-fonts for Nunito (all text per brand.html).
 */
import {
  useFonts as useNunito,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';

export function useBrandFonts(): [boolean, Error | null] {
  const [nunitoLoaded, nunitoError] = useNunito({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  return [nunitoLoaded, nunitoError];
}
