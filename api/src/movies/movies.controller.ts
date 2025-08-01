import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import {
  CreateMovieDto,
  UpdateMovieDto,
  MovieResponseDto,
  MoviesListResponseDto,
  MovieCreateResponseDto,
  PaginationQueryDto,
} from './dto/movie.dto';
import { multerConfig } from '../common/config/multer.config';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('poster', multerConfig))
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'The Shawshank Redemption' },
        year: { type: 'number', example: 1994 },
        poster: {
          type: 'string',
          format: 'binary',
          description: 'Movie poster image',
        },
      },
      required: ['title', 'year', 'poster'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Movie created successfully',
    type: MovieCreateResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error or missing poster' })
  async createMovie(
    @Body() createMovieDto: CreateMovieDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Poster image is required');
    }

    const movie = await this.moviesService.createMovie(createMovieDto, file);

    return {
      message: 'Movie created successfully',
      movie,
    };
  }

  @Get('search')
  @ApiOperation({ summary: 'Search movies by title' })
  @ApiQuery({ name: 'q', description: 'Search query', example: 'shawshank' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'perPage', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Movies search results',
    type: MoviesListResponseDto,
  })
  async searchMovies(
    @Query('q') query: string,
    @Query() pagination: PaginationQueryDto,
  ) {
    const { page = 1, perPage = 10 } = pagination;
    const result = await this.moviesService.searchMovies(query, page, perPage);

    return {
      message: 'Movies search completed',
      ...result,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all movies with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'perPage', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Movies retrieved successfully',
    type: MoviesListResponseDto,
  })
  async getAllMovies(@Query() query: PaginationQueryDto) {
    const { page = 1, perPage = 10 } = query;
    const result = await this.moviesService.getAllMovies(page, perPage);

    return {
      message: 'Movies retrieved successfully',
      ...result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get movie by ID' })
  @ApiParam({ name: 'id', description: 'Movie ID' })
  @ApiResponse({
    status: 200,
    description: 'Movie retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Movie retrieved successfully' },
        movie: { $ref: '#/components/schemas/MovieResponseDto' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async getMovieById(@Param('id') id: string) {
    const movie = await this.moviesService.getMovieById(id);
    return {
      message: 'Movie retrieved successfully',
      movie,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('poster', multerConfig))
  @ApiOperation({ summary: 'Update movie by ID' })
  @ApiParam({ name: 'id', description: 'Movie ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'The Shawshank Redemption' },
        year: { type: 'number', example: 1994 },
        poster: {
          type: 'string',
          format: 'binary',
          description: 'Movie poster image (optional)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Movie updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Movie updated successfully' },
        movie: { $ref: '#/components/schemas/MovieResponseDto' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async updateMovie(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const movie = await this.moviesService.updateMovie(id, updateMovieDto, file);

    return {
      message: 'Movie updated successfully',
      movie,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete movie by ID' })
  @ApiParam({ name: 'id', description: 'Movie ID' })
  @ApiResponse({
    status: 200,
    description: 'Movie deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Movie deleted successfully' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  async deleteMovie(@Param('id') id: string) {
    await this.moviesService.deleteMovie(id);
    return {
      message: 'Movie deleted successfully',
    };
  }
}