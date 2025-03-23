import { PostService } from '../services/post.service';
import { z } from 'zod';
import { IUsers } from 'src/users/schemas/models/users.interface';
declare const createPostSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title?: string;
    description?: string;
}, {
    title?: string;
    description?: string;
}>;
declare const updatePostSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title?: string;
    description?: string;
}, {
    title?: string;
    description?: string;
}>;
type CreatePost = z.infer<typeof createPostSchema>;
type UpdatePost = z.infer<typeof updatePostSchema>;
export declare class PostController {
    private readonly postService;
    constructor(postService: PostService);
    getAllPosts(): Promise<import("../schemas/models/post.interface").IPost[]>;
    searchPost(term: string): Promise<import("../schemas/models/post.interface").IPost[]>;
    getPost(postId: string): Promise<import("../schemas/models/post.interface").IPost>;
    createPost({ title, description }: CreatePost, user: IUsers): Promise<void>;
    updatePost(postId: string, { title, description }: UpdatePost): Promise<import("../schemas/models/post.interface").IPost>;
    deletePost(postId: string): Promise<{
        message: string;
    }>;
}
export {};
