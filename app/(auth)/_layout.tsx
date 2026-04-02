import { Stack, Redirect } from 'expo-router';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../store/auth';
import { LoadingSpinner } from '../../components/ui';

export default function AuthLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Already logged in — redirect to onboarding or home
  if (user) {
    if (!user.onboardingCompleted) {
      return <Redirect href="/(onboarding)/quiz" />;
    }
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.bgPrimary },
      }}
    />
  );
}
