import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { IPost } from '../schemas/models/post.interface';
import { IUsers } from 'src/users/schemas/models/users.interface';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}
  async getAllPosts() {
    const posts = await this.postRepository.getAllPosts();
    return posts;
  }
  async searchPost(term: string) {
    const post = this.postRepository.searchPost(term);

    return post;
  }
  async getPost(postId: string) {
    const post = await this.postRepository.getPost(postId);

    if (!post) throw new NotFoundException('Post não encontrado');
    return post;
  }

  async createPost(post: IPost, user: IUsers) {
    const newPost = await this.postRepository.createPost({
      ...post,
      author: user.fullName,
    });

    return newPost;
  }

  async updatePost(postId: string, post: Partial<IPost>) {
    const updatedPost = await this.postRepository.updatePost(postId, post);

    if (!updatedPost) throw new NotFoundException('Post não encontrado');
    return updatedPost;
  }

  async deletePost(postId: string) {
    const deletedPost = await this.postRepository.deletePost(postId);

    if (!deletedPost) throw new NotFoundException('Post não encontrado');
    return { message: `Post com id ${postId} deletado com sucesso.` };
  }
}
