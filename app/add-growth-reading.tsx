import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, Alert, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { saveGrowthReading } from '@/utils/storage';
import type { GrowthReading } from '@/utils/types';
import { Colors } from '@/constants/theme';

const fields: { name: keyof Omit<GrowthReading, 'id' | 'pond_id' | 'timestamp'>; label: string; unit: string }[] = [
  { name: 'average_weight', label: 'Peso Promedio', unit: 'g' },
  { name: 'average_length', label: 'Longitud Promedio', unit: 'cm' },
  { name: 'total_biomass', label: 'Biomasa Total', unit: 'kg' },
];

export default function AddGrowthReadingModal() {
  const { pondId, pondName } = useLocalSearchParams();
  const router = useRouter();
  const [formState, setFormState] = useState<{[key: string]: string}>({});

  const handleInputChange = (name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveReading = async () => {
    if (!pondId) {
      Alert.alert('Error', 'No se ha seleccionado un estanque.');
      return;
    }

    const reading: Omit<GrowthReading, 'id'> = {
      pond_id: pondId as string,
      timestamp: Date.now(),
      average_weight: formState.average_weight ? parseFloat(formState.average_weight) : 0,
      average_length: formState.average_length ? parseFloat(formState.average_length) : 0,
      total_biomass: formState.total_biomass ? parseFloat(formState.total_biomass) : 0,
    };

    if (!reading.average_weight || !reading.average_length || !reading.total_biomass) {
        Alert.alert('Error', 'Por favor, completa todos los campos.');
        return;
    }

    try {
      await saveGrowthReading(reading);
      Alert.alert('Éxito', 'Muestreo guardado correctamente.');
      if (router.canGoBack()) {
        router.back();
      }
    } catch (error) {
      console.error('Error saving reading', error);
      Alert.alert('Error', 'No se pudo guardar el muestreo.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>Nuevo Muestreo para {pondName}</ThemedText>
        
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
          <ThemedText style={styles.buttonText}>Guardar Muestreo</ThemedText>
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
