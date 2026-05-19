import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SlotsEditorProps {
  currentSlots: number;
  onUpdate: (slots: number) => void;
  isLoading?: boolean;
}

export default function SlotsEditor({ currentSlots, onUpdate, isLoading = false }: SlotsEditorProps) {
  const [slots, setSlots] = useState(currentSlots.toString());

  const handleDecrement = () => {
    const newValue = Math.max(0, parseInt(slots) - 1);
    setSlots(newValue.toString());
  };

  const handleIncrement = () => {
    const newValue = parseInt(slots) + 1;
    setSlots(newValue.toString());
  };

  const handleSave = () => {
    const numSlots = parseInt(slots) || 0;
    if (numSlots !== currentSlots) {
      onUpdate(numSlots);
    }
  };

  const hasChanged = slots !== currentSlots.toString();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Extra Slots (Friends)</Text>
      <Text style={styles.description}>
        Reserve additional spots for your friends joining with you
      </Text>

      <View style={styles.editor}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleDecrement}
          disabled={isLoading || parseInt(slots) === 0}
        >
          <MaterialCommunityIcons name="minus" size={20} color="#fff" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={slots}
          onChangeText={(text) => setSlots(text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
          editable={!isLoading}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleIncrement}
          disabled={isLoading}
        >
          <MaterialCommunityIcons name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {hasChanged && (
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <MaterialCommunityIcons name="loading" size={16} color="#fff" />
          ) : (
            <MaterialCommunityIcons name="check" size={16} color="#fff" />
          )}
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.note}>
        <MaterialCommunityIcons name="information" size={14} color="#0043ce" />
        <Text style={styles.noteText}>
          {slots === '0'
            ? "You're joining alone"
            : `You're bringing ${slots} additional friend${parseInt(slots) !== 1 ? 's' : ''}`}
        </Text>
      </View>
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
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10233d',
  },
  description: {
    fontSize: 13,
    color: '#41546f',
    lineHeight: 18,
  },
  editor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: '#0f62fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#e8eef2',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#10233d',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#24a148',
    paddingVertical: 10,
    borderRadius: 6,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#d0e2ff',
    borderRadius: 6,
  },
  noteText: {
    fontSize: 12,
    color: '#0043ce',
    flex: 1,
  },
});
