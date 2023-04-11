const router = require('express').Router();

const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');
const commentController = require('../app/controllers/CommentController');

// [POST] /api/comments/reply => reply comment
router.post('/reply', userAuth, commentController.replyComment);

// [PATCH] /api/comments/:id => update comment by id
router.patch('/:id', userAuth, commentController.updateCommentById);

// [DELETE] /api/comments/:id => delete comment by id
router.delete('/:id', userAuth, commentController.deleteCommentById);

// [POST] /api/comments => create new episode
router.post('/', userAuth, commentController.createComment);

// [GET] /api/comments?contextId
router.get('/', userAuth, commentController.getComments);

module.exports = router;
