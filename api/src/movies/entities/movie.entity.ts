import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true }) // Remove unique: true to avoid duplication
  title: string;

  @Prop({ required: true })
  year: string;

  @Prop({ required: true })
  poster: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);

// Comprehensive unique index for title (handles uniqueness + search)
MovieSchema.index({ title: 1 }, { unique: true });

// Text index for full-text search functionality
MovieSchema.index({ title: 'text' });

// Compound index for title and year searches  
MovieSchema.index({ title: 1, year: 1 });

MovieSchema.index({ createdAt: -1 });