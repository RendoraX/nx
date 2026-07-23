import { Request, Response } from "express";
import { bulkUpdateInventory, getAllInventory, getInventory, getInventorySummarySer, inventoryHistory, updateInventory } from "./inventory.service";
import { bulkInventoryUpdateSchema, inventoryUpdateSchema } from "./inventory.schema";



export const getAllInventoryEndpoint = async (req : Request , res : Response) =>{
    try {
        const inventory = await getAllInventory();
        return res.status(200).json({
            message : "Inventory fetched successfully !",
            inventory
        });
    } catch (error : any) {
        return res.status(500).json({
            message : "Internal server error !",
            error : error.message | error
        })
    }
};

export const getInventorySummaryEndpoint = async (req : Request , res : Response) =>{
    try {
        const summary = await getInventorySummarySer();
        return res.status(200).json({
            message : "Inventory Summary fetched successfully !",
            summary
        });
    } catch (error : any) {
        return res.status(500).json({
            message : "Internal server error !",
            error : error.message | error
        })
    }
};

export const updateInventoryEndpoint = async (req : Request , res : Response)=>{
    try {
        console.log(await req.body)
        const payload = inventoryUpdateSchema.parse(await req.body)
        const inventory = await updateInventory(payload)
        return res.status(200).json({
            message : "inventory updated successfully !!",
            inventory,
            inventoryId : payload.inventoryId
        })
    } catch (error : any) {
        console.log(error.message)
        return res.status(500).json({
            message : "Internal server error !!",
            error : error.message | error
        })
    }
};

export const getInventoryHistoryEndpoint = async (req : Request , res : Response) => {
    try {
        
        const invHistory = await inventoryHistory();

        return res.status(200).json({
            message : "History fetched successfully !",
            invHistory
        })
    } catch (error : any) {
        return res.status(500).json({
            message : "Internal Server Error ",
            error : error.message | error
        });
    }
}

export const bulkUpdateInventoryEndpoint = async (req: Request, res: Response) => {
    try {
        const payload = bulkInventoryUpdateSchema.parse(req.body);
        const result = await bulkUpdateInventory(payload);

        return res.status(200).json({
            message: "Batch inventory update completed successfully",
            ...result,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message || error,
        });
    }
};