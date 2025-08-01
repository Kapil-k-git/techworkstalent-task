import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true }) // Remove unique: true to avoid duplication
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Single comprehensive index for email (unique + case-insensitive)
UserSchema.index(
  { email: 1 }, 
  { 
    unique: true, 
    collation: { locale: 'en', strength: 2 } 
  }
);
