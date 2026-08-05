import {Request , Response} from 'express'
import { createPoojaKit, deletePoojaKit, getAllKits, updatePoojaKit } from './admin.service';

export const createCustomPoojaKitEndpoint = async (req : Request , res : Response) => {
    try {
        const payload = await req.body

        const createdKit = await createPoojaKit(payload)

        console.log(createdKit)
        return res.status(201).json({
            message : "Custom Pooja kit created !",
            success : true,
            record : createdKit
        });
    } catch (error) {
        return res.status(500).json({
            message : "Interal server error !!",
            success : false,
            error : (error as any).message || error
        })
    }
};

//admin use only
export const getAllCustomkitEndpoint = async (req : Request , res : Response) => {
    try {
        const kits = await getAllKits();

        console.log("===========================custom kits =========================\n",kits)
        return res.status(200).json({
            message : "All custom kits fetched successfully !",
            kits,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : "Internal server error",
            error : (error as any).message || error,
            success : false
        })
    }
};

export const updatePoojaKitEndpoint = async (req : Request , res : Response) => {
    try {
        const payload = await req.body;
        const id : string = req.params.id as string

        const record = await updatePoojaKit(payload , id);
        return res.status(200).json({
            message : "Pooja kit updated successfully !",
            success : true,
            poojaKitId : payload.id || "null",
            record 
        })
        
    } catch (error) {
        return res.status(500).json({
            message : "Internal server error !",
            error : (error as any).message || error,
            success : false
        })
    }
}


//admin use only
export const deletePoojaKitEndpoint = async (req : Request , res : Response) => {
    try {
        const templateId =  req.params.id as string;
        await deletePoojaKit(templateId as string)
        return res.status(200).json({
            message : "All custom kits fetched successfully !",
            templateId,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            message : "Internal server error",
            error : (error as any).message || error,
            success : false
        })
    }
};