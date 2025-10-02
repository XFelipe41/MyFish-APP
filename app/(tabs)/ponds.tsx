import React, { useCallback, useState } from 'react';
import { StyleSheet, View, FlatList, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getPonds } from '@/utils/storage';
import type { Pond } from '@/utils/types';
import { Colors } from '@/constants/theme';

export default function PondsScreen() {
  const [ponds, setPonds] = useState<Pond[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to load ponds from storage
  const loadPonds = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedPonds = await getPonds();
      setPonds(fetchedPonds);
    } catch (error) {
      console.error("Error loading ponds", error);
      Alert.alert("Error", "Failed to load ponds from storage.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // useFocusEffect runs every time the screen comes into focus
  useFocusEffect(loadPonds);

  if (isLoading) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <ThemedText>Cargando estanques...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Link href="/add-pond" asChild>
        <Pressable style={styles.addButton}>
          <ThemedText style={styles.addButtonText}>+ Añadir Nuevo Estanque</ThemedText>
        </Pressable>
      </Link>

      <FlatList
        data={ponds}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.pondItem}>
            <Text style={styles.pondName}>{item.name}</Text>
            <Text style={styles.pondDetail}>Dimensiones: {item.dimensions}</Text>
            <Text style={styles.pondDetail}>Capacidad: {item.capacity} m³</Text>
            <Text style={styles.pondDetail}>Estado: {item.status}</Text>
          </View>
        )}
        ListEmptyComponent={
          <ThemedView style={styles.centeredContainer}>
            <ThemedText style={styles.emptyText}>No hay estanques registrados.</ThemedText>
            <ThemedText style={styles.emptyText}>¡Añade uno para empezar!</ThemedText>
          </ThemedView>
        }
        contentContainerStyle={ponds.length === 0 ? styles.listContainer : {}}
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
  listContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: Colors.light.tint,
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
  pondItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pondName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  pondDetail: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
});