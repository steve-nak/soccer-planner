import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Match } from '../../types/match';

interface MatchCardProps {
  match: Match;
  onPress: () => void;
}

export default function MatchCard({ match, onPress }: MatchCardProps) {
  const matchDate = new Date(match.date);
  const dateStr = matchDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = matchDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getStateColor = (state: string) => {
    switch (state) {
      case 'upcoming':
        return '#0f62fe'; // Blue
      case 'current':
        return '#f1c21b'; // Yellow/Gold
      case 'past':
        return '#8d8d8d'; // Gray
      default:
        return '#0f62fe';
    }
  };

  const getStateLabel = (state: string) => {
    return state.charAt(0).toUpperCase() + state.slice(1);
  };

  const availableSpots = Math.max(0, match.capacity - match.playerCount);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      styles.card,
      pressed && styles.cardPressed
    ]}>
      <View style={styles.cardContent}>
        {/* Header with title and state */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {match.groupTitle}
          </Text>
          <View style={[styles.stateBadge, { backgroundColor: getStateColor(match.state) }]}>
            <Text style={styles.stateText}>{getStateLabel(match.state)}</Text>
          </View>
        </View>

        {/* Date and Time */}
        <View style={styles.row}>
          <MaterialCommunityIcons name="calendar" size={16} color="#41546f" />
          <Text style={styles.text}>{dateStr}</Text>
          <MaterialCommunityIcons name="clock" size={16} color="#41546f" style={{ marginLeft: 12 }} />
          <Text style={styles.text}>{timeStr}</Text>
        </View>

        {/* Location */}
        <View style={styles.row}>
          <MaterialCommunityIcons name="map-marker" size={16} color="#41546f" />
          <Text style={styles.text} numberOfLines={1}>
            {match.location}
          </Text>
        </View>

        {/* Player count and capacity */}
        <View style={styles.row}>
          <MaterialCommunityIcons name="account-multiple" size={16} color="#41546f" />
          <Text style={styles.text}>
            {match.playerCount} / {match.capacity} players
          </Text>
          {availableSpots > 0 && (
            <View style={styles.availableBadge}>
              <Text style={styles.availableText}>{availableSpots} spot{availableSpots !== 1 ? 's' : ''}</Text>
            </View>
          )}
          {availableSpots === 0 && (
            <View style={styles.fullBadge}>
              <Text style={styles.fullText}>Full</Text>
            </View>
          )}
        </View>

        {/* Joined status */}
        {match.joinedByCurrentUser && (
          <View style={styles.joinedIndicator}>
            <MaterialCommunityIcons name="check-circle" size={14} color="#24a148" />
            <Text style={styles.joinedText}>You joined</Text>
          </View>
        )}
      </View>

      {/* Right arrow indicator */}
      <View style={styles.arrow}>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#0f62fe" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eef2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPressed: {
    backgroundColor: '#f1f3f5',
  },
  cardContent: {
    flex: 1,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10233d',
    flex: 1,
  },
  stateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  stateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: 14,
    color: '#41546f',
  },
  availableBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#d0e2ff',
    borderRadius: 4,
  },
  availableText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0043ce',
  },
  fullBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fdd2d0',
    borderRadius: 4,
  },
  fullText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#da1e28',
  },
  joinedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  joinedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#24a148',
  },
  arrow: {
    marginLeft: 12,
  },
});
