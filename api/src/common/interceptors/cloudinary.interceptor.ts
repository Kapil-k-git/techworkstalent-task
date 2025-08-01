// src/common/interceptors/cloudinary.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { CloudinaryService } from '../services/cloudinary.service';
  
  @Injectable()
  export class CloudinaryInterceptor implements NestInterceptor {
    constructor(private cloudinaryService: CloudinaryService) {}
  
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();
      const file = request.file;
  
      if (file) {
        try {
          // Upload to Cloudinary
          const uploadResult = await this.cloudinaryService.uploadImage(file, 'movies');
          
          // Add Cloudinary URL and public_id to the file object
          file.cloudinaryUrl = uploadResult.secure_url;
          file.cloudinaryPublicId = uploadResult.public_id;
          
          // Optional: Add other Cloudinary metadata
          file.cloudinaryMetadata = {
            width: uploadResult.width,
            height: uploadResult.height,
            format: uploadResult.format,
            bytes: uploadResult.bytes,
          };
        } catch (error) {
          throw new BadRequestException('Failed to upload image to Cloudinary');
        }
      }
  
      return next.handle();
    }
  }