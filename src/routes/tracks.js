const router = require('express').Router();

const trackController = require('../app/controllers/TrackController');
const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');
const artistAuth = require('../app/middlewares/artistAuth');
const playTrackLimiter = require('../app/middlewares/playTrackLimiter');

// [POST] /api/tracks => create new track
router.post('/', artistAuth, trackController.createTrack);
// [GET] /api/tracks/?search= => Get tracks by context
router.get('/context', adminAuth, trackController.getTracksByContext);
// [GET] /api/tracks/info => get tracks info
router.get('/info', adminAuth, trackController.getTracksInfo);
// [GET] /api/tracks/:id/lyrics => get lyrics of track
router.get('/:id/lyrics', [userAuth, validateObjectId], trackController.getLyricsOfTrack);
// [GET] /api/tracks/:id => get track by id
router.get('/:id', [userAuth, validateObjectId], trackController.getTrackById);
// [PUT] /api/tracks/:id => update track by id
router.put('/:id', [artistAuth, validateObjectId], trackController.updateTrack);
// [DELETE] /api/tracks/:id => remove track by id
router.delete('/:id', [artistAuth, validateObjectId], trackController.deleteTrack);

// [POST] /api/tracks/:id/plays => Play track
// router.post('/:id/plays', [userAuth, validateObjectId], trackController.playTrack);

module.exports = router;
