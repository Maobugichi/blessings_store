import apiClient from '@/config/axios.config';
import type { InventoryItem, ProductProfit, RestockInput, SaleInput, TodayProfit } from '@/types/inventory.types';



export const inventoryApi = {
  getInventory: async (): Promise<InventoryItem[]> => {
    const { data } = await apiClient.get<InventoryItem[]>('/inventory');
    return data;
  },
  
  getTodayProfit: async (): Promise<TodayProfit> => {
    const { data } = await apiClient.get<TodayProfit>('/profit/today');
    return data;
  },
  
  getProfitByProduct: async (): Promise<ProductProfit[]> => {
    const { data } = await apiClient.get<ProductProfit[]>('/profit/products');
    return data;
  },
  
  processSale: async (saleData: SaleInput) => {
    const { data } = await apiClient.post('/sales', saleData);
    return data;
  },
  
  restockItem: async (restockData: RestockInput): Promise<InventoryItem> => {
    const { data } = await apiClient.post<InventoryItem>('/restock', restockData);
    return data;
  },

  checkLowStock: async () => {
    const { data } = await apiClient.post('/notifications/check-stock');
    return data;
  },

  getLowStockItems: async (): Promise<InventoryItem[]> => {
    const { data } = await apiClient.get('/notifications/low-stock');
    return data.items;
  },
};
