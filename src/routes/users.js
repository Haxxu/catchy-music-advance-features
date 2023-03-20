const router = require('express').Router();

const userController = require('../app/controllers/UserController');
const playlistController = require('../app/controllers/PlaylistController');
const albumController = require('../app/controllers/AlbumController');
const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');

// [POST] /api/users => create user
router.post('/', userController.createUser);
// [GET] /api/users/info => get user info
router.get('/info', adminAuth, userController.getUsersInfo);
// [POST] /api/users/verify-artist/:id (user_id) => verify artist
router.post('/verify-artist/:id', [adminAuth, validateObjectId], userController.verifyArtist);
// [POST] /api/users/unverify-artist/:id (user_d) => unverify artist
router.post('/unverify-artist/:id', [adminAuth, validateObjectId], userController.unverifyArtist);
// [POST] /api/users/verify-artist/:id (user_id) => verify artist
router.post('/verify-podcaster/:id', [adminAuth, validateObjectId], userController.verifyPodcaster);
// [POST] /api/users/unverify-artist/:id (user_d) => unverify artist
router.post('/unverify-podcaster/:id', [adminAuth, validateObjectId], userController.unverifyPodcaster);
// [POST] /api/users/update-password => change password
router.post('/update-password', userController.updatePassword);
// [PATCH] /api/users/freeze/:id => freeze user by id
router.patch('/freeze/:id', [adminAuth, validateObjectId], userController.freezeUser);
// [PATCH] /api/users/unfreeze/:id => unfreeze user by id
router.patch('/unfreeze/:id', [adminAuth, validateObjectId], userController.unfreezeUser);
// [GET] /api/users/context => get users by context
router.get('/context', adminAuth, userController.getUsersByContext);
// [GET] /api/users/:id => get user by id
router.get('/:id', [userAuth, validateObjectId], userController.getUserById);
// [GET] /api/users/:id/playlists => get user playlist by user_id
router.get('/:id/playlists', [userAuth, validateObjectId], playlistController.getUserPlaylists);
// [GET] /api/users/:id/albums => get user albums by user_id
router.get('/:id/albums', [userAuth, validateObjectId], albumController.getUserAlbums);
// [PUT] /api/users/:id => update user by id
router.put('/:id', [userAuth, validateObjectId], userController.updateUser);

// [DELETE] /api/users/freeze/:id => breeze user by id
// router.delete('/:id', [adminAuth, validateObjectId], userController.removeUser);

module.exports = router;
