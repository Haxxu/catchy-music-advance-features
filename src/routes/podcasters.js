const router = require('express').Router();

// const artistController = require('../app/controllers/ArtistController');
const podcasterController = require('../app/controllers/PodcasterController');
const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');
// const artistAuth = require('../app/middlewares/artistAuth');
const podcasterAuth = require('../app/middlewares/podcasterAuth');

// [GET] /api/podcasters/info => get artist info
router.get('/info', adminAuth, podcasterController.getPodcastersInfo);
// [GET] /api/podcasters/context?search => get artist by context
router.get('/context', adminAuth, podcasterController.getPodcastersByContext);
// [GET] /api/podcasters/context?search => get artist by context
router.get('/all', podcasterAuth, podcasterController.getPodcasters);
// [GET] /api/podcasters/:id/episodes => get episodes of podcaster
router.get('/:id/episodes', [userAuth, validateObjectId], podcasterController.getEpisodesOfPodcaster);
// [GET] /api/podcasters/:id/podcasts => get podcasts of podcaster
router.get('/:id/podcasts', [userAuth, validateObjectId], podcasterController.getPodcastsOfPodcaster);
// [GET] /api/artists/:id => get artist by id
router.get('/:id', [userAuth, validateObjectId], podcasterController.getPodcasterById);

module.exports = router;
