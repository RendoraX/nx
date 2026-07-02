import { configCLD } from "./storage"

export interface imagePayload {
    imageURL : string,
    cat : string,
    name : string;
};


export async function imageHandler(payload : imagePayload) {
    const {public_id , secure_url } = await configCLD().uploader.upload(
        payload.imageURL,
        {
            folder : `admin/category/${payload.cat}`,
            public_id : payload.name as string,
            overwrite : true,
            resource_type : "image",
            format : "auto",
            use_filename : true,
            unique_filename  : true
        }
    );


    return {
        public_id , secure_url
    };
}