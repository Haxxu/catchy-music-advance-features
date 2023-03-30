const router = require('express').Router();

const trackController = require('../app/controllers/TrackController');
const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');
const podcasterAuth = require('../app/middlewares/podcasterAuth');

// [POST] /api/episodes => create new episode
router.post('/', podcasterAuth, trackController.createEpisode);

// [GET] /api/episodes/:id => get episode by id
router.get('/:id', [userAuth, validateObjectId], trackController.getEpisodeById);

// [PUT] /api/episodes/:id => update episode by id
router.put('/:id', [podcasterAuth, validateObjectId], trackController.updateEpisode);

// [DELETE] /api/episodes/:id => remove episode by id
router.delete('/:id', [podcasterAuth, validateObjectId], trackController.deleteEpisode);

module.exports = router;
