import React, { useState, useEffect } from 'react';
import { useRouter, Stack } from 'expo-router';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import MatchCard from '../../components/ui/MatchCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { MatchService } from '../../services/matchService';
import { Match } from '../../types/match';

const PAGE_SIZE = 10;

export default function MatchesScreen() {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch matches
  const fetchMatches = async (pageNum: number = 1, isRefresh = false) => {
    try {
      setError(null);
      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const response = await MatchService.getMatches(pageNum, PAGE_SIZE, token || undefined);
      console.log('Fetched matches:', response);
      
      if (pageNum === 1) {
        setMatches(response.items || []);
      } else {
        setMatches((prevMatches) => [...prevMatches, ...(response.items || [])]);
      }

      setTotalPages(Math.ceil(response.total / PAGE_SIZE));
      setPage(pageNum);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load matches';
      setError(errorMessage);
      console.error('Error fetching matches:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setRefreshing(false);
    }
  };

  // Load matches on mount and when token changes
  useEffect(() => {
    if (!authLoading && token) {
      fetchMatches(1);
    }
  }, [token, authLoading]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMatches(1, true);
  };

  const handleLoadMore = () => {
    if (page < totalPages && !isLoadingMore && !isLoading) {
      fetchMatches(page + 1);
    }
  };

  const handleMatchPress = (matchId: number) => {
    router.push(`/matches/${matchId}`);
  };

  const handleRetry = () => {
    fetchMatches(1);
  };

  if (authLoading) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading matches..." />;
  }

  if (error && matches.length === 0) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Active Matches',
          headerRight: () => (
            <TouchableOpacity onPress={handleRefresh} style={{ marginRight: 16 }}>
              <MaterialCommunityIcons name="refresh" size={24} color="#0f62fe" />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView style={styles.container}>
        {matches.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="soccer" size={64} color="#c8cacc" />
            <Text style={styles.emptyTitle}>No Active Matches</Text>
            <Text style={styles.emptyText}>
              Check back soon! New matches will be available soon.
            </Text>
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
              <MaterialCommunityIcons name="refresh" size={18} color="#fff" />
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={matches}
            keyExtractor={(item) => `${item.id}`}
            renderItem={({ item }) => (
              <MatchCard match={item} onPress={() => handleMatchPress(item.id)} />
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isLoadingMore ? (
                <View style={styles.loadingMore}>
                  <ActivityIndicator size="small" color="#0f62fe" />
                </View>
              ) : null
            }
          />
        )}

        {/* Pagination Info */}
        {!error && matches.length > 0 && (
          <View style={styles.paginationInfo}>
            <Text style={styles.paginationText}>
              Page {page} of {totalPages} • {matches.length} matches shown
            </Text>
          </View>
        )}

        {/* Error message when loading more fails */}
        {error && matches.length > 0 && (
          <View style={styles.errorBar}>
            <Text style={styles.errorBarText}>{error}</Text>
            <TouchableOpacity onPress={handleRetry}>
              <MaterialCommunityIcons name="refresh" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fbff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10233d',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#41546f',
    textAlign: 'center',
  },
  refreshButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0f62fe',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  loadingMore: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  paginationInfo: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e8eef2',
    backgroundColor: '#fff',
  },
  paginationText: {
    fontSize: 12,
    color: '#41546f',
    textAlign: 'center',
  },
  errorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#da1e28',
  },
  errorBarText: {
    fontSize: 12,
    color: '#fff',
    flex: 1,
    marginRight: 8,
  },
});