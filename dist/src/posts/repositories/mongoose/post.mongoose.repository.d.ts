import { IPost } from 'src/posts/schemas/models/post.interface';
import { PostRepository } from '../post.repository';
import { Post } from 'src/posts/schemas/post.schema';
import { Model } from 'mongoose';
export declare class PostMongooseRepository implements PostRepository {
    private postModel;
    constructor(postModel: Model<Post>);
    getAllPosts(): Promise<IPost[]>;
    searchPost(term: string): Promise<IPost[]>;
    getPost(postId: string): Promise<IPost>;
    createPost(post: IPost): Promise<void>;
    updatePost(postId: string, post: Partial<IPost>): Promise<IPost | null>;
    deletePost(postId: string): Promise<IPost | null>;
}
