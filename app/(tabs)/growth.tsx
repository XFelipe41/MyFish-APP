import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useFocusEffect, Link } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { getPonds, getGrowthReadings } from '@/utils/storage';
import type { Pond, GrowthReading } from '@/utils/types';
import { Colors } from '@/constants/theme';

export default function GrowthScreen() {
  const [ponds, setPonds] = useState<Pond[]>([]);
  const [selectedPond, setSelectedPond] = useState<Pond | null>(null);
  const [readings, setReadings] = useState<GrowthReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReadings, setIsLoadingReadings] = useState(false);

  const handleSelectPond = async (pond: Pond) => {
    setSelectedPond(pond);
    setIsLoadingReadings(true);
    try {
      const allReadings = await getGrowthReadings();
      const pondReadings = allReadings.filter(r => r.pond_id === pond.id);
      setReadings(pondReadings);
    } catch (error) {
      console.error(`Error loading growth readings for pond ${pond.id}`, error);
      Alert.alert("Error", `Failed to load readings for ${pond.name}.`);
    } finally {
      setIsLoadingReadings(false);
    }
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedPonds = await getPonds();
      setPonds(fetchedPonds);
      if (fetchedPonds.length > 0) {
        if (!selectedPond || !fetchedPonds.some(p => p.id === selectedPond.id)) {
          await handleSelectPond(fetchedPonds[0]);
        }
      }
    } catch (error) {
      console.error("Error loading ponds", error);
      Alert.alert("Error", "Failed to load ponds.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedPond]);

  useFocusEffect(loadData);

  const renderReadingItem = ({ item }: { item: GrowthReading }) => (
    <View style={styles.readingItem}>
      <Text style={styles.readingTimestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
      <View style={styles.readingGrid}>
        <Text style={styles.readingValue}>Peso Promedio: {item.average_weight} g</Text>
        <Text style={styles.readingValue}>Longitud Promedio: {item.average_length} cm</Text>
        <Text style={styles.readingValue}>Biomasa Total: {item.total_biomass} kg</Text>
      </View>
    </View>
  );

  if (isLoading && ponds.length === 0) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <ThemedText>Cargando Estanques...</ThemedText>
      </ThemedView>
    );
  }

  if (ponds.length === 0) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText>No se encontraron estanques.</ThemedText>
        <Link href="/(tabs)/ponds">
          <Text style={styles.linkText}>Añade un estanque para empezar.</Text>
        </Link>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Seleccionar Estanque:</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pondSelector}>
        {ponds.map(pond => (
          <Pressable
            key={pond.id}
            style={[styles.pondChip, selectedPond?.id === pond.id && styles.selectedPondChip]}
            onPress={() => handleSelectPond(pond)}>
            <Text style={[styles.pondChipText, selectedPond?.id === pond.id && styles.selectedPondChipText]}>{pond.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {selectedPond && (
        <Link href={{ pathname: "/add-growth-reading", params: { pondId: selectedPond.id, pondName: selectedPond.name } }} asChild>
          <Pressable style={styles.addButton}>
            <ThemedText style={styles.addButtonText}>+ Añadir Muestreo para {selectedPond.name}</ThemedText>
          </Pressable>
        </Link>
      )}

      {isLoadingReadings ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" color={Colors.light.tint} />
      ) : (
        <FlatList
          data={readings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderReadingItem}
          ListEmptyComponent={<ThemedText style={styles.emptyText}>Aún no hay muestreos para este estanque.</ThemedText>}
          contentContainerStyle={{ paddingTop: 10 }}
        />
      )}
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
    padding: 16,
  },
  linkText: {
    color: Colors.light.tint,
    marginTop: 8,
    fontSize: 16,
  },
  pondSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    maxHeight: 50,
  },
  pondChip: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  selectedPondChip: {
    backgroundColor: Colors.light.tint,
  },
  pondChipText: {
    color: '#000',
    fontWeight: '600',
  },
  selectedPondChipText: {
    color: '#FFF',
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
  readingItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  readingTimestamp: {
    fontWeight: 'bold',
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },
  readingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  readingValue: {
    width: '100%',
    marginBottom: 8,
    fontSize: 14,
    color: '#555',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});
