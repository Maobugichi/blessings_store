import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ProductProfit } from '@/types/inventory.types';
import { Badge } from './ui/badge';


export const ProfitTable: React.FC<{ products: ProductProfit[] }> = ({ products }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Units Sold</TableHead>
            <TableHead className="text-right">Total Profit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                No sales data available
              </TableCell>
            </TableRow>
          ) : (
            products.map((product, idx) => (
              <TableRow key={idx} className="hover:bg-muted/50">
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary">{product.total_units_sold}</Badge>
                </TableCell>
                <TableCell className="text-right font-bold text-green-600">
                  {formatCurrency(product.total_profit)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};