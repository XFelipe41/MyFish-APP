import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Pond, InventoryItem, WaterQualityReading } from './types';

// Ponds
export const getPonds = async (): Promise<Pond[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem('ponds');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to fetch ponds from storage', e);
    return [];
  }
};

export const savePond = async (pond: Omit<Pond, 'id'>): Promise<Pond | null> => {
  try {
    const ponds = await getPonds();
    const newPond = { ...pond, id: Date.now().toString() };
    const newPonds = [...ponds, newPond];
    const jsonValue = JSON.stringify(newPonds);
    await AsyncStorage.setItem('ponds', jsonValue);
    return newPond;
  } catch (e) {
    console.error('Failed to save pond to storage', e);
    return null;
  }
};

// Inventory Items
export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem('inventory');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to fetch inventory items from storage', e);
    return [];
  }
};

export const saveInventoryItem = async (item: Omit<InventoryItem, 'id'>): Promise<InventoryItem | null> => {
  try {
    const items = await getInventoryItems();
    const newItem = { ...item, id: Date.now().toString() };
    const newItems = [...items, newItem];
    const jsonValue = JSON.stringify(newItems);
    await AsyncStorage.setItem('inventory', jsonValue);
    return newItem;
  } catch (e) {
    console.error('Failed to save inventory item to storage', e);
    return null;
  }
};

export const saveAllInventoryItems = async (items: InventoryItem[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(items);
    await AsyncStorage.setItem('inventory', jsonValue);
  } catch (e) {
    console.error('Failed to save all inventory items to storage', e);
    throw e; // Re-throw to allow caller to handle
  }
};

// Water Quality Readings
export const getWaterQualityReadings = async (): Promise<WaterQualityReading[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem('waterReadings');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to fetch water quality readings from storage', e);
    return [];
  }
};

export const saveWaterQualityReading = async (reading: Omit<WaterQualityReading, 'id'>): Promise<WaterQualityReading | null> => {
  try {
    const readings = await getWaterQualityReadings();
    const newReading = { ...reading, id: Date.now().toString(), timestamp: reading.timestamp || Date.now() };
    const newReadings = [...readings, newReading];
    const jsonValue = JSON.stringify(newReadings);
    await AsyncStorage.setItem('waterReadings', jsonValue);
    return newReading;
  } catch (e) {
    console.error('Failed to save water quality reading to storage', e);
    return null;
  }
};

// Growth Readings
export const getGrowthReadings = async (): Promise<GrowthReading[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem('growthReadings');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to fetch growth readings from storage', e);
    return [];
  }
};

export const saveGrowthReading = async (reading: Omit<GrowthReading, 'id'>): Promise<GrowthReading | null> => {
  try {
    const readings = await getGrowthReadings();
    const newReading = { ...reading, id: Date.now().toString(), timestamp: reading.timestamp || Date.now() };
    const newReadings = [...readings, newReading];
    const jsonValue = JSON.stringify(newReadings);
    await AsyncStorage.setItem('growthReadings', jsonValue);
    return newReading;
  } catch (e) {
    console.error('Failed to save growth reading to storage', e);
    return null;
  }
};

// Transactions
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem('transactions');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to fetch transactions from storage', e);
    return [];
  }
};

export const saveTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction | null> => {
  try {
    const transactions = await getTransactions();
    const newTransaction = { ...transaction, id: Date.now().toString(), timestamp: transaction.timestamp || Date.now() };
    const newTransactions = [...transactions, newTransaction];
    const jsonValue = JSON.stringify(newTransactions);
    await AsyncStorage.setItem('transactions', jsonValue);
    return newTransaction;
  } catch (e) {
    console.error('Failed to save transaction to storage', e);
    return null;
  }
};

// Tasks
export const getTasks = async (): Promise<Task[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem('tasks');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to fetch tasks from storage', e);
    return [];
  }
};

export const saveTask = async (task: Omit<Task, 'id' | 'completed'>): Promise<Task | null> => {
  try {
    const tasks = await getTasks();
    const newTask = { ...task, id: Date.now().toString(), completed: false };
    const newTasks = [...tasks, newTask];
    const jsonValue = JSON.stringify(newTasks);
    await AsyncStorage.setItem('tasks', jsonValue);
    return newTask;
  } catch (e) {
    console.error('Failed to save task to storage', e);
    return null;
  }
};

export const updateTaskCompletion = async (taskId: string, completed: boolean): Promise<void> => {
  try {
    const tasks = await getTasks();
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed } : task
    );
    const jsonValue = JSON.stringify(updatedTasks);
    await AsyncStorage.setItem('tasks', jsonValue);
  } catch (e) {
    console.error('Failed to update task completion to storage', e);
    throw e;
  }
};