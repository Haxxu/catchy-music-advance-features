const router = require('express').Router();

const searchController = require('../app/controllers/SearchController');
const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');
const artistAuth = require('../app/middlewares/artistAuth');

// [POST] /api/playlists => create new playlist
router.get('', userAuth, searchController.search);

module.exports = router;
