import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Package, TrendingUp, ShoppingCart, RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Types
interface InventoryItem {
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
}

interface TodayProfit {
  total_profit: number;
}

interface ProductProfit {
  name: string;
  total_profit: number;
  total_units_sold: number;
}

interface SaleInput {
  inventoryId: number;
  saleType: 'pack' | 'piece';
  quantity: number;
}

interface SaleResponse {
  success: boolean;
  profit: number;
  message: string;
}

interface RestockInput {
  inventoryId: number;
  packsAdded?: number;
  piecesAdded?: number;
  purchasePricePack?: number;
  sellingPricePack?: number;
}

interface SaleModalState {
  open: boolean;
  item: InventoryItem | null;
}

interface RestockModalState {
  open: boolean;
  item: InventoryItem | null;
}

interface SaleFormState {
  saleType: 'pack' | 'piece';
  quantity: number;
}

interface RestockFormState {
  packsAdded: number;
  piecesAdded: number;
  purchasePricePack: string;
  sellingPricePack: string;
}

// API Configuration
const API_BASE = 'http://localhost:3000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Functions
const api = {
  getInventory: async (): Promise<InventoryItem[]> => {
    const { data } = await axiosInstance.get<InventoryItem[]>('/inventory');
    return data;
  },
  
  getTodayProfit: async (): Promise<TodayProfit> => {
    const { data } = await axiosInstance.get<TodayProfit>('/inventory/profit/today');
    return data;
  },
  
  getProfitByProduct: async (): Promise<ProductProfit[]> => {
    const { data } = await axiosInstance.get<ProductProfit[]>('/inventory/profit/products');
    return data;
  },
  
  processSale: async (saleData: SaleInput): Promise<SaleResponse> => {
    const { data } = await axiosInstance.post<SaleResponse>('/sales', saleData);
    return data;
  },
  
  restockItem: async (restockData: RestockInput): Promise<InventoryItem> => {
    const { data } = await axiosInstance.post<InventoryItem>('/inventory/restock', restockData);
    return data;
  },
};

