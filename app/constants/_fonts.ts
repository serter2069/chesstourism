/**
 * Font loader for Navy + Gold brand system.
 * Uses expo-google-fonts for Playfair Display (headings) + Inter (body).
 */
import { useFonts } from 'expo-font';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

export function useBrandFonts(): [boolean, Error | null] {
  const [fontsLoaded, fontsError] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  return [fontsLoaded, fontsError];
}
