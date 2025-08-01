// src/common/services/cloudinary.service.ts
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { CloudinaryConfig } from '../config/cloudinary.config';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private cloudinaryConfig: CloudinaryConfig) {}

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'movies',
  ): Promise<UploadApiResponse> {
    try {
      // Validate file type
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        throw new BadRequestException('Only image files are allowed!');
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new BadRequestException('File size must be less than 5MB');
      }

      const cloudinary = this.cloudinaryConfig.getCloudinary();

      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: 'image',
              folder: folder,
              format: 'webp', // Convert to WebP for better compression
              quality: 'auto:good',
              width: 800,
              height: 1200,
              crop: 'limit', // Don't upscale, only downscale if larger
              flags: 'progressive',
            },
            (error: UploadApiErrorResponse, result: UploadApiResponse) => {
              if (error) {
                this.logger.error('Cloudinary upload error:', error);
                reject(new BadRequestException('Failed to upload image'));
              } else {
                this.logger.log(`Image uploaded successfully: ${result.public_id}`);
                resolve(result);
              }
            },
          )
          .end(file.buffer);
      });
    } catch (error) {
      this.logger.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      const cloudinary = this.cloudinaryConfig.getCloudinary();
      const result = await cloudinary.uploader.destroy(publicId);
      
      if (result.result === 'ok') {
        this.logger.log(`Image deleted successfully: ${publicId}`);
      } else {
        this.logger.warn(`Failed to delete image: ${publicId}`, result);
      }
    } catch (error) {
      this.logger.error('Error deleting from Cloudinary:', error);
      // Don't throw error for deletion failures to avoid blocking the main operation
    }
  }

  // Extract public ID from Cloudinary URL
  extractPublicId(cloudinaryUrl: string): string {
    try {
      const parts = cloudinaryUrl.split('/');
      const filename = parts[parts.length - 1];
      return filename.split('.')[0]; // Remove file extension
    } catch (error) {
      this.logger.error('Error extracting public ID:', error);
      return '';
    }
  }

  // Get optimized URL with transformations
  getOptimizedUrl(publicId: string, width?: number, height?: number): string {
    const cloudinary = this.cloudinaryConfig.getCloudinary();
    
    return cloudinary.url(publicId, {
      format: 'webp',
      quality: 'auto:good',
      width: width || 400,
      height: height || 600,
      crop: 'fill',
      gravity: 'auto',
      fetch_format: 'auto',
    });
  }
}