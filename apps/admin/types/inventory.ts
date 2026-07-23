export type AdjustmentType = 
  | 'purchase' 
  | 'manual_correction' 
  | 'damaged' 
  | 'lost' 
  | 'returned' 
  | 'promotion_sample';

export type InventoryStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface InventoryItem {
  id: string;
  productId: string;
  stock: number;
  reserved: number;
  // Nested Prisma model relation mapping 
  product?: {
    id: string;
    name: string;
    sku: string;
    slug: string;
    description: string;
    price: string | number;
    comparePrice?: string | null;
    isActive: boolean;
    categoryId: string;
  };
  // Fallbacks or generated attributes from status mappings
  status?: InventoryStatus; 
  variant : any
}
export interface InventorySummary {
  totalProducts: number;
  totalHealthyCount : number;
  lowStockAlert : number;
  outOfStock: number;
  reservedUnits: number;
}

export interface StockAdjustmentPayload {
  inventoryId: string;
  type: AdjustmentType;
  quantity: number; // Positive or negative balance modifier
  reason: string;
  notes?: string;
  direction : string;
}

export interface BulkAdjustmentPayload {
  inventoryIds: string[];
  type: AdjustmentType;
  quantity: number;
  reason: string;
}


export interface InventoryHistoryLog {
  id: string;
  createdAt: string;
  productId: string;
  productName: string;
  sku: string;
  userEmail: string;
  action: AdjustmentType;
  quantity: number; // The relative delta change (+/-) applied to the stock parameter
  reason: string;
  notes?: string;
}