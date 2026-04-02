/**
 * Font loader for FIDE Navy Gold brand system.
 * Uses expo-google-fonts for Playfair Display (headings) and Inter (body).
 */
import {
  useFonts as usePlayfairDisplay,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';

import {
  useFonts as useInter,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

export function useBrandFonts(): [boolean, Error | null] {
  const [playfairLoaded, playfairError] = usePlayfairDisplay({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
  });

  const [interLoaded, interError] = useInter({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const loaded = playfairLoaded && interLoaded;
  const error = playfairError || interError;

  return [loaded, error];
}
