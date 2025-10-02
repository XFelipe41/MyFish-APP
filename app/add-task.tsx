import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, Alert, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { saveTask } from '@/utils/storage';
import type { Task } from '@/utils/types';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddTaskModal() {
  const router = useRouter();
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSaveTask = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Por favor, introduce un título para la tarea.');
      return;
    }

    const task: Omit<Task, 'id' | 'completed'> = {
      title,
      description,
      dueDate: dueDate.getTime(),
    };

    try {
      await saveTask(task);
      Alert.alert('Éxito', 'Tarea guardada correctamente.');
      if (router.canGoBack()) {
        router.back();
      }
    } catch (error) {
      console.error('Error saving task', error);
      Alert.alert('Error', 'No se pudo guardar la tarea.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Añadir Tarea</ThemedText>

      <ThemedText style={styles.label}>Título</ThemedText>
      <TextInput
        style={[styles.input, { color: Colors[theme].text, backgroundColor: Colors[theme].background, borderColor: Colors[theme].text }]}
        placeholder="Ej: Alimentar peces del estanque A"
        value={title}
        onChangeText={setTitle}
      />

      <ThemedText style={styles.label}>Descripción</ThemedText>
      <TextInput
        style={[styles.input, styles.multilineInput, { color: Colors[theme].text, backgroundColor: Colors[theme].background, borderColor: Colors[theme].text }]}
        placeholder="Ej: 2kg de alimento especial"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <ThemedText style={styles.label}>Fecha de Vencimiento</ThemedText>
      <Pressable onPress={() => setShowDatePicker(true)}>
        <ThemedText style={styles.dateText}>{dueDate.toLocaleDateString()}</ThemedText>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || dueDate;
            setShowDatePicker(false);
            setDueDate(currentDate);
          }}
        />
      )}

      <Pressable style={[styles.button, { backgroundColor: Colors[theme].tint }]} onPress={handleSaveTask}>
        <ThemedText style={styles.buttonText}>Guardar Tarea</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateText: {
    fontSize: 18,
    paddingVertical: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
