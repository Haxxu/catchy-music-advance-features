const router = require('express').Router();

const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');
const postController = require('../app/controllers/PostController');

// [PATCH] /api/posts/:id => update post by id
router.patch('/:id', userAuth, postController.updatePostById);

// [DELETE] /api/posts/:id => delete post by id
router.delete('/:id', userAuth, postController.deletePostById);

// [GET] /api/posts/:id => get post by id
router.get('/:id', userAuth, postController.getPostById);

// [POST] /api/posts => create post
router.post('/', userAuth, postController.createPost);

// [GET] /api/posts => get posts by tags
router.get('/', userAuth, postController.getPostsByTags);

module.exports = router;
