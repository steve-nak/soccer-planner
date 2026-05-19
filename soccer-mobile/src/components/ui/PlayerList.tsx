import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Player } from '../../types/match';

interface PlayerListProps {
  players: Player[];
}

export default function PlayerList({ players }: PlayerListProps) {
  const renderPlayer = ({ item, index }: { item: Player; index: number }) => {
    const joinedDate = new Date(item.joinedAt);
    const dateStr = joinedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return (
      <View style={styles.playerItem}>
        <View style={styles.playerInfo}>
          <MaterialCommunityIcons name="account-circle" size={32} color="#0f62fe" />
          <View style={styles.playerDetails}>
            <Text style={styles.playerName}>{item.userName}</Text>
            <Text style={styles.playerDate}>Joined {dateStr}</Text>
            {item.extraSlots > 0 && (
              <Text style={styles.extraSlots}>+{item.extraSlots} extra slot{item.extraSlots !== 1 ? 's' : ''}</Text>
            )}
          </View>
        </View>
        <Text style={styles.playerIndex}>#{index + 1}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Players ({players.length})</Text>
      <FlatList
        data={players}
        keyExtractor={(item, index) => `${item.userId}-${index}`}
        renderItem={renderPlayer}
        scrollEnabled={false}
        nestedScrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#e8eef2',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10233d',
    marginBottom: 12,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10233d',
  },
  playerDate: {
    fontSize: 12,
    color: '#41546f',
    marginTop: 2,
  },
  extraSlots: {
    fontSize: 12,
    color: '#0f62fe',
    fontWeight: '500',
    marginTop: 4,
  },
  playerIndex: {
    fontSize: 13,
    fontWeight: '600',
    color: '#c8cacc',
  },
});
