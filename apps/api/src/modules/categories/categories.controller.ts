import { Request, Response } from "express";
import { createCat, deleteCat, getAllCategory, updateCat } from "./categories.service";


//completed , test = 0
export const categoryAddEndpoint  = async (req : Request , res : Response) => {
    try {
        
        const payload = await req.body;

        await createCat(payload);

        return res.status(200).json({
            message : "Category added !",
            category_name : payload.name as string,
            category_slug : payload.slug as string
        });
    } catch (error : any) {
        return res.status(500).json({
            message : "Internal server erro !",
            error : (error as any).message | error
        });
    }
};

//completed , test = 0
export const categoryDeleteEndpoint = async (req : Request , res : Response) => {
    try {
          const payload = await req.body;

          await deleteCat(payload);

          return res.status(200).json({
            message :"Category deleted !"
          })
    } catch (error : any) {
        return res.status(500).json({
            message : "Internal server error",
            error : error.message | error
        });
    }
};

//completed , test = 0
export const allCategoryEndpoint = async (req : Request ,res : Response) => {
    try {
        const categories = await getAllCategory();

        return res.status(200).json({
            message : "Category fetched successfully !",
            categories
        });
    } catch (error : any) {
        return res.status(500).json({
            message : "Internal server error !",
            error : error.message | error
        });
    };
};

//completed , test = 0
export const categoryUpdateEndpoint = async (req : Request , res : Response) => {
    try {
        const payload = await req.body;

        await updateCat(payload);


        return res.status(200).json({
            message : "Category updated !"
        });
    } catch (error : any) {
        return res.status(500).json({
            message : "Internal server error !",
            error : error.message | error
        })
    }
};

