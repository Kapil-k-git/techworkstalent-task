import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true, unique: true, index: true })
  title: string;

  @Prop({ required: true, index: true })
  year: string;

  @Prop({ required: true })
  poster: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);

MovieSchema.index({ title: 'text' });

MovieSchema.index({ title: 1, year: 1 });

MovieSchema.index({ createdAt: -1 });