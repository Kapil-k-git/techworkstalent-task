import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, Min, Max, IsOptional, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMovieDto {
  @ApiProperty({ example: 'The Shawshank Redemption', description: 'Movie title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 1994, description: 'Release year' })
  @IsNumber()
  @Min(1800)
  @Max(new Date().getFullYear())
  @Transform(({ value }) => parseInt(value))
  year: number;
}

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @ApiPropertyOptional({ example: 'The Shawshank Redemption', description: 'Movie title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 1994, description: 'Release year' })
  @IsNumber()
  @Min(1800)
  @Max(new Date().getFullYear())
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  year?: number;
}

export class MovieResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  year: number;

  @ApiProperty()
  poster: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class MoviesListResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: [MovieResponseDto] })
  movies: MovieResponseDto[];

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  perPage: number;

  @ApiProperty()
  totalMovies: number;
}

export class MovieCreateResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: MovieResponseDto })
  movie: MovieResponseDto;
}

export class PaginationQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Items per page' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  perPage?: number = 10;
}