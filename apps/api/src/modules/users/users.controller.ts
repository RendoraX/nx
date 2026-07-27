import { Request, Response } from "express";
import { allUsers, createAddress, deleteAddress, getAddresses, summaryUser } from "./users.service";


//admin only
export const getAllUsersEndpoint = async ( _ : any , res : Response) => {
    try {
        
        const users = await allUsers();

        return res.status(200).json({
            message : "All user fetched succesfully !!",
            users
        })
    } catch (error : any) {
        return res.status(500).json({
            message : "Internal server error",
            error : error.message | error
        })
    }
};

//admin only
export const getAllUsersSummaryEndpoint = async (_ : any , res : Response) => {
    try {
        
        const summary = await summaryUser();

        return res.status(200).json({
            message : "All user fetched succesfully !!",
            summary
        })
    } catch (error : any) {
        return res.status(500).json({
            message : "Internal server error",
            error : error.message | error
        })
    }
};


//user only
export const createAddressEndpoint = async (req : Request , res : Response) => {
    try {
        const {id} : Partial<{id : string}> = (req as any).user;

        const payload = await req.body;
        
        const address = await createAddress({...payload , userId : id as string})
        return res.status(200).json({
            message : "Address added successfully !",
            success : true,
            address
        });
    } catch (error) {
        console.log((error as any).message)
        return res.status(500).json({
            message : "Internal server error.",
            success : false,
            error : (error as any).message || error
        });
    }
};

//user only 
export const getAddressesEndpoint = async (req : Request , res : Response) => {
    try {
        const userId = (req as any).user.id as string;

        const addresses = await getAddresses(userId as string);

        console.log( "Address", addresses)
        return res.status(200).json({
            message : "Address Fetched successfully !",
            success : true,
            addresses
        })
    } catch (error) {
        return res.status(500).json({
            message : "Internal server error.",
            success : false,
            error : (error as any).message || error
        });
    }
};


//User only
export const deleteAddressEndpoint = async (req : Request , res : Response) => {
    try {
        const addressId : string = req.params.id as string;

        await deleteAddress({
            id : addressId as string,
            userId : (req as any).user.id as string
        });

        return res.status(200).json({
            message : "Address deleted successfully !",
            success : true,
        });
    } catch (error) {
        return res.status(500).json({
            message : "internal server error",
            success : false,
            error : (error as any).message || error
        })
    }
}