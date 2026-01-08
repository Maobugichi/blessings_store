import type { InventoryItem, RestockInput } from "@/types/inventory.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';
import { useState } from "react";


interface RestockModalProps {
  open: boolean;
  item: InventoryItem | null;
  onClose: () => void;
  onSubmit: (data: RestockInput) => void;
  isLoading: boolean;
  error: Error | null;
}

export const RestockModal: React.FC<RestockModalProps> = ({
  open,
  item,
  onClose,
  onSubmit,
  isLoading,
  error,
}) => {
  const [packsAdded, setPacksAdded] = useState(0);
  const [piecesAdded, setPiecesAdded] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');

  const handleSubmit = () => {
    if (!item) return;
    onSubmit({
      inventoryId: item.id,
      packsAdded: packsAdded || undefined,
      piecesAdded: piecesAdded || undefined,
      purchasePricePack: purchasePrice ? parseFloat(purchasePrice) : undefined,
      sellingPricePack: sellingPrice ? parseFloat(sellingPrice) : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Restock Inventory</DialogTitle>
          <DialogDescription>
            Restocking: <span className="font-semibold text-foreground">{item?.name}</span>
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error.message || 'Failed to restock'}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="packs">Packs to Add</Label>
              <Input
                id="packs"
                type="number"
                min="0"
                value={packsAdded}
                onChange={(e) => setPacksAdded(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pieces">Pieces to Add</Label>
              <Input
                id="pieces"
                type="number"
                min="0"
                value={piecesAdded}
                onChange={(e) => setPiecesAdded(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchase-price">Purchase Price (Pack) - Optional</Label>
            <Input
              id="purchase-price"
              type="number"
              step="0.01"
              placeholder={`Current: ₦${item?.purchase_price_pack || 0}`}
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="selling-price">Selling Price (Pack) - Optional</Label>
            <Input
              id="selling-price"
              type="number"
              step="0.01"
              placeholder={`Current: ₦${item?.selling_price_pack || 0}`}
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
            />
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium mb-2">Current Stock:</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Packs:</span>
                <span className="ml-2 font-medium">{item?.packs_in_stock}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Pieces:</span>
                <span className="ml-2 font-medium">{item?.pieces_in_stock}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Restock
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
