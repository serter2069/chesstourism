import { Stack } from 'expo-router';

// IMPORTANT: This layout must remain a clean Stack with NO auth guard.
// Proto pages at /proto/states/[page] must be accessible without authentication.
// Do NOT wrap with useAuth() or add Redirect — proto is a design tool, not a real app route.
export default function ProtoLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
