import { configCLD } from "./storage"
import streamifier from 'streamifier'

export interface imagePayload {
    imageURL : string,
    cat : string,
    name : string;
};


export async function imageUrlHandler(payload : imagePayload) {
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
};


export async function uploadBufferToCloudinary(payload: Buffer | Uint8Array): Promise<any> {
    const buffer = Buffer.isBuffer(payload) ? payload : Buffer.from(payload);

    return new Promise((resolve, reject) => {
        const uploadStream = configCLD().uploader.upload_stream(
            { folder: "products" },
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
}