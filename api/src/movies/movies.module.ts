// src/movies/movies.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movie, MovieSchema } from './entities/movie.entity';
import { UserModule } from '../user/user.module';
import { CloudinaryConfig } from '../common/config/cloudinary.config';
import { CloudinaryService } from '../common/services/cloudinary.service';
import { CloudinaryInterceptor } from '../common/interceptors/cloudinary.interceptor';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    ConfigModule,
    UserModule, 
  ],
  controllers: [MoviesController],
  providers: [
    MoviesService,
    CloudinaryConfig,
    CloudinaryService,
    CloudinaryInterceptor,
  ],
  exports: [MoviesService],
})
export class MoviesModule {}