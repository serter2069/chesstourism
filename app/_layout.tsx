import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { useBrandFonts } from './constants/fonts';
import { Colors } from '../constants/colors';
import { AuthProvider } from '../store/auth';
import { WatchlistProvider } from '../store/watchlist';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useBrandFonts();

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bgPrimary, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Colors.brandAccent} />
      </View>
    );
  }

  return (
    <AuthProvider>
      <WatchlistProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.bgPrimary },
          }}
        />
      </WatchlistProvider>
    </AuthProvider>
  );
}
