import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect, Link } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { getTransactions } from '@/utils/storage';
import type { Transaction } from '@/utils/types';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function FinancialsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedTransactions = await getTransactions();
      setTransactions(fetchedTransactions.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las transacciones.");
      console.error("Error loading transactions", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(loadTransactions);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <ThemedView style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <ThemedText style={styles.transactionDescription}>{item.description}</ThemedText>
        <ThemedText style={styles.transactionTimestamp}>{new Date(item.timestamp).toLocaleDateString()}</ThemedText>
      </View>
      <ThemedText style={[styles.transactionAmount, { color: item.type === 'income' ? Colors.light.tint : 'red' }]}>
        {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
      </ThemedText>
    </ThemedView>
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={Colors[theme].tint} />
        <ThemedText>Cargando Finanzas...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Gestión Financiera</ThemedText>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <ThemedText style={styles.summaryLabel}>Ingresos Totales</ThemedText>
          <ThemedText style={[styles.summaryValue, { color: Colors.light.tint }]}>${totalIncome.toFixed(2)}</ThemedText>
        </View>
        <View style={styles.summaryBox}>
          <ThemedText style={styles.summaryLabel}>Gastos Totales</ThemedText>
          <ThemedText style={[styles.summaryValue, { color: 'red' }]}>${totalExpenses.toFixed(2)}</ThemedText>
        </View>
        <View style={styles.summaryBox}>
          <ThemedText style={styles.summaryLabel}>Balance Neto</ThemedText>
          <ThemedText style={[styles.summaryValue, { color: netBalance >= 0 ? Colors.light.tint : 'red' }]}>${netBalance.toFixed(2)}</ThemedText>
        </View>
      </View>

      <Link href="/add-transaction" asChild>
        <Pressable style={styles.addButton}>
          <ThemedText style={styles.addButtonText}>+ Añadir Transacción</ThemedText>
        </Pressable>
      </Link>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTransactionItem}
        ListEmptyComponent={<ThemedText style={styles.emptyText}>No hay transacciones registradas.</ThemedText>}
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
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  summaryBox: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#888',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
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
  transactionItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
  },
  transactionTimestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});
