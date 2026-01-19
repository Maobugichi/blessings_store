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
  sale_date:any
}

export interface SaleInput {
  inventoryId: number;
  saleType: 'pack' | 'piece';
  quantity: number;
}

export interface RestockInput {
  inventoryId: number;
  packsAdded?: number;
  piecesAdded?: number;
  purchasePricePack?: number;
  sellingPricePack?: number;
}