import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInventory, useProductProfits, useRestockMutation, useSaleMutation, useTodayProfit } from '@/hooks/useInventory';
import type { InventoryItem, RestockInput, SaleInput } from '@/types/inventory.types';
import {
  PackageIcon,
  TrendUpIcon,
  ShoppingCartIcon,
} from "@phosphor-icons/react";

import { useState } from 'react';
import { StatsCard } from '../statsCard';
import { Card } from '../ui/card';
import { InventoryTable } from '../inventoryTable';
import { ProfitTable } from '../profitTable';
import { SaleModal } from '../saleModal';
import { RestockModal } from '../restockModal';
import { Spinner } from '../ui/spinner';

const InventoryManagement: React.FC = () => {
  const [saleModal, setSaleModal] = useState<{ open: boolean; item: InventoryItem | null }>({
    open: false,
    item: null,
  });
  const [restockModal, setRestockModal] =useState<{ open: boolean; item: InventoryItem | null }>({
    open: false,
    item: null,
  });

 
  const { data: inventory = [], isLoading } = useInventory();
  const { data: todayProfit = { total_profit: 0 } } = useTodayProfit();
  const { data: productProfits = [] } = useProductProfits();
  const saleMutation = useSaleMutation();
  const restockMutation = useRestockMutation();

  
  const totalStockValue = inventory.reduce((sum, item) => sum + parseFloat(item.stock_value?.toString() || '0'), 0);
  const totalStockCost = inventory.reduce((sum, item) => sum + parseFloat(item.stock_cost?.toString() || '0'), 0);
  const totalPotentialProfit = inventory.reduce((sum, item) => sum + parseFloat(item.potential_profit?.toString() || '0'), 0);

  const handleSaleSubmit = (data: SaleInput) => {
    saleMutation.mutate(data, {
      onSuccess: () => {
        setSaleModal({ open: false, item: null });
      },
    });
  };

  const handleRestockSubmit = (data: RestockInput) => {
    restockMutation.mutate(data, {
      onSuccess: () => {
        setRestockModal({ open: false, item: null });
      },
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background">
      
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold tracking-tight">Blessing's Inventory</h1>
          <p className="text-muted-foreground mt-1">Track stock, sales, and profits in real-time</p>
        </div>
      </div>

     
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
           <StatsCard
            title="Stock Cost (Invested)"
            value={formatCurrency(totalStockCost)}
            icon={PackageIcon}
            iconColor="orange-600"
          />
          <StatsCard
            title="Today's Profit"
            value={formatCurrency(todayProfit.total_profit)}
            icon={TrendUpIcon}
            iconColor="green-600"
          />
          <StatsCard
            title="Stock Value (Potential)"
            value={formatCurrency(totalStockValue)}
            icon={ShoppingCartIcon}
            iconColor="blue-600"
          />
          <StatsCard
            title="Potential Profit"
            value={formatCurrency(totalPotentialProfit)}
            icon={TrendUpIcon}
            iconColor="green-600"
          />
        </div>

      
        <Card>
          <Tabs defaultValue="inventory" className="w-full">
            <div className="border-b py-3 px-6">
              <TabsList className="h-11  rounded-2xl">
                <TabsTrigger value="inventory" className="data-[state=active]:bg-background data-[state=active]:text-black text-gray-400 transition-colors ease-in duration-300 px-3 rounded-xl">
                  Inventory
                </TabsTrigger>
                <TabsTrigger value="profits" className="data-[state=active]:bg-background data-[state=active]:text-black text-gray-400 duration-300 px-3 transition-colors ease-in rounded-xl">
                  Product Profits
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="inventory" className="p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Spinner className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Loading inventory...</p>
                </div>
              ) : (
                <InventoryTable
                  items={inventory}
                  onSale={(item) => setSaleModal({ open: true, item })}
                  onRestock={(item) => setRestockModal({ open: true, item })}
                />
              )}
            </TabsContent>

            <TabsContent value="profits" className="p-6">
              <ProfitTable products={productProfits} />
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      
      <SaleModal
        open={saleModal.open}
        item={saleModal.item}
        onClose={() => {
          setSaleModal({ open: false, item: null });
          saleMutation.reset();
        }}
        onSubmit={handleSaleSubmit}
        isLoading={saleMutation.isPending}
        error={saleMutation.error}
      />

      <RestockModal
        open={restockModal.open}
        item={restockModal.item}
        onClose={() => {
          setRestockModal({ open: false, item: null });
          restockMutation.reset();
        }}
        onSubmit={handleRestockSubmit}
        isLoading={restockMutation.isPending}
        error={restockMutation.error}
      />
    </div>
  );
};

export default InventoryManagement