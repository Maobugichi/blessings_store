import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import type { InventoryItem, SaleInput } from '@/types/inventory.types';

interface SaleModalProps {
  open: boolean;
  item: InventoryItem | null;
  onClose: () => void;
  onSubmit: (data: SaleInput) => void;
  isLoading: boolean;
  error: Error | null;
}

export const SaleModal: React.FC<SaleModalProps> = ({
  open,
  item,
  onClose,
  onSubmit,
  isLoading,
  error,
}) => {
  const [saleType, setSaleType] = useState<'pack' | 'piece'>('piece');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = () => {
    if (!item) return;
    onSubmit({
      inventoryId: item.id,
      saleType,
      quantity,
    });
  };

  const maxQuantity = saleType === 'pack' ? item?.packs_in_stock : item?.pieces_in_stock;
  const price = saleType === 'pack' ? item?.selling_price_pack : item?.selling_price_piece;
  const totalPrice = (price || 0) * quantity;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Process Sale</DialogTitle>
          <DialogDescription>
            Selling: <span className="font-semibold text-foreground">{item?.name}</span>
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error.message || 'Failed to process sale'}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="sale-type">Sale Type</Label>
            <Select value={saleType} onValueChange={(v) => setSaleType(v as 'pack' | 'piece')}>
              <SelectTrigger id="sale-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="piece">Piece</SelectItem>
                <SelectItem value="pack">Pack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={maxQuantity}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
            <p className="text-sm text-muted-foreground">
              Available: {maxQuantity} {saleType}s
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Price per {saleType}:</span>
              <span className="font-medium">
                {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price || 0)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-green-600">
                {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(totalPrice)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || quantity > (maxQuantity || 0)}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Sale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};