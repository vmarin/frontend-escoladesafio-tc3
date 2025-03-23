"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const post_repository_1 = require("../repositories/post.repository");
let PostService = class PostService {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async getAllPosts() {
        const posts = await this.postRepository.getAllPosts();
        return posts;
    }
    async searchPost(term) {
        const post = this.postRepository.searchPost(term);
        return post;
    }
    async getPost(postId) {
        const post = await this.postRepository.getPost(postId);
        if (!post)
            throw new common_1.NotFoundException('Post não encontrado');
        return post;
    }
    async createPost(post, user) {
        const newPost = await this.postRepository.createPost({
            ...post,
            author: user.fullName,
        });
        return newPost;
    }
    async updatePost(postId, post) {
        const updatedPost = await this.postRepository.updatePost(postId, post);
        if (!updatedPost)
            throw new common_1.NotFoundException('Post não encontrado');
        return updatedPost;
    }
    async deletePost(postId) {
        const deletedPost = await this.postRepository.deletePost(postId);
        if (!deletedPost)
            throw new common_1.NotFoundException('Post não encontrado');
        return { message: `Post com id ${postId} deletado com sucesso.` };
    }
};
exports.PostService = PostService;
exports.PostService = PostService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [post_repository_1.PostRepository])
], PostService);
//# sourceMappingURL=post.service.js.map