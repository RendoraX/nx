export interface updateInventory{
    inventoryId : string;
    quantity : number;
    notes ?: string;
    reason ?: string;
    type ?: string;
    direction : string
}

export interface BulkInventoryUpdate {
    inventoryIds: string[];
    quantity: number;
    notes?: string;
    reason?: string;
    type?: string;
}