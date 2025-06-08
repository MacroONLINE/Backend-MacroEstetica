import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('Cloudinary') private readonly cloudinary) {}

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'uploads' }, // Cambia "uploads" al nombre de tu carpeta si necesitas otra
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadVideo(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'videos', resource_type: 'video' },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (result) resolve(result)
          else reject(error)
        },
      )
      streamifier.createReadStream(file.buffer).pipe(uploadStream)
    })
  }
  
}
