import { inventoryApi } from '@/services/inventory.service';
import type { DateRange } from '@/types/inventory.types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";

export const useInventory = () => {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: inventoryApi.getInventory,
    refetchInterval: 30000,
  });
};

export const useTodayProfit = () => {
  return useQuery({
    queryKey: ['todayProfit'],
    queryFn: inventoryApi.getTodayProfit,
    refetchInterval: 10000,
  });
};

export const useProductProfits = () => {
  return useQuery({
    queryKey: ['productProfits'],
    queryFn: inventoryApi.getProfitByProduct,
  });
};



export const useSaleMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inventoryApi.processSale,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['todayProfit'] });
      queryClient.invalidateQueries({ queryKey: ['productProfits'] });
      
      toast.success("Sale processed successfully", {
        description: `Profit: ₦${data.profit.toFixed(2)}`
      });
    },
    onError: (error) => {
      toast.error("Failed to process sale", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
};
export const useRestockMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inventoryApi.restockItem,
    onSuccess: (data) => {
      console.log(data)
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success("Sale processed successfully", {
        description: `updated ${data.name}'s stock `
      });
    },
    onError: (error) => {
      toast.error("Failed to process sale", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inventoryApi.createItem,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Item added', {
        description: `${data.item.name} added to inventory`,
      });
    },
    onError: (error) => {
      toast.error('Failed to add item', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
};

export const useDamageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inventoryApi.processDamage,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['todayProfit'] });
      queryClient.invalidateQueries({ queryKey: ['productProfits'] });

      toast.success("Damage recorded", {
        description: `Loss: ₦${data.lossValue.toFixed(2)}`
      });
    },
    onError: (error) => {
      toast.error("Failed to record damage", {
        description: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
};

export const useMergedWeekly = (range: DateRange) => {
  return useQuery({
    queryKey: ['mergedWeekly', range.startDate, range.endDate],
    queryFn: () => inventoryApi.getMergedWeekly(range),
    enabled: !!range.startDate && !!range.endDate,
  });
};

export const useDamagesByWeek = (range: DateRange) => {
  return useQuery({
    queryKey: ['damagesByWeek', range.startDate, range.endDate],
    queryFn: () => inventoryApi.getDamagesByWeek(range),
    enabled: !!range.startDate && !!range.endDate,
  });
};

export const useProfitByWeek = (range: DateRange) => {
  return useQuery({
    queryKey: ['profitByWeek', range.startDate, range.endDate],
    queryFn: () => inventoryApi.getProfitByWeek(range),
    enabled: !!range.startDate && !!range.endDate,
  });
};

export const useProfitSummary = (range: DateRange) => {
  return useQuery({
    queryKey: ['profitSummary', range.startDate, range.endDate],
    queryFn: () => inventoryApi.getProfitSummary(range),
    enabled: !!range.startDate && !!range.endDate,
  });
};