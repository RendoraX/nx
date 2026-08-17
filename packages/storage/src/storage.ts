import {v2 }  from "cloudinary"
import { env } from "../../config/src/env"

export const configCLD = () => {
    v2.config({
        cloud_name : env.CLOUDINARY_NAME,
        api_key : env.CLOUDINARY_API as string,
        api_secret : env.CLOUDINARY_SECRET,
    });


    return v2;
}