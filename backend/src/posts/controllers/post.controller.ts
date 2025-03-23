import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe';
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';
import { ApiBody } from '@nestjs/swagger';
import { Public } from 'src/shared/decotarors/public.decorator';
import { GetUser } from 'src/shared/decotarors/get-user-decorator';
import { IUsers } from 'src/users/schemas/models/users.interface';

const createPostSchema = z.object({
  title: z.string(),
  description: z.string(),
});

const updatePostSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

type CreatePost = z.infer<typeof createPostSchema>;
type UpdatePost = z.infer<typeof updatePostSchema>;

const SwaggerCreatePostSchema = {
  schema: {
    type: 'object',
    properties: {
      title: { type: 'string', example: 'Teste postagem' },
      description: { type: 'string', example: 'Descrição da postagem teste' },
    },
    required: ['title', 'description'],
  },
};

@UseInterceptors(LoggingInterceptor)
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Public()
  @Get()
  async getAllPosts() {
    return this.postService.getAllPosts();
  }
  @Public()
  @Get('search')
  async searchPost(@Query('term') term: string) {
    return this.postService.searchPost(term);
  }
  @Public()
  @Get(':postId')
  async getPost(@Param('postId') postId: string) {
    return this.postService.getPost(postId);
  }
  @Post()
  @ApiBody(SwaggerCreatePostSchema)
  async createPost(
    @Body(new ZodValidationPipe(createPostSchema))
    { title, description }: CreatePost,
    @GetUser() user: IUsers,
  ) {
    const newPost = await this.postService.createPost(
      { title, description },
      user,
    );
    console.log(newPost);
  }
  @Put(':postId')
  async updatePost(
    @Param('postId') postId: string,
    @Body(new ZodValidationPipe(updatePostSchema))
    { title, description }: UpdatePost,
  ) {
    return this.postService.updatePost(postId, { title, description });
  }
  @Delete(':postId')
  async deletePost(@Param('postId') postId: string) {
    return this.postService.deletePost(postId);
  }
}
