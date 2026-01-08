import { inventoryApi } from '@/services/inventory.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['todayProfit'] });
      queryClient.invalidateQueries({ queryKey: ['productProfits'] });
    },
  });
};

export const useRestockMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: inventoryApi.restockItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};