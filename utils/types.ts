export interface Pond {
  id: string;
  name: string;
  dimensions: string;
  capacity: number;
  status: string;
}

export interface WaterQualityReading {
  id: string;
  pond_id: string;
  timestamp: number;
  temperature?: number;
  ph?: number;
  dissolved_oxygen?: number;
  ammonia?: number;
  nitrite?: number;
  nitrate?: number;
  turbidity?: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  low_stock_threshold?: number;
}

export interface GrowthReading {
  id: string;
  pond_id: string;
  timestamp: number;
  average_weight: number;
  average_length: number;
  total_biomass: number;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  timestamp: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: number;
  completed: boolean;
}
