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

  async createMovie(createMovieDto: CreateMovieDto, posterPath: string): Promise<MovieDocument> {
    try {
      const movieData = {
        ...createMovieDto,
        year: createMovieDto.year.toString(),
        poster: posterPath,
      };

      const newMovie = await this.movieModel.create(movieData);
      
      // Clear movies list cache when new movie is created
      await this.cacheManager.del('movies:all');
      
      return newMovie;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Movie with this title already exists');
      }
      throw error;
    }
  }

  async getMovieById(id: string): Promise<MovieDocument> {
    // Try cache first
    const cacheKey = `movie:${id}`;
    const cachedMovie = await this.cacheManager.get<MovieDocument>(cacheKey);
    
    if (cachedMovie) {
      return cachedMovie;
    }

    const movie = await this.movieModel.findById(id);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    // Cache the result for 5 minutes
    await this.cacheManager.set(cacheKey, movie, 300);
    
    return movie;
  }

  async getAllMovies(page: number = 1, perPage: number = 10) {
    const cacheKey = `movies:all:${page}:${perPage}`;
    const cachedResult = await this.cacheManager.get(cacheKey);
    
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

    // Cache for 2 minutes (shorter than individual movies)
    await this.cacheManager.set(cacheKey, result, 120);

    return result;
  }

  async updateMovie(id: string, updateMovieDto: UpdateMovieDto, posterPath?: string): Promise<MovieDocument> {
    const updateData: any = { ...updateMovieDto };
    
    if (updateMovieDto.year) {
      updateData.year = updateMovieDto.year.toString();
    }
    
    if (posterPath) {
      updateData.poster = posterPath;
    }

    const updatedMovie = await this.movieModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedMovie) {
      throw new NotFoundException('Movie not found');
    }

    // Clear related cache entries
    await this.cacheManager.del(`movie:${id}`);
    await this.cacheManager.del('movies:all');

    return updatedMovie;
  }

  async deleteMovie(id: string): Promise<void> {
    const deletedMovie = await this.movieModel.findByIdAndDelete(id);
    if (!deletedMovie) {
      throw new NotFoundException('Movie not found');
    }

    // Clear related cache entries
    await this.cacheManager.del(`movie:${id}`);
    await this.cacheManager.del('movies:all');
  }

  // Search movies with caching
  async searchMovies(query: string, page: number = 1, perPage: number = 10) {
    const cacheKey = `search:${query}:${page}:${perPage}`;
    const cachedResult = await this.cacheManager.get(cacheKey);
    
    if (cachedResult) {
      return cachedResult;
    }

    const skip = (page - 1) * perPage;
    
    // Use text search for better performance
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

    // Cache search results for 5 minutes
    await this.cacheManager.set(cacheKey, result, 300);

    return result;
  }
}
