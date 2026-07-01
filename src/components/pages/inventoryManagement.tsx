import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useInventory,
  useProductProfits,
  useRestockMutation,
  useSaleMutation,
  useDamageMutation,
  useTodayProfit,
  useProfitByWeek,
  useDamagesByWeek,
  useMergedWeekly,
  useProfitSummary,
} from '@/hooks/useInventory';
import type {
  InventoryItem,
  RestockInput,
  SaleInput,
  DamageInput,
  DateRange,
} from '@/types/inventory.types';
import {
  PackageIcon,
  TrendUpIcon,
  ShoppingCartIcon,
} from "@phosphor-icons/react";

import { useState } from 'react';
import { format } from 'date-fns';
import { StatsCard } from '../inventoryDash/statsCard';
import { Card } from '../ui/card';
import { InventoryTable } from '../inventoryDash/inventoryTable';
import { ProfitTable } from '../profitTable';
import { SaleModal } from '../inventoryDash/saleModal';
import { RestockModal } from '../inventoryDash/restockModal';
import { DamageModal } from '../inventoryDash/damageModal';
import { Spinner } from '../ui/spinner';
import Header from '../inventoryDash/inventoryHeader';
import { AddItemModal } from '../inventoryDash/addItemModal';
import { Button } from '../ui/button';
import { DateRangePicker } from '../inventoryDash/dateRangePicker';
import { TotalGainCard, type ViewMode } from '../inventoryDash/totalGainCards';
import { WeeklyProfitTable } from '../inventoryDash/weeklyProfitTable';
import { WeeklyDamageTable } from '../inventoryDash/weeklyDamageTable';
import { MergedWeeklyTable } from '../inventoryDash/mergeTableWeekly';

const InventoryManagement: React.FC = () => {
  const [saleModal, setSaleModal] = useState<{ open: boolean; item: InventoryItem | null }>({
    open: false,
    item: null,
  });
  const [restockModal, setRestockModal] = useState<{ open: boolean; item: InventoryItem | null }>({
    open: false,
    item: null,
  });
  const [damageModal, setDamageModal] = useState<{ open: boolean; item: InventoryItem | null }>({
    open: false,
    item: null,
  });
  const [addModal, setAddModal] = useState(false);

  const [range, setRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [analyticsMode, setAnalyticsMode] = useState<ViewMode>('separate');

  const dateRange: DateRange = {
    startDate: range.from ? format(range.from, 'yyyy-MM-dd') : '',
    endDate: range.to ? format(range.to, 'yyyy-MM-dd') : '',
  };

  const { data: inventory = [], isLoading } = useInventory();
  const { data: todayProfit = { total_profit: 0 } } = useTodayProfit();
  const { data: productProfits = [] } = useProductProfits();
  const saleMutation = useSaleMutation();
  const restockMutation = useRestockMutation();
  const damageMutation = useDamageMutation();

  const { data: weeklyProfit = [] } = useProfitByWeek(dateRange);
  const { data: weeklyDamages = [] } = useDamagesByWeek(dateRange);
  const { data: mergedWeekly = [] } = useMergedWeekly(dateRange);
  const { data: summary, isLoading: summaryLoading } = useProfitSummary(dateRange);

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

  const handleDamageSubmit = (data: DamageInput) => {
    damageMutation.mutate(data, {
      onSuccess: () => {
        setDamageModal({ open: false, item: null });
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

      <Header/>

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

        <Button onClick={() => setAddModal(true)}>Add Item</Button>
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
                <TabsTrigger value="analytics" className="data-[state=active]:bg-background data-[state=active]:text-black text-gray-400 duration-300 px-3 transition-colors ease-in rounded-xl">
                  Analytics
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
                  onDamage={(item) => setDamageModal({ open: true, item })}
                />
              )}
            </TabsContent>

            <TabsContent value="profits" className="p-6">
              <ProfitTable products={productProfits} />
            </TabsContent>

            <TabsContent value="analytics" className="p-6 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-semibold">Profit & Damage Analytics</h2>
                <DateRangePicker from={range.from} to={range.to} onChange={setRange} />
              </div>

              <TotalGainCard
                summary={summary}
                isLoading={summaryLoading}
                mode={analyticsMode}
                onModeChange={setAnalyticsMode}
              />

              {!dateRange.startDate || !dateRange.endDate ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Select a date range to view profit and damage data.
                </p>
              ) : analyticsMode === 'separate' ? (
                <div className="space-y-6">
                  <WeeklyProfitTable products={weeklyProfit} />
                  <WeeklyDamageTable damages={weeklyDamages} />
                </div>
              ) : (
                <MergedWeeklyTable rows={mergedWeekly} />
              )}
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

      <DamageModal
        open={damageModal.open}
        item={damageModal.item}
        onClose={() => {
          setDamageModal({ open: false, item: null });
          damageMutation.reset();
        }}
        onSubmit={handleDamageSubmit}
        isLoading={damageMutation.isPending}
        error={damageMutation.error}
      />


    <AddItemModal open={addModal} onClose={() => setAddModal(false)} />
    </div>
  );
};

export default InventoryManagement