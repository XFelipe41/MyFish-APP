import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect, Link } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { getTasks, updateTaskCompletion } from '@/utils/storage';
import type { Task } from '@/utils/types';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function OperationsScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks.sort((a, b) => a.dueDate - b.dueDate));
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las tareas.");
      console.error("Error loading tasks", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(loadTasks);

  const handleToggleCompletion = async (taskId: string, completed: boolean) => {
    try {
      await updateTaskCompletion(taskId, completed);
      setTasks(prevTasks =>
        prevTasks.map(task => (task.id === taskId ? { ...task, completed } : task))
      );
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la tarea.");
      console.error("Error updating task", error);
    }
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <ThemedView style={[styles.taskItem, item.completed && styles.completedTask]}>
      <Pressable onPress={() => handleToggleCompletion(item.id, !item.completed)} style={styles.taskInfo}>
        <ThemedText style={[styles.taskTitle, item.completed && styles.completedText]}>{item.title}</ThemedText>
        <ThemedText style={[styles.taskDescription, item.completed && styles.completedText]}>{item.description}</ThemedText>
        <ThemedText style={[styles.taskDueDate, item.completed && styles.completedText]}>Vence: {new Date(item.dueDate).toLocaleDateString()}</ThemedText>
      </Pressable>
    </ThemedView>
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors[theme].tint} />
        <ThemedText>Cargando Tareas...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Gestión de Operaciones</ThemedText>

      <Link href="/add-task" asChild>
        <Pressable style={[styles.addButton, { backgroundColor: Colors[theme].tint }]}>
          <ThemedText style={styles.addButtonText}>+ Añadir Tarea</ThemedText>
        </Pressable>
      </Link>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTaskItem}
        ListEmptyComponent={<ThemedText style={styles.emptyText}>No hay tareas pendientes.</ThemedText>}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  taskItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 5,
  },
  completedTask: {
    opacity: 0.6,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  taskDueDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});
