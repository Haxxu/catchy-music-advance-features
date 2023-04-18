const { default: mongoose } = require('mongoose');
const { Library } = require('../models/Library');
const { Post } = require('../models/Post');

class PostService {
    constructor(id) {
        this.id = id;
    }

    static async createNewPost(payload) {
        const newPost = await new Post(payload).save();

        newPost.__v = undefined;
        (await newPost.populate({ path: 'owner', select: '_id name image type' })).save();
        return newPost;
    }

    static async findOne(condition) {
        return await Post.findOne(condition);
    }

    static async updatePostById(id, payload) {
        const updated_post = await Post.findOneAndUpdate(
            {
                _id: id,
            },
            {
                ...payload,
            },
            {
                new: true,
            },
        );

        (await updated_post.populate({ path: 'owner', select: '_id name image type' })).save();
        return updated_post;
    }

    static async deletePostById(id) {
        await Library.updateMany({}, { $pull: { likedPosts: { post: id } } });
        const deleted_post = await Post.findOneAndDelete({ _id: id });
        return deleted_post;
    }

    static async getPostsByFollowing(userId, limit) {
        const library = await Library.findOne({ owner: userId });

        const followingUserIds = library.followings.map((item) => mongoose.Types.ObjectId(item.user));
        const result = await Post.aggregate([
            {
                $match: {
                    owner: {
                        $in: followingUserIds,
                    },
                },
            },
            { $sort: { createdAt: -1 } },
            {
                $limit: parseInt(limit) || 8,
            },
        ]);
        const posts = await Post.populate(result, {
            path: 'owner',
            select: '_id name image type',
        });

        return posts;
    }

    static async getLikedPostsByUserId(userId) {
        const library = await Library.findOne({ owner: userId });
        const postIds = library.likedPosts.map((item) => item.post);
        const posts = await Post.find({ _id: { $in: postIds } }).populate({
            path: 'owner',
            select: '_id image name type',
        });

        const orderedPosts = [];
        for (const likedPost of library.likedPosts) {
            const post = posts.find((p) => p._id.equals(likedPost.post));
            if (post) {
                orderedPosts.push(post);
            }
        }

        return orderedPosts;
    }

    static async getPostsByUserId(userId, condition) {
        const posts = await Post.find({ owner: userId, ...condition })
            .sort({ createdAt: -1 })
            .populate({ path: 'owner', select: '_id type image name' });
        return posts;
    }

    static async getPosts(condition) {
        const posts = await Post.find({ ...condition })
            .sort({ createdAt: -1 })
            .populate({ path: 'owner', select: '_id type image name email' });
        return posts;
    }

    static async getPostsByRandom(limit) {
        const result = await Post.aggregate([
            {
                $sample: { size: parseInt(limit) || 8 },
            },
            { $sort: { createdAt: -1 } },
            {
                $limit: parseInt(limit) || 8,
            },
        ]);
        const posts = await Post.populate(result, {
            path: 'owner',
            select: '_id name image type',
        });

        return posts;
    }
}

module.exports = PostService;
