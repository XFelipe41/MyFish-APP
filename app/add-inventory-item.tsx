import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, Alert, Text, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { saveInventoryItem } from '@/utils/storage';
import { Colors } from '@/constants/theme';

const CATEGORIES = ['Alimento', 'Medicamento', 'Equipo', 'Peces'];

export default function AddInventoryItemModal() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [lowStock, setLowStock] = useState('');

  const handleSaveItem = async () => {
    if (!name.trim() || !quantity.trim() || !unit.trim()) {
      Alert.alert('Error', 'Por favor, completa nombre, cantidad y unidad.');
      return;
    }
    const quantityValue = parseFloat(quantity);
    const lowStockValue = lowStock ? parseFloat(lowStock) : undefined;

    if (isNaN(quantityValue)) {
      Alert.alert('Error', 'La cantidad debe ser un número válido.');
      return;
    }

    try {
      await saveInventoryItem({
        name,
        category,
        quantity: quantityValue,
        unit,
        low_stock_threshold: lowStockValue,
      });
      Alert.alert('Éxito', 'Artículo añadido al inventario.');
      if (router.canGoBack()) {
        router.back();
      }
    } catch (error) {
      console.error('Error saving item', error);
      Alert.alert('Error', 'No se pudo añadir el artículo.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>Añadir Artículo al Inventario</ThemedText>

        <Text style={styles.label}>Nombre del Artículo</Text>
        <TextInput style={styles.input} placeholder="Ej: Alimento 3mm" value={name} onChangeText={setName} />

        <Text style={styles.label}>Categoría</Text>
        {/* A proper picker would be better here */}
        <View style={styles.categoryContainer}>
          {CATEGORIES.map(cat => (
            <Pressable key={cat} onPress={() => setCategory(cat)} style={[styles.categoryChip, category === cat && styles.selectedCategoryChip]}>
              <Text style={[styles.categoryChipText, category === cat && styles.selectedCategoryChipText]}>{cat}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Cantidad</Text>
        <TextInput style={styles.input} placeholder="Ej: 500" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />

        <Text style={styles.label}>Unidad</Text>
        <TextInput style={styles.input} placeholder="Ej: kg, L, unidades" value={unit} onChangeText={setUnit} />

        <Text style={styles.label}>Umbral de Stock Bajo (Opcional)</Text>
        <TextInput style={styles.input} placeholder="Ej: 50" value={lowStock} onChangeText={setLowStock} keyboardType="numeric" />

        <Pressable style={styles.button} onPress={handleSaveItem}>
          <ThemedText style={styles.buttonText}>Guardar Artículo</ThemedText>
        </Pressable>
      </ScrollView>
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
    color: '#333',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  categoryChip: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategoryChip: {
    backgroundColor: Colors.light.tint,
  },
  categoryChipText: {
    color: '#000',
  },
  selectedCategoryChipText: {
    color: '#FFF',
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
