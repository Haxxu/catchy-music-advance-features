const router = require('express').Router();

const lyricController = require('../app/controllers/LyricController');
const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');
const artistAuth = require('../app/middlewares/artistAuth');

// [POST] /api/lyrics => add lyric to track
router.post('/', [artistAuth], lyricController.addLyricToTrack);
// [GET] /api/lyrics/track/:id => get all lyrics of track(track_id)
router.get('/track/:id', userAuth, lyricController.getAllLyricsOfTrack);
// [POST] /api/lyrics/:id => update lyric by id
router.put('/:id', [artistAuth, validateObjectId], lyricController.updateLyric);
// [DELETE] /api/lyrics/:id => remove lyric by id
router.delete('/:id', [artistAuth, validateObjectId], lyricController.removeLyric);
// [DELETE] /api/lyrics/:id => remove lyric by id
router.get('/:id', [userAuth, validateObjectId], lyricController.getLyricById);

module.exports = router;
