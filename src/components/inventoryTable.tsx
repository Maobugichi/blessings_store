import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, TrendingUp } from 'lucide-react';
import type { InventoryItem } from '@/types/inventory.types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InventoryTableProps {
  items: InventoryItem[];
  onSale: (item: InventoryItem) => void;
  onRestock: (item: InventoryItem) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({ items, onSale, onRestock }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStockBadge = (totalPieces: number) => {
    if (totalPieces === 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (totalPieces < 50) return <Badge className="bg-yellow-500">Low Stock</Badge>;
    return <Badge variant="default" className="bg-green-500">In Stock</Badge>;
  };

 
  const getProfitMargin = (item: InventoryItem) => {
    if (item.stock_cost === 0) return 0;
    return ((item.potential_profit / item.stock_cost) * 100).toFixed(1);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className="text-center">Stock Status</TableHead>
            <TableHead className="text-center">Available</TableHead>
            <TableHead className="text-right">Piece Price</TableHead>
            <TableHead className="text-right">Stock Cost</TableHead>
            <TableHead className="text-right">Stock Value</TableHead>
            <TableHead className="text-right">Potential Profit</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='tabular-nums'>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No inventory items found
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-center">
                  {getStockBadge(item.total_pieces)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 text-sm">
                   
                    <div className="flex items-center justify-center gap-2 md:hidden">
                      <span className="font-medium">{item.packs_in_stock}p</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="font-medium">{item.pieces_in_stock}pc</span>
                    </div>
                    <Badge variant="outline" className="md:hidden text-xs">
                      {item.total_pieces} total
                    </Badge>

                   
                    <div className="hidden md:flex md:flex-col md:items-center">
                      <div className="flex items-center gap-1">
                        <Package size={14} className="text-muted-foreground" />
                        <span className="font-medium">{item.packs_in_stock}</span>
                        <span className="text-muted-foreground">packs</span>
                      </div>
                      <div className="text-muted-foreground">
                        {item.pieces_in_stock} pieces
                      </div>
                      <Badge variant="outline" className="mt-1">
                        {item.total_pieces} total
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      Buy: {formatCurrency(item.purchase_price_piece)}
                    </div>
                    <div className="font-semibold">
                      Sell: {formatCurrency(item.selling_price_piece)}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium text-orange-600">
                  {formatCurrency(item.stock_cost)}
                </TableCell>
                <TableCell className="text-right font-bold text-primary">
                  {formatCurrency(item.stock_value)}
                </TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="space-y-1 cursor-help">
                          <div className="font-bold text-green-600">
                            {formatCurrency(item.potential_profit)}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            <TrendingUp size={10} className="mr-1" />
                            {getProfitMargin(item)}%
                          </Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Profit if all stock sells</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      onClick={() => onSale(item)}
                      disabled={item.total_pieces === 0}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <ShoppingCart size={14} className="mr-1" />
                      Sell
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRestock(item)}
                    >
                      <Package size={14} className="mr-1" />
                      Restock
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};