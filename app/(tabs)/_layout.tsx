import { Stack } from 'expo-router';

export default function TabsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="compose" />
      <Stack.Screen name="gallery" />
      <Stack.Screen name="capsule" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="account-settings" />
      <Stack.Screen name="notification-preferences" />
      <Stack.Screen name="privacy" />
    </Stack>
  );
}