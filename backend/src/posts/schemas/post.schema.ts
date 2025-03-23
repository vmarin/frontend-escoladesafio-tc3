import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IPost } from './models/post.interface';
import mongoose, { HydratedDocument } from 'mongoose';

export type PostsDocument = HydratedDocument<Post>;
@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'modified_at' } })
export class Post implements IPost {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  id?: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  author: string;
  @Prop()
  created_at?: Date;
  @Prop()
  modified_at?: Date;
}

export const PostsSchema = SchemaFactory.createForClass(Post);
