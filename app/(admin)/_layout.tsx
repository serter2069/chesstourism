import { Stack, Redirect } from 'expo-router';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../store/auth';
import { LoadingSpinner } from '../../components/ui';

export default function AdminLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Role check: admin only (handle both 'ADMIN' and 'admin' from API)
  if (user.role.toUpperCase() !== 'ADMIN') {
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
