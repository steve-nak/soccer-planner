import { Link, Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function HomeScreen() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0f62fe" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Home' }} />
      <Text style={styles.title}>Welcome to Soccer Planner</Text>
      <Text style={styles.body}>Plan matches and keep everything in one place.</Text>

      {isAuthenticated ? (
        <>
          <View style={styles.userInfoContainer}>
            <Text style={styles.userGreeting}>Hello, {user?.name}!</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>

          <Link href="/matches" style={styles.link}>
            View Matches
          </Link>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.logoutButtonText}>Logout</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <Link href="/login" style={styles.link}>
          Login
        </Link>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
    backgroundColor: '#f7fafc',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#10233d',
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    color: '#41546f',
    textAlign: 'center',
  },
  userInfoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#0f62fe',
  },
  userGreeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10233d',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#41546f',
  },
  link: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#0f62fe',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    textAlign: 'center',
    minWidth: '100%',
  },
  logoutButton: {
    marginTop: 16,
    backgroundColor: '#da1e28',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
