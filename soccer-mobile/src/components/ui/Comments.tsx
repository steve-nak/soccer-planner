import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Comment } from '../../types/match';

interface CommentsProps {
  comments: Comment[];
}

export default function Comments({ comments }: CommentsProps) {
  if (comments.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Comments</Text>
        <Text style={styles.emptyText}>No comments yet</Text>
      </View>
    );
  }

  const renderComment = ({ item }: { item: Comment }) => {
    const createdDate = new Date(item.createdAt);
    const timeStr = createdDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const dateStr = createdDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return (
      <View style={styles.commentItem}>
        <View style={styles.commentHeader}>
          <Text style={styles.authorName}>{item.userName}</Text>
          <Text style={styles.timestamp}>
            {dateStr} at {timeStr}
          </Text>
        </View>
        <Text style={styles.commentText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments ({comments.length})</Text>
      <FlatList
        data={comments}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderComment}
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
  emptyText: {
    fontSize: 14,
    color: '#41546f',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  commentItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f3f3',
    gap: 6,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10233d',
  },
  timestamp: {
    fontSize: 11,
    color: '#c8cacc',
  },
  commentText: {
    fontSize: 13,
    color: '#41546f',
    lineHeight: 18,
  },
});
