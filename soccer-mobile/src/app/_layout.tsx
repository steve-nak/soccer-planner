import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';

function RootLayoutNav() {
  const { isLoading, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)' || segments[0] === 'login';

    if (isAuthenticated && inAuthGroup) {
      // Redirect to home if authenticated and trying to access auth screens
      router.replace('/');
    } else if (!isAuthenticated && !inAuthGroup && segments[0] !== undefined) {
      // Redirect to login if not authenticated and trying to access protected screens
      const publicScreens = ['index']; // Home screen
      if (!publicScreens.includes(segments[0])) {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, segments, isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerTitleAlign: 'center' }}>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="matches" options={{ title: 'Matches' }} />
        <Stack.Screen name="matches/[id]" options={{ title: 'Match Details' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

