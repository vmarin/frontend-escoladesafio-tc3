import { IPost } from 'src/posts/schemas/models/post.interface';
import { PostRepository } from '../post.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from 'src/posts/schemas/post.schema';
import { Model } from 'mongoose';

export class PostMongooseRepository implements PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}
  getAllPosts(): Promise<IPost[]> {
    return this.postModel.find({});
  }
  searchPost(term: string): Promise<IPost[]> {
    const regex = new RegExp(term, 'i');
    return this.postModel
      .find({
        $or: [{ title: regex }, { description: regex }],
      })
      .exec();
  }
  getPost(postId: string): Promise<IPost> {
    return this.postModel.findById(postId).exec();
  }
  async createPost(post: IPost): Promise<void> {
    const createPost = new this.postModel(post);
    await createPost.save();
  }
  async updatePost(
    postId: string,
    post: Partial<IPost>,
  ): Promise<IPost | null> {
    const updateData = Object.fromEntries(
      Object.entries(post).filter(([, value]) => value !== undefined),
    );

    const result = await this.postModel
      .findOneAndUpdate({ _id: postId }, { $set: updateData }, { new: true })
      .exec();

    return result;
  }
  async deletePost(postId: string): Promise<IPost | null> {
    const result = this.postModel.findByIdAndDelete({ _id: postId }).exec();

    return result;
  }
}
