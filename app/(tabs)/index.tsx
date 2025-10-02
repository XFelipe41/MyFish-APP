import { StyleSheet, View, Text, Alert, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import React, { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getPonds } from '@/utils/storage';
import { useTheme } from '@/hooks/use-theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function DashboardScreen() {
  const [pondCount, setPondCount] = useState(0);
  const { theme, setTheme } = useTheme();

  // This effect runs when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const loadDashboardData = async () => {
        try {
          const ponds = await getPonds();
          setPondCount(ponds.length);
        } catch (error) {
          console.error("Failed to load dashboard data:", error);
          Alert.alert("Error", "Failed to load data from storage.");
        }
      };

      loadDashboardData();
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Dashboard</ThemedText>
        <Pressable onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          <IconSymbol name={theme === 'light' ? 'moon.fill' : 'sun.max.fill'} size={24} color={Colors[theme].text} />
        </Pressable>
      </View>
      <ThemedText style={styles.subtitle}>Bienvenido a MyFish</ThemedText>

      <View style={styles.grid}>
        <ThemedView style={styles.card}>
          <ThemedText style={[styles.cardValue, {color: Colors[theme].tint}]}>{pondCount}</ThemedText>
          <ThemedText style={styles.cardLabel}>Estanques Registrados</ThemedText>
        </ThemedView>
        <ThemedView style={styles.card}>
          <ThemedText style={[styles.cardValue, {color: Colors[theme].tint}]}>OK</ThemedText>
          <ThemedText style={styles.cardLabel}>Calidad del Agua</ThemedText>
        </ThemedView>
        <ThemedView style={styles.card}>
          <ThemedText style={[styles.cardValue, {color: Colors[theme].tint}]}>3</ThemedText>
          <ThemedText style={styles.cardLabel}>Alertas Activas</ThemedText>
        </ThemedView>
        <ThemedView style={styles.card}>
          <ThemedText style={[styles.cardValue, {color: Colors[theme].tint}]}>5</ThemedText>
          <ThemedText style={styles.cardLabel}>Tareas Pendientes</ThemedText>
        </ThemedView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    borderRadius: 12,
    padding: 20,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  cardLabel: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});