const userAuth = require('../app/middlewares/userAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');
const podcasterAuth = require('../app/middlewares/podcasterAuth');
const podcastController = require('../app/controllers/PodcastController');

const router = require('express').Router();

// [POST] /api/podcasts => create new podcast
router.post('/', podcasterAuth, podcastController.createPodcast);

// [PUT] /api/podcasts/:id => update podcast by id
router.put('/:id', [podcasterAuth, validateObjectId], podcastController.updatePodcast);

// [DELETE] /api/podcasts/:id => delete podcast by id
router.delete('/:id', [podcasterAuth, validateObjectId], podcastController.deletePodcast);

module.exports = router;
