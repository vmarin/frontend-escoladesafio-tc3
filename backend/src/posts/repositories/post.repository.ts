import { IPost } from '../schemas/models/post.interface';
export abstract class PostRepository {
  abstract getAllPosts(): Promise<IPost[]>;
  abstract searchPost(term: string): Promise<IPost[]>;
  abstract getPost(postId: string): Promise<IPost>;
  abstract createPost(post: IPost): Promise<void>;
  abstract updatePost(
    postId: string,
    post: Partial<IPost>,
  ): Promise<IPost | null>;
  abstract deletePost(postId: string): Promise<IPost | null>;
}
