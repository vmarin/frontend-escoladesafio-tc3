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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostMongooseRepository = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const post_schema_1 = require("../../schemas/post.schema");
const mongoose_2 = require("mongoose");
let PostMongooseRepository = class PostMongooseRepository {
    constructor(postModel) {
        this.postModel = postModel;
    }
    getAllPosts() {
        return this.postModel.find({});
    }
    searchPost(term) {
        const regex = new RegExp(term, 'i');
        return this.postModel
            .find({
            $or: [{ title: regex }, { description: regex }],
        })
            .exec();
    }
    getPost(postId) {
        return this.postModel.findById(postId).exec();
    }
    async createPost(post) {
        const createPost = new this.postModel(post);
        await createPost.save();
    }
    async updatePost(postId, post) {
        const updateData = Object.fromEntries(Object.entries(post).filter(([, value]) => value !== undefined));
        const result = await this.postModel
            .findOneAndUpdate({ _id: postId }, { $set: updateData }, { new: true })
            .exec();
        return result;
    }
    async deletePost(postId) {
        const result = this.postModel.findByIdAndDelete({ _id: postId }).exec();
        return result;
    }
};
exports.PostMongooseRepository = PostMongooseRepository;
exports.PostMongooseRepository = PostMongooseRepository = __decorate([
    __param(0, (0, mongoose_1.InjectModel)(post_schema_1.Post.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PostMongooseRepository);
//# sourceMappingURL=post.mongoose.repository.js.map