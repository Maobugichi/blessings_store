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
import type { InventoryItem, DamageInput } from '@/types/inventory.types';

type DamageType = 'piece' | 'pack_open';
type DamageReason = 'leakage' | 'expired' | 'breakage' | 'theft' | 'other';

interface DamageModalProps {
  open: boolean;
  item: InventoryItem | null;
  onClose: () => void;
  onSubmit: (data: DamageInput) => void;
  isLoading: boolean;
  error: Error | null;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(n);

export const DamageModal: React.FC<DamageModalProps> = ({
  open, item, onClose, onSubmit, isLoading, error,
}) => {
  const [damageType, setDamageType] = useState<DamageType>('piece');
  const [reason, setReason] = useState<DamageReason>('leakage');
  const [quantity, setQuantity] = useState(1);

  const packSize = item?.pack_size ?? 0;

  const costPerPiece = item?.purchase_price_piece ?? 0;

  const maxQty = damageType === 'pack_open' ? packSize : (item?.pieces_in_stock ?? 0);
  const goodPiecesReturned = damageType === 'pack_open' ? Math.max(packSize - quantity, 0) : 0;
  const totalLoss = costPerPiece * quantity;

  const canOpenPack = (item?.packs_in_stock ?? 0) >= 1;

  const handleSubmit = () => {
    if (!item) return;
    onSubmit({ inventoryId: item.id, damageType, quantity, reason });
  };

  const handleTypeChange = (v: string) => {
    setDamageType(v as DamageType);
    setQuantity(1);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record Damage</DialogTitle>
          <DialogDescription>
            Item: <span className="font-semibold text-foreground">{item?.name}</span>
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error.message || 'Failed to record damage'}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="damage-type">Damage Type</Label>
            <Select value={damageType} onValueChange={handleTypeChange}>
              <SelectTrigger id="damage-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="piece">Loose piece damaged</SelectItem>
                <SelectItem value="pack_open" disabled={!canOpenPack}>
                  Open pack (found leakage/damage inside)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Select value={reason} onValueChange={(v) => setReason(v as DamageReason)}>
              <SelectTrigger id="reason">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leakage">Leakage</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="breakage">Breakage</SelectItem>
                <SelectItem value="theft">Theft</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">
              {damageType === 'pack_open' ? 'Damaged pieces inside the pack' : 'Quantity'}
            </Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              max={maxQty}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            />
            <p className="text-sm text-muted-foreground">
              {damageType === 'pack_open'
                ? `Pack size: ${packSize} pieces`
                : `Available: ${maxQty} pieces`}
            </p>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            {damageType === 'pack_open' && (
              <div className="flex justify-between text-sm">
                <span>Good pieces returned to stock:</span>
                <span className="font-medium text-green-600">{goodPiecesReturned}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>Cost per piece:</span>
              <span className="font-medium">{fmt(costPerPiece)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total Loss:</span>
              <span className="text-red-600">{fmt(totalLoss)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              quantity < 0 ||
              quantity > maxQty ||
              (damageType === 'pack_open' && !canOpenPack)
            }
            variant="destructive"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Damage
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};