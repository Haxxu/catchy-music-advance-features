const router = require('express').Router();

const genreController = require('../app/controllers/GenreController');
const userAuth = require('../app/middlewares/userAuth');
const adminAuth = require('../app/middlewares/adminAuth');
const validateObjectId = require('../app/middlewares/validateObjectId');
const artistAuth = require('../app/middlewares/artistAuth');

// [GET] /api/genres/:id => get genre by id
router.get('/:id', [userAuth, validateObjectId], genreController.getGenreById);
// [PUT] /api/genres/:id => update genre
router.put('/:id', [adminAuth, validateObjectId], genreController.updateGenre);
// [DELETE] /api/genres/:id => delete genre
router.delete('/:id', [adminAuth, validateObjectId], genreController.deleteGenre);
// [GET] /api/genres => get all genres
router.get('/', genreController.getAllGenres);
// [POST] /api/genres/ => create genre
router.post('/', adminAuth, genreController.createGenre);

module.exports = router;
