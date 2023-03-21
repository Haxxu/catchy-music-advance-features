const { Comment } = require('../models/Comment');

class CommentService {
    static async deleteMany(condition) {
        await Comment.deleteMany(condition);
    }
}

module.exports = CommentService;
