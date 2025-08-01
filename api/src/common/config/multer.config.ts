import { memoryStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';

export const multerConfig = {
  storage: memoryStorage(), // Use memory storage instead of disk storage
  fileFilter: (req: any, file: any, callback: any) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(
        new BadRequestException('Only image files are allowed!'),
        false,
      );
    }
    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};