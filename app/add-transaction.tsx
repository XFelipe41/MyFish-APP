import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, Alert, Text, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { saveTransaction } from '@/utils/storage';
import type { Transaction } from '@/utils/types';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AddTransactionModal() {
  const router = useRouter();
  const { theme } = useTheme();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSaveTransaction = async () => {
    const amountValue = parseFloat(amount);
    if (!amountValue || isNaN(amountValue) || !description.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos con valores válidos.');
      return;
    }

    const transaction: Omit<Transaction, 'id'> = {
      type,
      amount: amountValue,
      description,
      timestamp: Date.now(),
    };

    try {
      await saveTransaction(transaction);
      Alert.alert('Éxito', 'Transacción guardada correctamente.');
      if (router.canGoBack()) {
        router.back();
      }
    } catch (error) {
      console.error('Error saving transaction', error);
      Alert.alert('Error', 'No se pudo guardar la transacción.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Añadir Transacción</ThemedText>

      <View style={styles.switchContainer}>
        <ThemedText style={[styles.switchLabel, type === 'income' && styles.activeSwitch]}>Ingreso</ThemedText>
        <Switch
          trackColor={{ false: '#E57373', true: '#81C784' }}
          thumbColor={theme === 'dark' ? Colors.dark.text : Colors.light.text}
          onValueChange={() => setType(type === 'income' ? 'expense' : 'income')}
          value={type === 'income'}
        />
        <ThemedText style={[styles.switchLabel, type === 'expense' && styles.activeSwitch]}>Gasto</ThemedText>
      </View>

      <ThemedText style={styles.label}>Descripción</ThemedText>
      <TextInput
        style={[styles.input, { color: Colors[theme].text, backgroundColor: Colors[theme].background, borderColor: Colors[theme].text }]}
        placeholder="Ej: Compra de alimento"
        value={description}
        onChangeText={setDescription}
      />

      <ThemedText style={styles.label}>Monto</ThemedText>
      <TextInput
        style={[styles.input, { color: Colors[theme].text, backgroundColor: Colors[theme].background, borderColor: Colors[theme].text }]}
        placeholder="Ej: 150.00"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Pressable style={[styles.button, { backgroundColor: Colors[theme].tint }]} onPress={handleSaveTransaction}>
        <ThemedText style={styles.buttonText}>Guardar Transacción</ThemedText>
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 18,
    marginHorizontal: 10,
    color: '#888',
  },
  activeSwitch: {
    fontWeight: 'bold',
    color: '#333',
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
  button: {
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
