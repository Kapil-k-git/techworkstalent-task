// src/movies/movies.service.ts
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './entities/movie.entity';
import { CreateMovieDto, UpdateMovieDto } from './dto/movie.dto';
import { CloudinaryService } from '../common/services/cloudinary.service';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createMovie(
    createMovieDto: CreateMovieDto,
    file: Express.Multer.File & { cloudinaryUrl?: string; cloudinaryPublicId?: string },
  ): Promise<Movie> {
    try {
      // Use the Cloudinary URL from the interceptor
      const posterUrl = file.cloudinaryUrl;
      
      if (!posterUrl) {
        throw new Error('Failed to upload poster to Cloudinary');
      }

      const movie = new this.movieModel({
        ...createMovieDto,
        poster: posterUrl,
        cloudinaryPublicId: file.cloudinaryPublicId, // Store for future deletion
      });

      const savedMovie = await movie.save();
      this.logger.log(`Movie created successfully: ${savedMovie._id}`);
      
      return savedMovie;
    } catch (error) {
      this.logger.error('Error creating movie:', error);
      throw error;
    }
  }

  async getAllMovies(page: number = 1, perPage: number = 10) {
    try {
      const skip = (page - 1) * perPage;
      
      const [movies, totalMovies] = await Promise.all([
        this.movieModel
          .find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(perPage)
          .exec(),
        this.movieModel.countDocuments(),
      ]);

      const totalPages = Math.ceil(totalMovies / perPage);

      return {
        movies,
        currentPage: page,
        totalPages,
        perPage,
        totalMovies,
      };
    } catch (error) {
      this.logger.error('Error fetching movies:', error);
      throw error;
    }
  }

  async getMovieById(id: string): Promise<Movie> {
    try {
      const movie = await this.movieModel.findById(id).exec();
      if (!movie) {
        throw new NotFoundException('Movie not found');
      }
      return movie;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Error fetching movie by ID:', error);
      throw error;
    }
  }

  async updateMovie(
    id: string,
    updateMovieDto: UpdateMovieDto,
    file?: Express.Multer.File & { cloudinaryUrl?: string; cloudinaryPublicId?: string },
  ): Promise<Movie> {
    try {
      const existingMovie = await this.getMovieById(id);
      const updateData: any = { ...updateMovieDto };

      // If a new poster is uploaded
      if (file?.cloudinaryUrl) {
        // Delete old poster from Cloudinary if it exists
        if (existingMovie.cloudinaryPublicId) {
          await this.cloudinaryService.deleteImage(existingMovie.cloudinaryPublicId);
        }

        updateData.poster = file.cloudinaryUrl;
        updateData.cloudinaryPublicId = file.cloudinaryPublicId;
      }

      const updatedMovie = await this.movieModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();

      if (!updatedMovie) {
        throw new NotFoundException('Movie not found');
      }

      this.logger.log(`Movie updated successfully: ${updatedMovie._id}`);
      return updatedMovie;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Error updating movie:', error);
      throw error;
    }
  }

  async deleteMovie(id: string): Promise<void> {
    try {
      const movie = await this.getMovieById(id);
      
      // Delete poster from Cloudinary
      if (movie.cloudinaryPublicId) {
        await this.cloudinaryService.deleteImage(movie.cloudinaryPublicId);
      }

      const result = await this.movieModel.findByIdAndDelete(id).exec();
      
      if (!result) {
        throw new NotFoundException('Movie not found');
      }

      this.logger.log(`Movie deleted successfully: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Error deleting movie:', error);
      throw error;
    }
  }

  async searchMovies(query: string, page: number = 1, perPage: number = 10) {
    try {
      const skip = (page - 1) * perPage;
      
      const searchRegex = new RegExp(query, 'i');
      const searchQuery = { title: searchRegex };

      const [movies, totalMovies] = await Promise.all([
        this.movieModel
          .find(searchQuery)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(perPage)
          .exec(),
        this.movieModel.countDocuments(searchQuery),
      ]);

      const totalPages = Math.ceil(totalMovies / perPage);

      return {
        movies,
        currentPage: page,
        totalPages,
        perPage,
        totalMovies,
      };
    } catch (error) {
      this.logger.error('Error searching movies:', error);
      throw error;
    }
  }
}