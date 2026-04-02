import { Stack, Redirect } from 'expo-router';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../store/auth';
import { LoadingSpinner } from '../../components/ui';

export default function DashboardLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Not authenticated — redirect to login
  if (!user) {
    return <Redirect href="/(auth)/login" />;
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
