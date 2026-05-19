import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import MatchService from '../../services/matchService';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import PlayerList from '../../components/ui/PlayerList';
import Comments from '../../components/ui/Comments';
import SlotsEditor from '../../components/ui/SlotsEditor';
import { MatchDetail } from '../../types/match';

export default function MatchDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const matchId = parseInt(Array.isArray(id) ? id[0] : id ?? '0');
  const { token, isLoading: authLoading } = useAuth();

  console.log('MatchDetailsScreen mounted', { id, matchId, token: !!token });

  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isUpdatingSlots, setIsUpdatingSlots] = useState(false);

  // Fetch match details
  const fetchMatchDetails = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await MatchService.getMatchDetail(matchId, token || undefined);
      setMatch(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load match details';
      setError(errorMessage);
      console.error('Error fetching match details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load match details on mount
  useEffect(() => {
    if (!authLoading && matchId > 0) {
      fetchMatchDetails();
    }
  }, [matchId, token, authLoading]);

  const handleJoin = async () => {
    console.log('handleJoin called', { token: !!token, match: !!match, matchId });
    if (!token || !match) {
      console.log('Early return: token or match missing');
      return;
    }

    try {
      setIsJoining(true);
      setError(null);
      console.log('Calling MatchService.joinMatch');
      await MatchService.joinMatch(matchId, token);
      console.log('Successfully joined match');
      // Refresh match data to get updated state
      await fetchMatchDetails();
      Alert.alert('Success', 'You have joined the match!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join match';
      Alert.alert('Error', errorMessage);
      console.error('Error joining match:', err);
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    console.log('handleLeave called', { token: !!token, match: !!match, matchId });
    if (!token || !match) {
      console.log('Early return: token or match missing');
      return;
    }

    try {
      setIsLeaving(true);
      setError(null);
      console.log('Calling MatchService.leaveMatch');
      await MatchService.leaveMatch(matchId, token);
      console.log('Successfully left match');
      // Refresh match data to get updated state
      await fetchMatchDetails();
      Alert.alert('Success', 'You have left the match');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to leave match';
      console.error('Error in handleLeave:', errorMessage);
      Alert.alert('Error', errorMessage);
      console.error('Error leaving match:', err);
    } finally {
      setIsLeaving(false);
    }
  };

  const handleUpdateSlots = async (slots: number) => {
    if (!token || !match) return;

    try {
      setIsUpdatingSlots(true);
      setError(null);
      await MatchService.updateSlots(matchId, slots, token);
      // Refresh match data to get updated state
      await fetchMatchDetails();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update slots';
      Alert.alert('Error', errorMessage);
      console.error('Error updating slots:', err);
    } finally {
      setIsUpdatingSlots(false);
    }
  };

  const handleRetry = () => {
    fetchMatchDetails();
  };

  if (authLoading || isLoading) {
    return <LoadingSpinner message="Loading match details..." />;
  }

  if (error && !match) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  if (!match) {
    return <ErrorMessage message="Match not found" onRetry={handleRetry} />;
  }

  console.log('Rendering match details:', { 
    matchId: match.id,
    joinedByCurrentUser: match.joinedByCurrentUser,
    isLeaving,
    canceled: match.canceled
  });

  const matchDate = new Date(match.date);
  const dateStr = matchDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = matchDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getStateColor = (state: string) => {
    switch (state) {
      case 'upcoming':
        return '#0f62fe';
      case 'current':
        return '#f1c21b';
      case 'past':
        return '#8d8d8d';
      default:
        return '#0f62fe';
    }
  };

  const availableSpots = Math.max(0, match.capacity - match.playerCount);

  // Find current user's slot info if joined
  let currentUserSlots = 0;
  if (match.joinedByCurrentUser && match.players && match.players.length > 0) {
    // Try to find current user's extraSlots - in a real app, we'd have userId from context
    // For now, use the first player if no exact match (this is a limitation)
    currentUserSlots = match.players[0]?.extraSlots ?? 0;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: match.groupTitle,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#0f62fe" />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Match Header Card */}
          <View style={styles.headerCard}>
            <View style={styles.titleRow}>
              <View style={styles.titleCol}>
                <Text style={styles.groupTitle}>{match.groupTitle}</Text>
                <View
                  style={[styles.stateBadge, { backgroundColor: getStateColor(match.state) }]}
                >
                  <Text style={styles.stateText}>
                    {match.state.charAt(0).toUpperCase() + match.state.slice(1)}
                  </Text>
                </View>
              </View>
              {match.canceled && (
                <View style={styles.canceledBadge}>
                  <Text style={styles.canceledText}>CANCELED</Text>
                </View>
              )}
            </View>

            {/* Date and Time */}
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="calendar" size={18} color="#0f62fe" />
              <View>
                <Text style={styles.infoLabel}>Date & Time</Text>
                <Text style={styles.infoValue}>
                  {dateStr} at {timeStr}
                </Text>
              </View>
            </View>

            {/* Location */}
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="map-marker" size={18} color="#0f62fe" />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{match.location}</Text>
              </View>
            </View>

            {/* Capacity */}
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="account-multiple" size={18} color="#0f62fe" />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Capacity</Text>
                <Text style={styles.infoValue}>
                  {match.playerCount} / {match.capacity} players
                  {availableSpots > 0 && (
                    <Text style={styles.availableText}> ({availableSpots} available)</Text>
                  )}
                  {availableSpots === 0 && <Text style={styles.fullText}> (Full)</Text>}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          {!match.canceled && (
            <View style={styles.actionButtons}>
              {!match.joinedByCurrentUser ? (
                <TouchableOpacity
                  style={[styles.button, styles.joinButton, isJoining && styles.buttonDisabled]}
                  onPress={() => {
                    console.log('Join button pressed');
                    handleJoin();
                  }}
                  disabled={isJoining || availableSpots === 0}
                >
                  {isJoining ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <MaterialCommunityIcons name="plus-circle" size={18} color="#fff" />
                  )}
                  <Text style={styles.buttonText}>
                    {isJoining ? 'Joining...' : 'Join Match'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.button, styles.leaveButton, isLeaving && styles.buttonDisabled]}
                  onPress={() => {
                    console.log('Leave button pressed, isLeaving:', isLeaving);
                    handleLeave();
                  }}
                  disabled={isLeaving}
                >
                  {isLeaving ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <MaterialCommunityIcons name="close" size={18} color="#fff" />
                  )}
                  <Text style={styles.buttonText}>
                    {isLeaving ? 'Leaving...' : 'Leave Match'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Slots Editor - Only show if user joined */}
          {match.joinedByCurrentUser && (
            <SlotsEditor
              currentSlots={currentUserSlots}
              onUpdate={handleUpdateSlots}
              isLoading={isUpdatingSlots}
            />
          )}

          {/* Players List */}
          {match.players && match.players.length > 0 && (
            <PlayerList players={match.players} />
          )}

          {/* Comments */}
          {match.comments && <Comments comments={match.comments} />}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fbff',
  },
  content: {
    flex: 1,
  },
  headerCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8eef2',
    gap: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  titleCol: {
    flex: 1,
    gap: 8,
  },
  groupTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10233d',
  },
  stateBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  stateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  canceledBadge: {
    backgroundColor: '#fdd2d0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  canceledText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#da1e28',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#8d8d8d',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10233d',
  },
  availableText: {
    color: '#24a148',
    fontWeight: '600',
  },
  fullText: {
    color: '#da1e28',
    fontWeight: '600',
  },
  actionButtons: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  joinButton: {
    backgroundColor: '#24a148',
  },
  leaveButton: {
    backgroundColor: '#da1e28',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
