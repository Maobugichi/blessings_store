import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Scale } from 'lucide-react';
import type { ProfitSummary } from '@/types/inventory.types';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 }).format(n);

export type ViewMode = 'separate' | 'merged';

interface TotalGainCardProps {
  summary: ProfitSummary | undefined;
  isLoading: boolean;
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

export const TotalGainCard: React.FC<TotalGainCardProps> = ({
  summary,
  isLoading,
  mode,
  onModeChange,
}) => {
  const salesProfit = Number(summary?.total_sales_profit ?? 0);
  const damageLoss = Number(summary?.total_damage_loss ?? 0);
  const netProfit = Number(summary?.net_profit ?? 0);

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <div className="inline-flex rounded-md border p-1">
          <Button
            size="sm"
            variant={mode === 'separate' ? 'default' : 'ghost'}
            onClick={() => onModeChange('separate')}
          >
            Separate
          </Button>
          <Button
            size="sm"
            variant={mode === 'merged' ? 'default' : 'ghost'}
            onClick={() => onModeChange('merged')}
          >
            Merged
          </Button>
        </div>
      </div>

      {mode === 'separate' ? (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{isLoading ? '—' : fmt(salesProfit)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Damage Loss</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{isLoading ? '—' : fmt(damageLoss)}</div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit (Sales − Damages)</CardTitle>
            <Scale className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {isLoading ? '—' : fmt(netProfit)}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};