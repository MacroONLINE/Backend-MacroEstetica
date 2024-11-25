import { UploadApiResponse } from 'cloudinary';
export declare class CloudinaryService {
    private readonly cloudinary;
    constructor(cloudinary: any);
    uploadImage(file: Express.Multer.File): Promise<UploadApiResponse>;
}
