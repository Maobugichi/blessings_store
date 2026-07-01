import apiClient from '@/config/axios.config';
import type { CreateInventoryInput, DamageInput, DamageResult, DateRange, InventoryItem, MergedWeeklyRow, ProductProfit, ProfitSummary, RestockInput, SaleInput, TodayProfit, WeeklyDamage, WeeklyProductProfit } from '@/types/inventory.types';


export const inventoryApi = {
  getInventory: async (): Promise<InventoryItem[]> => {
    const { data } = await apiClient.get<{ items: InventoryItem[] }>('/inventory');
    return data.items;
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

  createItem: async (data: CreateInventoryInput): Promise<{ item: InventoryItem }> => {
    const response = await apiClient.post<{ item: InventoryItem }>('/inventory', data);
    return response.data;
  },

  processDamage: async (damageData: DamageInput): Promise<DamageResult> => {
    const { data } = await apiClient.post<DamageResult>('/damages', damageData);
    return data;
  },

  getMergedWeekly: async (range: DateRange): Promise<MergedWeeklyRow[]> => {
    const { data } = await apiClient.get<MergedWeeklyRow[]>('/profit/merged-weekly', {
      params: range,
    });
    return data;
  },

  getDamagesByWeek: async (range: DateRange): Promise<WeeklyDamage[]> => {
    const { data } = await apiClient.get<WeeklyDamage[]>('/profit/damages-weekly', {
      params: range,
    });
    return data;
  },

  getProfitByWeek: async (range: DateRange): Promise<WeeklyProductProfit[]> => {
    const { data } = await apiClient.get<WeeklyProductProfit[]>('/profit/weekly', {
      params: range,
    });
    return data;
  },

  getProfitSummary: async (range: DateRange): Promise<ProfitSummary> => {
    const { data } = await apiClient.get<ProfitSummary>('/profit/summary', {
      params: range,
    });
    return data;
  },
};
