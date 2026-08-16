import {Request , Response} from 'express'

export const createCustomKitOrderEndpoint = async (req : Request , res : Response) => {
    try {
        const payload = await req.body;

        console.log("Payload for the kit : " , payload)
        return res.status(200).json({
            message : "Order created !",
            success : true
        })
    } catch (error) {
        return res.status(400).json({
            message : (error as any).message || "Error while creating the order",
            status : false
        })
    }
}