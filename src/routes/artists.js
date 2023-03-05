const router = require('express').Router();

const artistController = require('../app/controllers/ArtistController');
const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');
const artistAuth = require('../app/middlewares/artistAuth');

// [GET] /api/artists/info => get artist info
router.get('/info', adminAuth, artistController.getArtistsInfo);
// [GET] /api/artists/context?search => get artist by context
router.get('/context', adminAuth, artistController.getArtistsByContext);
// [GET] /api/artists/context?search => get artist by context
router.get('/all', artistAuth, artistController.getArtists);
// [GET] /api/artists/:id/tracks => get tracks of artist
router.get('/:id/tracks', [userAuth, validateObjectId], artistController.getTracksOfArtist);
// [GET] /api/artists/:id/albums => get albums of artist
router.get('/:id/albums', [userAuth, validateObjectId], artistController.getAlbumsOfArtist);
// [GET] /api/artists/:id => get artist by id
router.get('/:id', [userAuth, validateObjectId], artistController.getArtistById);

module.exports = router;
