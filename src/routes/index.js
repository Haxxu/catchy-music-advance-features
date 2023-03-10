const userRoutes = require('./users');
const authRoutes = require('./auth');
const meRoutes = require('./me');
const trackRoutes = require('./tracks');
const lyricRoutes = require('./lyrics');
const genreRotues = require('./genres');
const albumRoutes = require('./albums');
const playlistRoutes = require('./playlists');
const artistRoutes = require('./artists');
const searchRoutes = require('./search');

const routes = (app) => {
    // - /api
    app.get('/', (req, res) =>
        res.json({
            message: 'Welcome to Catchy Music Api Website',
        }),
    );

    // - /api/auth
    app.use('/api/auth', authRoutes);

    // - /api/users
    app.use('/api/users', userRoutes);

    // - /api/me
    app.use('/api/me', meRoutes);

    // - /api/tracks
    app.use('/api/tracks', trackRoutes);

    // - /api/lyrics
    app.use('/api/lyrics', lyricRoutes);

    // - /api/genres
    app.use('/api/genres', genreRotues);

    // - /api/albums
    app.use('/api/albums', albumRoutes);

    // - /api/playlists
    app.use('/api/playlists', playlistRoutes);

    // - /api/artists
    app.use('/api/artists', artistRoutes);

    // - /api/search
    app.use('/api/search', searchRoutes);
};

module.exports = routes;
