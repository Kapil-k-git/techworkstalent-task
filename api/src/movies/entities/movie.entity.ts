import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true, unique: true, index: true }) // Index for unique constraint and searches
  title: string;

  @Prop({ required: true, index: true }) // Index for year-based filtering
  year: string;

  @Prop({ required: true })
  poster: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);

// Text index for search functionality
MovieSchema.index({ title: 'text' });

// Compound index for title and year searches
MovieSchema.index({ title: 1, year: 1 });

// Index for sorting by creation date (newest first)
MovieSchema.index({ createdAt: -1 });