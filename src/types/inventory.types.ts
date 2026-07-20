export interface InventoryItem {
  id: number;
  name: string;
  pack_size: number;
  packs_in_stock: number;
  pieces_in_stock: number;
  selling_price_pack: number;
  selling_price_piece: number;
  purchase_price_pack: number;
  purchase_price_piece: number;
  total_pieces: number;


  stock_value: number;
  stock_cost: number;
  potential_profit: number;
}

export interface TodayProfit {
  total_profit: number;
}

export interface ProductProfit {
  name: string;
  total_profit: number;
  total_units_sold: number;
  sale_date: string;
}

export interface SaleInput {
  inventoryId: number;
  saleType: 'pack' | 'piece' | 'half_pack';
  quantity: number;
  // Plain "YYYY-MM-DD". Only send this when backdating — omit it for a
  // normal real-time sale so the backend uses NOW() as before.
  saleDate?: string;
  // Total price for the WHOLE line item (e.g. 900 for 2 units), not a
  // per-unit price. Does not change the item's configured selling price.
  overrideTotalPrice?: number;
}

export interface RestockInput {
  inventoryId: number;
  packsAdded?: number;
  piecesAdded?: number;
  purchasePricePack?: number;
  sellingPricePack?: number;
}

export interface CreateInventoryInput {
  name: string;
  pack_size: number;
  packs_in_stock: number;
  pieces_in_stock: number;
  purchase_price_pack?: number | null;
  purchase_price_piece?: number | null;
  selling_price_pack?: number | null;
  selling_price_piece?: number | null;
  low_stock_threshold?: number | null;
}


export interface DamageInput {
  inventoryId: number;
  damageType: 'piece' | 'pack_open';
  quantity: number;
  reason?: 'leakage' | 'expired' | 'breakage' | 'theft' | 'other';
}

export interface DamageResult {
  success: boolean;
  lossValue: number;
  message: string;
}

export interface MergedWeeklyRow {
  week_start: string;
  week_end: string;
  name: string;
  total_profit: number;
  total_units_sold: number;
  total_loss: number;
  total_units_damaged: number;
  net_profit: number;
}

export interface ProfitSummary {
  total_sales_profit: number;
  total_damage_loss: number;
  net_profit: number;
}

export interface WeeklyDamage {
  week_start: string;
  week_end: string;
  name: string;
  total_loss: number;
  total_units_damaged: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface WeeklyProductProfit {
  week_start: string;
  week_end: string;
  name: string;
  total_profit: number;
  total_units_sold: number;
}