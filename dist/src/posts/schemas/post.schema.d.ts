import { IPost } from './models/post.interface';
import mongoose, { HydratedDocument } from 'mongoose';
export type PostsDocument = HydratedDocument<Post>;
export declare class Post implements IPost {
    id?: string;
    title: string;
    description: string;
    author: string;
    created_at?: Date;
    modified_at?: Date;
}
export declare const PostsSchema: mongoose.Schema<Post, mongoose.Model<Post, any, any, any, mongoose.Document<unknown, any, Post> & Post & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Post, mongoose.Document<unknown, {}, mongoose.FlatRecord<Post>> & mongoose.FlatRecord<Post> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
