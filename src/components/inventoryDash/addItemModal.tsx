import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateInventoryItem } from '@/hooks/useInventory';
import type { CreateInventoryInput } from '@/types/inventory.types';

interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
}

const emptyForm: CreateInventoryInput = {
  name: '',
  pack_size: 0,
  packs_in_stock: 0,
  pieces_in_stock: 0,
  purchase_price_pack: null,
  purchase_price_piece: null,
  selling_price_pack: null,
  selling_price_piece: null,
  low_stock_threshold: null,
};

export const AddItemModal = ({ open, onClose }: AddItemModalProps) => {
  const [form, setForm] = useState<CreateInventoryInput>(emptyForm);
  const { mutate: createItem, isPending, reset } = useCreateInventoryItem();

  const handleChange = (field: keyof CreateInventoryInput, value: string) => {
    const numeric = [
      'pack_size', 'packs_in_stock', 'pieces_in_stock',
      'purchase_price_pack', 'purchase_price_piece',
      'selling_price_pack', 'selling_price_piece',
      'low_stock_threshold',
    ];

    setForm((prev) => ({
      ...prev,
      [field]: numeric.includes(field)
        ? value === '' ? null : Number(value)
        : value,
    }));
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.pack_size) return;

    createItem(form, {
      onSuccess: () => {
        setForm(emptyForm);
        reset();
        onClose();
      },
    });
  };

  const handleClose = () => {
    setForm(emptyForm);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="col-span-2">
            <Label>Name *</Label>
            <Input
              placeholder="e.g. Coca-Cola 50cl"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={isPending}
            />
          </div>

          <div>
            <Label>Pack Size *</Label>
            <Input
              type="number"
              placeholder="e.g. 24"
              value={form.pack_size || ''}
              onChange={(e) => handleChange('pack_size', e.target.value)}
              disabled={isPending}
            />
          </div>

          <div>
            <Label>Low Stock Threshold</Label>
            <Input
              type="number"
              placeholder="e.g. 5"
              value={form.low_stock_threshold ?? ''}
              onChange={(e) => handleChange('low_stock_threshold', e.target.value)}
              disabled={isPending}
            />
          </div>

          <div>
            <Label>Packs in Stock</Label>
            <Input
              type="number"
              placeholder="0"
              value={form.packs_in_stock || ''}
              onChange={(e) => handleChange('packs_in_stock', e.target.value)}
              disabled={isPending}
            />
          </div>

          <div>
            <Label>Pieces in Stock</Label>
            <Input
              type="number"
              placeholder="0"
              value={form.pieces_in_stock || ''}
              onChange={(e) => handleChange('pieces_in_stock', e.target.value)}
              disabled={isPending}
            />
          </div>

          <div>
            <Label>Purchase Price (Pack)</Label>
            <Input
              type="number"
              placeholder="₦0"
              value={form.purchase_price_pack ?? ''}
              onChange={(e) => handleChange('purchase_price_pack', e.target.value)}
              disabled={isPending}
            />
          </div>

          <div>
            <Label>Purchase Price (Piece)</Label>
            <Input
              type="number"
              placeholder="Auto-derived"
              value={form.purchase_price_piece ?? ''}
              onChange={(e) => handleChange('purchase_price_piece', e.target.value)}
              disabled={isPending}
            />
          </div>

          <div>
            <Label>Selling Price (Pack)</Label>
            <Input
              type="number"
              placeholder="₦0"
              value={form.selling_price_pack ?? ''}
              onChange={(e) => handleChange('selling_price_pack', e.target.value)}
              disabled={isPending}
            />
          </div>

          <div>
            <Label>Selling Price (Piece)</Label>
            <Input
              type="number"
              placeholder="Auto-derived"
              value={form.selling_price_piece ?? ''}
              onChange={(e) => handleChange('selling_price_piece', e.target.value)}
              disabled={isPending}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !form.name.trim() || !form.pack_size}
          >
            {isPending ? 'Adding...' : 'Add Item'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};