import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useFocusEffect, Link } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { getInventoryItems, saveAllInventoryItems } from '@/utils/storage';
import type { InventoryItem } from '@/utils/types';
import { Colors } from '@/constants/theme';

const CATEGORIES = ['Todos', 'Alimento', 'Medicamento', 'Equipo', 'Peces'];

export default function InventoryScreen() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filter, setFilter] = useState('Todos');
  const [isLoading, setIsLoading] = useState(true);

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const allItems = await getInventoryItems();
      if (filter === 'Todos') {
        setItems(allItems);
      } else {
        setItems(allItems.filter(item => item.category === filter));
      }
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los artículos del inventario.");
      console.error("Error loading inventory items", error);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useFocusEffect(loadItems);

  const handleUpdateQuantity = async (item: InventoryItem, amount: number) => {
    const newQuantity = item.quantity + amount;
    if (newQuantity < 0 || !item.id) return;

    try {
      const allItems = await getInventoryItems();
      const updatedItems = allItems.map(i =>
        i.id === item.id ? { ...i, quantity: newQuantity } : i
      );
      await saveAllInventoryItems(updatedItems);
      // Optimistic update on the UI
      setItems(updatedItems.filter(i => filter === 'Todos' || i.category === filter));
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la cantidad.");
      console.error("Error updating quantity", error);
    }
  };

  const renderItem = ({ item }: { item: InventoryItem }) => {
    const isLowStock = item.low_stock_threshold != null && item.quantity < item.low_stock_threshold;
    return (
      <View style={[styles.itemContainer, isLowStock && styles.lowStockContainer]}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
          {isLowStock && <Text style={styles.lowStockText}>¡Stock Bajo!</Text>}
        </View>
        <View style={styles.quantityControl}>
          <Pressable onPress={() => handleUpdateQuantity(item, -1)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </Pressable>
          <Text style={styles.itemQuantity}>{`${item.quantity} ${item.unit}`}</Text>
          <Pressable onPress={() => handleUpdateQuantity(item, 1)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={{ marginBottom: 8 }}>Inventario</ThemedText>
      
      <View style={{ height: 50 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categorySelector}>
          {CATEGORIES.map(cat => (
            <Pressable
              key={cat}
              style={[styles.categoryChip, filter === cat && styles.selectedCategoryChip]}
              onPress={() => setFilter(cat)}>
              <Text style={[styles.categoryChipText, filter === cat && styles.selectedCategoryChipText]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <Link href="/add-inventory-item" asChild>
        <Pressable style={styles.addButton}>
          <ThemedText style={styles.addButtonText}>+ Añadir Nuevo Artículo</ThemedText>
        </Pressable>
      </Link>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.light.tint} style={{ marginTop: 20 }}/>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={item => item.id!.toString()}
          ListEmptyComponent={<ThemedText style={styles.emptyText}>No hay artículos en esta categoría.</ThemedText>}
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
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryChip: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  selectedCategoryChip: {
    backgroundColor: Colors.light.tint,
  },
  categoryChipText: {
    color: '#000',
    fontWeight: '600',
  },
  selectedCategoryChipText: {
    color: '#FFF',
  },
  addButton: {
    backgroundColor: Colors.light.tint,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  lowStockContainer: {
    borderColor: '#D32F2F',
    backgroundColor: '#FFEBEE',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemCategory: {
    color: '#666',
    fontStyle: 'italic',
  },
  lowStockText: {
    color: '#C62828',
    fontWeight: 'bold',
    marginTop: 4,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
  itemQuantity: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 80, // Increased width
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});
