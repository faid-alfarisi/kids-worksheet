import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTitleStyle: { fontWeight: '800' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#FFFDF7' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Kids Worksheet', headerStyle: { backgroundColor: '#FFFDF7' } }} />
      </Stack>
    </>
  );
}
