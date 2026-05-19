import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function MatchDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const matchId = Array.isArray(id) ? id[0] : id ?? 'unknown';

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Match Details' }} />
      <Text style={styles.title}>Match Details</Text>
      <Text style={styles.body}>Showing details for match {matchId}.</Text>
      <Link href="/matches" style={styles.link}>
        Back to Matches
      </Link>
      <Link href="/" style={styles.linkSecondary}>
        Back to Home
      </Link>
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
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#10233d',
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    color: '#41546f',
    textAlign: 'center',
  },
  link: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#0f62fe',
  },
  linkSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0b7a75',
  },
});