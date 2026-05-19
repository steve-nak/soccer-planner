import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function MatchesScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Matches' }} />
      <Text style={styles.title}>Matches</Text>
      <Text style={styles.body}>This is the matches list screen.</Text>
      <Link href="/matches/1" style={styles.link}>
        Open Match Details
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
    backgroundColor: '#f8fbff',
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