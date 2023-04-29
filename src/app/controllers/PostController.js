const moment = require('moment');

const ApiError = require('../../utils/ApiError');
const { validatePost, Post } = require('../models/Post');
const { User } = require('../models/User');
const PostService = require('../services/PostService');

class PostController {
    async getPostById(req, res, next) {
        try {
            const post = await Post.findOne({ _id: req.params.id }).populate({
                path: 'owner',
                select: '_id image name type',
            });
            if (!post) {
                return res.status(404).json({ message: 'Post does not exist' });
            }

            return res.status(200).json({ data: post, message: 'Get post successfully' });
        } catch (error) {
            console.log(error);
            return next(new ApiError());
        }
    }

    async createPost(req, res, next) {
        try {
            const { error } = validatePost(req.body);
            if (error) {
                return next(new ApiError(400, error.details[0].message));
            }

            const new_post = await PostService.createNewPost({
                ...req.body,
                owner: req.user?._id,
            });

            return res.status(200).json({ data: new_post, message: 'Create post successfully' });
        } catch (err) {
            console.log(err);
            return next(new ApiError());
        }
    }

    async updatePostById(req, res, next) {
        try {
            const { title, description, image } = req.body;
            const post = await Post.findOne({ _id: req.params.id });
            if (!post) {
                return res.status(404).json({ message: 'Post does not exist' });
            }

            if (req.user?._id !== post.owner.toString()) {
                return res.status(403).json({ message: "User don't have permission to perform this action" });
            }

            const updated_post = await PostService.updatePostById(req.params.id, {
                title,
                description,
                image,
            });

            return res.status(200).json({ data: updated_post, message: 'Update post successfully' });
        } catch (error) {
            console.log(error);
            return next(new ApiError());
        }
    }

    async deletePostById(req, res, next) {
        try {
            const post = await Post.findOne({ _id: req.params.id });
            if (!post) {
                return res.status(404).json({ message: 'Post does not exist' });
            }

            if (req.user?._id !== post.owner.toString() && req.user?.type !== 'admin') {
                return res.status(403).json({ message: "User don't have permission to perform this action" });
            }

            const deleted_post = await PostService.deletePostById(req.params.id);

            return res.status(200).json({ data: deleted_post, message: 'Delete post successfully' });
        } catch (error) {
            console.log(error);
            return next(new ApiError());
        }
    }

    async getPostsByTags(req, res, next) {
        try {
            const { tags, limit } = req.query;

            const data = {};

            if (tags) {
                if (tags.includes('following')) {
                    data.following = await PostService.getPostsByFollowing(req.user._id, limit);
                }

                if (tags.includes('random')) {
                    data.random = await PostService.getPostsByRandom(limit);
                }
            }

            let searchCondition = {};

            if (req.query.search && req.query.search.trim() !== '') {
                let search = req.query.search.trim();
                const users = await User.find({
                    $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }],
                }).select('_id');

                const userIds = users.map((user) => user._id.toString());

                searchCondition = {
                    $or: [
                        {
                            owner: { $in: userIds },
                        },
                        {
                            title: { $regex: search, $options: 'i' },
                        },
                        {
                            description: { $regex: search, $options: 'i' },
                        },
                    ],
                };
            }

            data.posts = await PostService.getPosts(searchCondition);

            // console.log(data.posts);

            return res.status(200).json({ data, message: 'Get posts by tags successfully' });
        } catch (error) {
            console.log(error);
            return next(new ApiError());
        }
    }

    async getPostsByUserId(req, res, next) {
        try {
            const user = await User.findOne({ _id: req.params.id });
            if (!user) {
                return res.status(404).json({ message: 'User does not exists' });
            }

            let searchCondition = {};
            if (req.query.search && req.query.search.trim() !== '') {
                let search = req.query.search.trim();

                searchCondition = {
                    $or: [
                        {
                            title: { $regex: search, $options: 'i' },
                        },
                        {
                            description: { $regex: search, $options: 'i' },
                        },
                    ],
                };
            }

            const posts = await PostService.getPostsByUserId(user._id, searchCondition);

            return res.status(200).json({ data: posts, message: 'Get user posts successfully' });
        } catch (error) {
            console.log(error);
            return next(new ApiError());
        }
    }

    // get posts info for admin
    async getPostsInfo(req, res, next) {
        try {
            const totalPosts = await Post.count('_id');

            const today = moment().startOf('day');

            const newPostsToday = await Post.find({
                createdAt: {
                    $gte: today.toDate(),
                    $lte: moment(today).endOf('day').toDate(),
                },
            }).count('_id');

            const newPostsThisMonth = await Post.find({
                createdAt: {
                    $gte: moment(today).startOf('month').toDate(),
                    $lte: moment(today).endOf('month').toDate(),
                },
            }).count('_id');

            const newPostsLastMonth = await Post.find({
                createdAt: {
                    $gte: moment(today).subtract(1, 'months').startOf('month').toDate(),
                    $lte: moment(today).subtract(1, 'months').endOf('month').toDate(),
                },
            }).count('_id');

            return res.status(200).send({
                data: { totalPosts, newPostsToday, newPostsThisMonth, newPostsLastMonth },
                message: 'Get posts info successfuly',
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({ message: 'Something went wrong' });
        }
    }
}

module.exports = new PostController();
