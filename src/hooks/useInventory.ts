import { inventoryApi } from '@/services/inventory.service';
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