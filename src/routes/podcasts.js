const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');
const podcasterAuth = require('../app/middlewares/podcasterAuth');
const podcastController = require('../app/controllers/PodcastController');

const router = require('express').Router();

// [GET] /api/podcasts/info => get podcasts info
router.get('/info', adminAuth, podcastController.getPodcastsInfo);

// [GET] /api/podcasts/context?search => get podcasts by context
router.get('/context', adminAuth, podcastController.getPodcastsByContext);

// [POST] /api/podcasts/:id/episodes => add track to album {track} (:id => album_id)
router.post('/:id/episodes', [podcasterAuth, validateObjectId], podcastController.addEpisodeToPodcast);

// [DELETE] /api/podcasts/:id/episodes => remove track from album {track} (:id => album_id)
router.delete('/:id/episodes', [podcasterAuth, validateObjectId], podcastController.removeEpisodeFromPodcast);

// [PUT] /api/albums/:id/release => toggle release date of album
router.put('/:id/release', [podcasterAuth, validateObjectId], podcastController.toggleReleasePodcast);

// [POST] /api/podcasts => create new podcast
router.post('/', podcasterAuth, podcastController.createPodcast);

// [GET] /api/albums/:id => get ablum by id
router.get('/:id', [userAuth, validateObjectId], podcastController.getPodcastById);

// [PUT] /api/podcasts/:id => update podcast by id
router.put('/:id', [podcasterAuth, validateObjectId], podcastController.updatePodcast);

// [DELETE] /api/podcasts/:id => delete podcast by id
router.delete('/:id', [podcasterAuth, validateObjectId], podcastController.deletePodcast);

module.exports = router;
