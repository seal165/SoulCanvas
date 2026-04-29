import { Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors.surface,
        },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="compose" />
      <Stack.Screen name="gallery" />
      <Stack.Screen name="capsule" />
    </Stack>
  );
}