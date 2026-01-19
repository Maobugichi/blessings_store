import type { InventoryItem, ProductProfit, RestockInput, SaleInput, TodayProfit } from '@/types/inventory.types';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const inventoryApi = {
  getInventory: async (): Promise<InventoryItem[]> => {
    const { data } = await axiosInstance.get<InventoryItem[]>('/inventory');
    return data;
  },
  
  getTodayProfit: async (): Promise<TodayProfit> => {
    const { data } = await axiosInstance.get<TodayProfit>('/inventory/profit/today');
    return data;
  },
  
  getProfitByProduct: async (): Promise<ProductProfit[]> => {
    const { data } = await axiosInstance.get<ProductProfit[]>('/inventory/profit/products');
    return data;
  },
  
  processSale: async (saleData: SaleInput) => {
    const { data } = await axiosInstance.post('/sales', saleData);
    return data;
  },
  
  restockItem: async (restockData: RestockInput): Promise<InventoryItem> => {
    const { data } = await axiosInstance.post<InventoryItem>('/inventory/restock', restockData);
    return data;
  },

  checkLowStock: async () => {
    const { data } = await axiosInstance.post('/notifications/check-stock');
    return data;
  },

  getLowStockItems: async (): Promise<InventoryItem[]> => {
    const { data } = await axiosInstance.get('/notifications/low-stock');
    return data.items;
  },
};
