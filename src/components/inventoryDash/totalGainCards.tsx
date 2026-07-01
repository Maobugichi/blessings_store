import { Card, CardContent } from '@/components/ui/card';
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
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="inline-flex rounded-lg border bg-muted/40 p-1">
          <Button
            size="sm"
            variant={mode === 'separate' ? 'default' : 'ghost'}
            className="rounded-md"
            onClick={() => onModeChange('separate')}
          >
            Separate
          </Button>
          <Button
            size="sm"
            variant={mode === 'merged' ? 'default' : 'ghost'}
            className="rounded-md"
            onClick={() => onModeChange('merged')}
          >
            Merged
          </Button>
        </div>
      </div>

      {mode === 'separate' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="relative overflow-hidden border-green-100 dark:border-green-900/40">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent dark:from-green-950/30" />
            <CardContent className="relative p-5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground truncate">Total Sales Profit</p>
                <p className="mt-1 text-2xl sm:text-3xl font-bold text-green-600 truncate">
                  {isLoading ? '—' : fmt(salesProfit)}
                </p>
              </div>
              <div className="shrink-0 h-11 w-11 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-red-100 dark:border-red-900/40">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent dark:from-red-950/30" />
            <CardContent className="relative p-5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground truncate">Total Damage Loss</p>
                <p className="mt-1 text-2xl sm:text-3xl font-bold text-red-600 truncate">
                  {isLoading ? '—' : fmt(damageLoss)}
                </p>
              </div>
              <div className="shrink-0 h-11 w-11 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card
          className={`relative overflow-hidden ${
            netProfit >= 0
              ? 'border-green-100 dark:border-green-900/40'
              : 'border-red-100 dark:border-red-900/40'
          }`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br to-transparent ${
              netProfit >= 0 ? 'from-green-50 dark:from-green-950/30' : 'from-red-50 dark:from-red-950/30'
            }`}
          />
          <CardContent className="relative p-5 sm:p-6 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground truncate">Net Profit (Sales − Damages)</p>
              <p
                className={`mt-1 text-3xl sm:text-4xl font-bold truncate ${
                  netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isLoading ? '—' : fmt(netProfit)}
              </p>
            </div>
            <div
              className={`shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${
                netProfit >= 0 ? 'bg-green-100 dark:bg-green-900/40' : 'bg-red-100 dark:bg-red-900/40'
              }`}
            >
              <Scale className={`h-6 w-6 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};