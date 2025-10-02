import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, Alert, Text, Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { savePond } from '@/utils/storage';
import { Colors } from '@/constants/theme';

export default function AddPondModal() {
  const [name, setName] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [capacity, setCapacity] = useState('');
  const [status, setStatus] = useState('Activo'); // Default status
  const router = useRouter();

  const handleAddPond = async () => {
    if (!name.trim() || !dimensions.trim() || !capacity.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }
    const capacityValue = parseFloat(capacity);
    if (isNaN(capacityValue)) {
      Alert.alert('Error', 'Por favor, introduce un número válido para la capacidad.');
      return;
    }

    try {
      await savePond({ name, dimensions, capacity: capacityValue, status });
      Alert.alert('Éxito', 'Estanque añadido correctamente.');
      if (router.canGoBack()) {
        router.back();
      }
    } catch (error) {
      console.error('Error adding pond', error);
      Alert.alert('Error', 'No se pudo añadir el estanque.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Añadir Nuevo Estanque</ThemedText>
      
      <Text style={styles.label}>Nombre del Estanque</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Estanque A1"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Dimensiones</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 10x20x1.5m"
        value={dimensions}
        onChangeText={setDimensions}
      />

      <Text style={styles.label}>Capacidad (m³)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 300"
        value={capacity}
        onChangeText={setCapacity}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Estado</Text>
      {/* A picker for status would be better, but using TextInput for simplicity */}
      <TextInput
        style={styles.input}
        placeholder="Ej: Activo, Mantenimiento"
        value={status}
        onChangeText={setStatus}
      />

      <Pressable style={styles.button} onPress={handleAddPond}>
        <ThemedText style={styles.buttonText}>Guardar Estanque</ThemedText>
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
    color: '#333',
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
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
