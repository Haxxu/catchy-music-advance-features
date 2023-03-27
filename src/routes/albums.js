const router = require('express').Router();

const albumController = require('../app/controllers/AlbumController');
const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');
const artistAuth = require('../app/middlewares/artistAuth');

// [POST] /api/albums => create new album
router.post('/', artistAuth, albumController.createAlbum);
// [GET] /api/albums/info => get ablums info
router.get('/info', adminAuth, albumController.getAlbumsInfo);
// [GET] /api/albums/context?search => get ablums by context
router.get('/context', adminAuth, albumController.getAlbumsByContext);
// [GET] /api/albums/tags => get ablums by tags
router.get('/tags', userAuth, albumController.getAlbumsByTags);
// [GET] /api/albums/:id/artists => get artists of album
router.get('/:id/artists', userAuth, albumController.getArtistsOfAlbum);
// [POST] /api/albums/:id/tracks => add track to album {track} (:id => album_id)
router.post('/:id/tracks', [artistAuth, validateObjectId], albumController.addTrackToAlbum);
// [DELETE] /api/albums/:id/tracks => remove track from album {track} (:id => album_id)
router.delete('/:id/tracks', [artistAuth, validateObjectId], albumController.removeTrackFromAlbum);
// [PUT] /api/albums/:id/release => toggle release date of album
router.put('/:id/release', [artistAuth, validateObjectId], albumController.toggleReleaseAlbum);
// [GET] /api/albums/:id => get ablum by id
router.get('/:id', [userAuth, validateObjectId], albumController.getAlbumById);
// [PUT] /api/albums/:id => update ablum by id
router.put('/:id', [artistAuth, validateObjectId], albumController.updateAlbum);
// [DELETE] /api/albums/:id => delete album by id
router.delete('/:id', [artistAuth, validateObjectId], albumController.deleteAlbum);

module.exports = router;
