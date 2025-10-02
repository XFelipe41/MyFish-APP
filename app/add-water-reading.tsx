import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, Alert, Text, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { saveWaterQualityReading } from '@/utils/storage';
import type { WaterQualityReading } from '@/utils/types';
import { Colors } from '@/constants/theme';

// Define the structure of the form fields
const fields: { name: keyof Omit<WaterQualityReading, 'id' | 'pond_id' | 'timestamp'>; label: string; unit: string }[] = [
  { name: 'temperature', label: 'Temperatura', unit: '°C' },
  { name: 'ph', label: 'pH', unit: '' },
  { name: 'dissolved_oxygen', label: 'Oxígeno Disuelto', unit: 'mg/L' },
  { name: 'ammonia', label: 'Amoniaco', unit: 'ppm' },
  { name: 'nitrite', label: 'Nitrito', unit: 'ppm' },
  { name: 'nitrate', label: 'Nitrato', unit: 'ppm' },
  { name: 'turbidity', label: 'Turbidez', unit: 'NTU' },
];

export default function AddWaterReadingModal() {
  // Get pondId and pondName from navigation parameters
  const { pondId, pondName } = useLocalSearchParams();
  const router = useRouter();

  // Initialize state for form inputs
  const [formState, setFormState] = useState<{[key: string]: string}>({});

  const handleInputChange = (name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveReading = async () => {
    if (!pondId) {
      Alert.alert('Error', 'No se ha seleccionado un estanque.');
      return;
    }

    // Construct the reading object from form state
    const reading: Omit<WaterQualityReading, 'id'> = {
      pond_id: pondId as string,
      timestamp: Date.now(),
      temperature: formState.temperature ? parseFloat(formState.temperature) : undefined,
      ph: formState.ph ? parseFloat(formState.ph) : undefined,
      dissolved_oxygen: formState.dissolved_oxygen ? parseFloat(formState.dissolved_oxygen) : undefined,
      ammonia: formState.ammonia ? parseFloat(formState.ammonia) : undefined,
      nitrite: formState.nitrite ? parseFloat(formState.nitrite) : undefined,
      nitrate: formState.nitrate ? parseFloat(formState.nitrate) : undefined,
      turbidity: formState.turbidity ? parseFloat(formState.turbidity) : undefined,
    };

    try {
      await saveWaterQualityReading(reading);
      Alert.alert('Éxito', 'Lectura guardada correctamente.');
      if (router.canGoBack()) {
        router.back();
      }
    } catch (error) {
      console.error('Error saving reading', error);
      Alert.alert('Error', 'No se pudo guardar la lectura.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>Nueva Lectura para {pondName}</ThemedText>
        
        {fields.map(field => (
          <View key={field.name}>
            <Text style={styles.label}>{`${field.label} ${field.unit ? `(${field.unit})` : ''}`}</Text>
            <TextInput
              style={styles.input}
              placeholder={`Valor de ${field.label.toLowerCase()}`}
              keyboardType="numeric"
              onChangeText={text => handleInputChange(field.name, text)}
              value={formState[field.name] || ''}
            />
          </View>
        ))}

        <Pressable style={styles.button} onPress={handleSaveReading}>
          <ThemedText style={styles.buttonText}>Guardar Lectura</ThemedText>
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