export const InventoryManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'inventory' | 'profits'>('inventory');
  const [saleModal, setSaleModal] = useState<SaleModalState>({ open: false, item: null });
  const [restockModal, setRestockModal] = useState<RestockModalState>({ open: false, item: null });
  const [saleForm, setSaleForm] = useState<SaleFormState>({ saleType: 'piece', quantity: 1 });
  const [restockForm, setRestockForm] = useState<RestockFormState>({
    packsAdded: 0,
    piecesAdded: 0,
    purchasePricePack: '',
    sellingPricePack: '',
  });

  // Queries
  const { data: inventory = [], isLoading: inventoryLoading } = useQuery<InventoryItem[]>({
    queryKey: ['inventory'],
    queryFn: api.getInventory,
    refetchInterval: 30000,
  });

  const { data: todayProfit = { total_profit: 0 } } = useQuery<TodayProfit>({
    queryKey: ['todayProfit'],
    queryFn: api.getTodayProfit,
    refetchInterval: 10000,
  });

  const { data: productProfits = [] } = useQuery<ProductProfit[]>({
    queryKey: ['productProfits'],
    queryFn: api.getProfitByProduct,
  });

  // Mutations
  const saleMutation = useMutation<SaleResponse, Error, SaleInput>({
    mutationFn: api.processSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['todayProfit'] });
      queryClient.invalidateQueries({ queryKey: ['productProfits'] });
      setSaleModal({ open: false, item: null });
      setSaleForm({ saleType: 'piece', quantity: 1 });
    },
  });

  const restockMutation = useMutation<InventoryItem, Error, RestockInput>({
    mutationFn: api.restockItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setRestockModal({ open: false, item: null });
      setRestockForm({ packsAdded: 0, piecesAdded: 0, purchasePricePack: '', sellingPricePack: '' });
    },
  });

  const handleSale = (): void => {
    if (!saleModal.item) return;
    saleMutation.mutate({
      inventoryId: saleModal.item.id,
      saleType: saleForm.saleType,
      quantity: parseInt(saleForm.quantity.toString()),
    });
  };

  const handleRestock = (): void => {
    if (!restockModal.item) return;
    restockMutation.mutate({
      inventoryId: restockModal.item.id,
      packsAdded: parseInt(restockForm.packsAdded.toString()) || 0,
      piecesAdded: parseInt(restockForm.piecesAdded.toString()) || 0,
      purchasePricePack: restockForm.purchasePricePack ? parseFloat(restockForm.purchasePricePack) : undefined,
      sellingPricePack: restockForm.sellingPricePack ? parseFloat(restockForm.sellingPricePack) : undefined,
    });
  };

  const totalStockValue = inventory.reduce((sum, item) => sum + parseFloat(item.stock_value.toString() || '0'), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management System</h1>
          <p className="text-gray-600">Track stock, sales, and profits</p>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Stock Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{totalStockValue.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Package className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Profit</p>
                <p className="text-2xl font-bold text-green-600">
                  ₦{parseFloat(todayProfit.total_profit.toString() || '0').toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <TrendingUp className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
              </div>
              <ShoppingCart className="text-purple-500" size={32} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'inventory'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Inventory
              </button>
              <button
                onClick={() => setActiveTab('profits')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'profits'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Product Profits
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'inventory' && (
              <div className="overflow-x-auto">
                {inventoryLoading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="animate-spin mx-auto mb-4 text-gray-400" size={32} />
                    <p className="text-gray-600">Loading inventory...</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3 font-semibold text-gray-700">Product</th>
                        <th className="text-center p-3 font-semibold text-gray-700">Stock</th>
                        <th className="text-right p-3 font-semibold text-gray-700">Pack Price</th>
                        <th className="text-right p-3 font-semibold text-gray-700">Piece Price</th>
                        <th className="text-right p-3 font-semibold text-gray-700">Stock Value</th>
                        <th className="text-center p-3 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{item.name}</td>
                          <td className="p-3 text-center">
                            <div className="text-sm">
                              <div>{item.packs_in_stock} packs</div>
                              <div className="text-gray-600">{item.pieces_in_stock} pieces</div>
                              <div className="text-xs text-gray-500">
                                ({item.total_pieces} total pcs)
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            ₦{parseFloat(item.selling_price_pack?.toString() || '0').toLocaleString('en-NG')}
                          </td>
                          <td className="p-3 text-right">
                            ₦{parseFloat(item.selling_price_piece?.toString() || '0').toLocaleString('en-NG')}
                          </td>
                          <td className="p-3 text-right font-semibold">
                            ₦{parseFloat(item.stock_value?.toString() || '0').toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => setSaleModal({ open: true, item })}
                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                              >
                                Sell
                              </button>
                              <button
                                onClick={() => setRestockModal({ open: true, item })}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                              >
                                Restock
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'profits' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-semibold text-gray-700">Product</th>
                      <th className="text-right p-3 font-semibold text-gray-700">Units Sold</th>
                      <th className="text-right p-3 font-semibold text-gray-700">Total Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productProfits.map((product, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{product.name}</td>
                        <td className="p-3 text-right">{product.total_units_sold}</td>
                        <td className="p-3 text-right font-semibold text-green-600">
                          ₦{parseFloat(product.total_profit?.toString() || '0').toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sale Modal */}
      {saleModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Process Sale - {saleModal.item?.name}</h2>
            
            {saleMutation.isError && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {saleMutation.error?.message || 'Failed to process sale'}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sale Type</label>
                <select
                  value={saleForm.saleType}
                  onChange={(e) => setSaleForm({ ...saleForm, saleType: e.target.value as 'pack' | 'piece' })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="piece">Piece</option>
                  <option value="pack">Pack</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={saleForm.quantity}
                  onChange={(e) => setSaleForm({ ...saleForm, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-600">Available Stock:</p>
                <p className="font-medium">
                  {saleForm.saleType === 'pack'
                    ? `${saleModal.item?.packs_in_stock} packs`
                    : `${saleModal.item?.pieces_in_stock} pieces`}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSale}
                  disabled={saleMutation.isPending}
                  className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {saleMutation.isPending ? 'Processing...' : 'Confirm Sale'}
                </button>
                <button
                  onClick={() => {
                    setSaleModal({ open: false, item: null });
                    setSaleForm({ saleType: 'piece', quantity: 1 });
                    saleMutation.reset();
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {restockModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Restock - {restockModal.item?.name}</h2>
            
            {restockMutation.isError && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {restockMutation.error?.message || 'Failed to restock'}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Packs to Add</label>
                <input
                  type="number"
                  min="0"
                  value={restockForm.packsAdded}
                  onChange={(e) => setRestockForm({ ...restockForm, packsAdded: parseInt(e.target.value) || 0 })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Pieces to Add</label>
                <input
                  type="number"
                  min="0"
                  value={restockForm.piecesAdded}
                  onChange={(e) => setRestockForm({ ...restockForm, piecesAdded: parseInt(e.target.value) || 0 })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Purchase Price (Pack) - Optional</label>
                <input
                  type="number"
                  step="0.01"
                  value={restockForm.purchasePricePack}
                  onChange={(e) => setRestockForm({ ...restockForm, purchasePricePack: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Leave blank to keep current"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Selling Price (Pack) - Optional</label>
                <input
                  type="number"
                  step="0.01"
                  value={restockForm.sellingPricePack}
                  onChange={(e) => setRestockForm({ ...restockForm, sellingPricePack: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Leave blank to keep current"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleRestock}
                  disabled={restockMutation.isPending}
                  className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {restockMutation.isPending ? 'Restocking...' : 'Confirm Restock'}
                </button>
                <button
                  onClick={() => {
                    setRestockModal({ open: false, item: null });
                    setRestockForm({ packsAdded: 0, piecesAdded: 0, purchasePricePack: '', sellingPricePack: '' });
                    restockMutation.reset();
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

