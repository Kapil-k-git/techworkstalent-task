import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Movie, MovieDocument } from './entities/movie.entity';
import { CreateMovieDto, UpdateMovieDto } from './dto/movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createMovie(createMovieDto: CreateMovieDto, file: Express.Multer.File): Promise<MovieDocument> {
    try {
      // For serverless, we'll store the file as base64 or use cloud storage
      // For now, let's store as base64 in the database
      const posterPath = file ? `data:${file.mimetype};base64,${file.buffer.toString('base64')}` : '/placeholder.jpg';
      
      const movieData = {
        ...createMovieDto,
        year: createMovieDto.year.toString(),
        poster: posterPath,
      };

      const newMovie = await this.movieModel.create(movieData);
      
      await this.cacheManager.del('movies:all');
      
      return newMovie;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('Movie with this title already exists');
      }
      throw error;
    }
  }

  async getMovieById(id: string): Promise<MovieDocument> {
    const cacheKey = `movie:${id}`;
    const cachedMovie = await this.cacheManager.get<MovieDocument>(cacheKey);
    
    if (cachedMovie) {
      return cachedMovie;
    }

    const movie = await this.movieModel.findById(id);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    await this.cacheManager.set(cacheKey, movie, 300);
    
    return movie;
  }

  async getAllMovies(page: number = 1, perPage: number = 10) {
    const cacheKey = `movies:all:${page}:${perPage}`;
    const cachedResult = await this.cacheManager.get(cacheKey) as any;
    
    if (cachedResult) {
      return cachedResult;
    }

    const skip = (page - 1) * perPage;
    
    const [movies, totalMovies] = await Promise.all([
      this.movieModel.find().skip(skip).limit(perPage).sort({ createdAt: -1 }).exec(),
      this.movieModel.countDocuments().exec(),
    ]);

    const result = {
      movies,
      totalMovies,
      currentPage: page,
      totalPages: Math.ceil(totalMovies / perPage),
      perPage,
    };

    await this.cacheManager.set(cacheKey, result, 120);

    return result;
  }

  async updateMovie(id: string, updateMovieDto: UpdateMovieDto, file?: Express.Multer.File): Promise<MovieDocument> {
    const updateData: any = { ...updateMovieDto };
    
    if (updateMovieDto.year) {
      updateData.year = updateMovieDto.year.toString();
    }
    
    if (file) {
      updateData.poster = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    }

    const updatedMovie = await this.movieModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedMovie) {
      throw new NotFoundException('Movie not found');
    }

    await this.cacheManager.del(`movie:${id}`);
    await this.cacheManager.del('movies:all');

    return updatedMovie;
  }

  async deleteMovie(id: string): Promise<void> {
    const deletedMovie = await this.movieModel.findByIdAndDelete(id);
    if (!deletedMovie) {
      throw new NotFoundException('Movie not found');
    }

    await this.cacheManager.del(`movie:${id}`);
    await this.cacheManager.del('movies:all');
  }

  async searchMovies(query: string, page: number = 1, perPage: number = 10) {
    const cacheKey = `search:${query}:${page}:${perPage}`;
    const cachedResult = await this.cacheManager.get(cacheKey) as any;
    
    if (cachedResult) {
      return cachedResult;
    }

    const skip = (page - 1) * perPage;
    
    const [movies, totalMovies] = await Promise.all([
      this.movieModel
        .find({ $text: { $search: query } })
        .skip(skip)
        .limit(perPage)
        .exec(),
      this.movieModel.countDocuments({ $text: { $search: query } }).exec(),
    ]);

    const result = {
      movies,
      totalMovies,
      currentPage: page,
      totalPages: Math.ceil(totalMovies / perPage),
      perPage,
      query,
    };

    await this.cacheManager.set(cacheKey, result, 300);

    return result;
  }
}