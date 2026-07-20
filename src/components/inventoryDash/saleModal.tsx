import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import type { InventoryItem, SaleInput } from '@/types/inventory.types';

type SaleType = 'pack' | 'piece' | 'half_pack';

interface SaleModalProps {
  open: boolean;
  item: InventoryItem | null;
  onClose: () => void;
  onSubmit: (data: SaleInput) => void;
  isLoading: boolean;
  error: Error | null;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(n);

// Local calendar date as "YYYY-MM-DD", using local Date getters — NOT
// toISOString(), which converts to UTC and can shift the date by a day
// depending on the user's timezone offset. See dateFormatter.ts for the
// same pattern used on the display side.
const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const SaleModal: React.FC<SaleModalProps> = ({
  open, item, onClose, onSubmit, isLoading, error,
}) => {
  const today = getTodayDateString();

  const [saleType, setSaleType] = useState<SaleType>('piece');
  const [quantity, setQuantity] = useState(1);
  const [saleDate, setSaleDate] = useState(today);
  const [showOverride, setShowOverride] = useState(false);
  const [overridePrice, setOverridePrice] = useState('');

  const resolvePrice = (): number => {
    if (!item) return 0;
    if (saleType === 'pack')      return item.selling_price_pack ?? 0;
    if (saleType === 'half_pack') return (item.selling_price_pack ?? 0) / 2;
    return item.selling_price_piece ?? 0;
  };

  const resolveMax = (): number => {
    if (!item) return 0;
    // half_pack availability is gated on packs_in_stock, same as pack
    if (saleType === 'pack' || saleType === 'half_pack') return item.packs_in_stock ?? 0;
    return item.pieces_in_stock ?? 0;
  };

  const resolveLabel = (): string => {
    if (saleType === 'pack')      return 'pack';
    if (saleType === 'half_pack') return 'half pack';
    return 'piece';
  };

  const price      = resolvePrice();
  const maxQty     = resolveMax();
  const normalTotal = price * quantity;
  // overridePrice is what the customer actually paid in total (e.g. 900
  // for 2 units) — not a per-unit price the cashier would have to
  // calculate themselves.
  const totalPrice = showOverride && overridePrice !== '' ? Number(overridePrice) : normalTotal;
  const effectivePrice = quantity > 0 ? totalPrice / quantity : 0;

  const isBackdated = saleDate !== today;
  const overrideValid = !showOverride || (overridePrice !== '' && Number(overridePrice) > 0);
  const canSubmit = quantity >= 1 && quantity <= maxQty && overrideValid;

  const resetExtras = () => {
    setSaleDate(today);
    setShowOverride(false);
    setOverridePrice('');
  };

  const handleClose = () => {
    resetExtras();
    onClose();
  };

  const handleSubmit = () => {
    if (!item || !canSubmit) return;

    const data: SaleInput = {
      inventoryId: item.id,
      saleType,
      quantity,
      // Only send saleDate when actually backdated — an untouched picker
      // stays on today's date and the sale is submitted as real-time,
      // same as before this feature existed.
      ...(isBackdated ? { saleDate } : {}),
      ...(showOverride && overridePrice !== ''
        ? { overrideTotalPrice: Number(overridePrice) }
        : {}),
    };

    onSubmit(data);
  };

  const handleTypeChange = (v: string) => {
    setSaleType(v as SaleType);
    setQuantity(1);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      setQuantity(0);
      return;
    }
    const parsed = parseInt(raw, 10);
    setQuantity(Number.isNaN(parsed) ? 0 : parsed);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
            <Select value={saleType} onValueChange={handleTypeChange}>
              <SelectTrigger id="sale-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="piece">Piece</SelectItem>
                <SelectItem value="pack">Pack</SelectItem>
                <SelectItem value="half_pack">Half Pack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={maxQty}
              value={quantity === 0 ? '' : quantity}
              onChange={handleQuantityChange}
            />
            <p className="text-sm text-muted-foreground">
              Available: {maxQty} {resolveLabel()}s
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sale-date">Sale Date</Label>
            <Input
              id="sale-date"
              type="date"
              max={today}
              value={saleDate}
              onChange={(e) => setSaleDate(e.target.value)}
            />
            {isBackdated && (
              <p className="text-sm text-yellow-600">
                Backdating this sale to {saleDate}.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setShowOverride((v) => !v);
                setOverridePrice('');
              }}
              className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              {showOverride ? 'Remove price override' : 'Adjust total price for this sale?'}
            </button>

            {showOverride && (
              <div className="space-y-1">
                <Label htmlFor="override-price">
                  Total price for this sale
                </Label>
                <Input
                  id="override-price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={String(normalTotal)}
                  value={overridePrice}
                  onChange={(e) => setOverridePrice(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Normal total: {fmt(normalTotal)}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Price per {resolveLabel()}:</span>
              <span className="font-medium">{fmt(effectivePrice)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-green-600">{fmt(totalPrice)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !canSubmit}
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