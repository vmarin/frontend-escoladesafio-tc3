import { PostRepository } from '../repositories/post.repository';
import { IPost } from '../schemas/models/post.interface';
import { IUsers } from 'src/users/schemas/models/users.interface';
export declare class PostService {
    private readonly postRepository;
    constructor(postRepository: PostRepository);
    getAllPosts(): Promise<IPost[]>;
    searchPost(term: string): Promise<IPost[]>;
    getPost(postId: string): Promise<IPost>;
    createPost(post: IPost, user: IUsers): Promise<void>;
    updatePost(postId: string, post: Partial<IPost>): Promise<IPost>;
    deletePost(postId: string): Promise<{
        message: string;
    }>;
}
